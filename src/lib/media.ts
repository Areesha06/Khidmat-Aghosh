import { supabase } from "@/integrations/supabase/client";

const MEDIA_BUCKET = "media";

async function compressImage(file: File) {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Keep tiny images unchanged to avoid unnecessary processing.
  if (file.size < 250 * 1024) {
    return file;
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not load image for compression."));
      img.src = imageUrl;
    });

    const maxDimension = 1600;
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0, width, height);

    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const quality = outputType === "image/jpeg" ? 0.82 : undefined;

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, outputType, quality);
    });

    if (!blob) {
      return file;
    }

    const extension = outputType === "image/png" ? "png" : "jpg";
    const compressed = new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.${extension}`, {
      type: outputType,
      lastModified: Date.now(),
    });

    return compressed.size < file.size ? compressed : file;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export async function uploadImageToSupabase(file: File, folder: string) {
  const optimizedFile = await compressImage(file);
  const extension = optimizedFile.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeFolder = folder.replace(/^\/+|\/+$/g, "");
  const filePath = `${safeFolder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(filePath, optimizedFile, {
    cacheControl: "3600",
    upsert: false,
    contentType: optimizedFile.type || "image/jpeg",
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl: data.publicUrl,
  };
}
