import { motion, useInView } from "framer-motion";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  addGalleryImage,
  deleteGalleryImage,
  fetchGalleryImages,
  type GalleryImage,
  updateGalleryImage,
} from "@/lib/publicData";
import { uploadImageToSupabase } from "@/lib/media";

const GalleryPage = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingImageUrl, setEditingImageUrl] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [category, setCategory] = useState("General");
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const loadGallery = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGalleryImages();
      setGalleryImages(data);
    } catch (error) {
      toast({
        title: "Could not load gallery",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setEditingImageUrl(null);
    setCategory("General");
    setCaption("");
    setImageFile(null);
  };

  const onEdit = (image: GalleryImage) => {
    setEditingId(image.id);
    setEditingImageUrl(image.image_url);
    setCategory(image.category);
    setCaption(image.caption);
    setImageFile(null);
  };

  const onDelete = async (id: number) => {
    if (!window.confirm("Delete this gallery image?")) {
      return;
    }

    try {
      await deleteGalleryImage(id);
      await loadGallery();
      toast({ title: "Deleted", description: "Gallery image removed." });
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      toast({
        title: "Could not delete image",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const categories = ["All", ...Array.from(new Set(galleryImages.map((img) => img.category)))];

  const onUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!imageFile && !editingId) {
      toast({ title: "Image required", description: "Select an image file.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = editingImageUrl || undefined;
      if (imageFile) {
        const uploaded = await uploadImageToSupabase(imageFile, "gallery");
        imageUrl = uploaded.publicUrl;
      }

      if (editingId) {
        await updateGalleryImage(editingId, {
          category: category.trim() || "General",
          caption: caption.trim() || "Gallery image",
          imageUrl,
        });
      } else {
        await addGalleryImage({
          category: category.trim() || "General",
          caption: caption.trim() || "Gallery image",
          imageUrl: imageUrl || "",
        });
      }

      resetForm();
      await loadGallery();
      toast({
        title: editingId ? "Image updated" : "Image added",
        description: editingId ? "Gallery entry updated." : "Gallery image uploaded to Supabase.",
      });
    } catch (error) {
      toast({
        title: "Could not upload image",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredImages = activeCategory === "All" 
    ? galleryImages 
    : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero */}
      <section className="h-[60vh] bg-foreground text-background flex items-end">
        <div className="section-padding pb-16 w-full">
          <div className="container-narrow">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-widest text-primary mb-4 block"
            >
              Gallery
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display"
            >
              Moments That Matter
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section ref={ref} className="section-padding">
        <div className="container-narrow">
          {isAdmin && (
            <form onSubmit={onUpload} className="mb-10 grid gap-4 rounded-xl border border-border bg-card p-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-foreground">
                  {editingId ? "Edit Gallery Image" : "Add Gallery Image"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gallery-category">Category</Label>
                <Input id="gallery-category" value={category} onChange={(event) => setCategory(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gallery-caption">Caption</Label>
                <Input id="gallery-caption" value={caption} onChange={(event) => setCaption(event.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="gallery-image">Image</Label>
                <Input id="gallery-image" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <Button className="justify-self-start" disabled={isSubmitting}>
                  {isSubmitting ? "Uploading..." : editingId ? "Update Gallery Entry" : "Upload to Supabase"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          )}

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 text-sm uppercase tracking-widest transition-colors ${
                  activeCategory === category
                    ? "bg-foreground text-background"
                    : "border border-border hover:border-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading && <div className="col-span-full text-sm text-muted-foreground">Loading gallery...</div>}

            {!isLoading && filteredImages.length === 0 && (
              <div className="col-span-full text-sm text-muted-foreground">No images available in this category yet.</div>
            )}

            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative aspect-square bg-muted overflow-hidden cursor-pointer"
              >
                <img src={image.image_url} alt={image.caption} className="h-full w-full object-cover" />
                {isAdmin && (
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 bg-background/90"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onEdit(image);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onDelete(image.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/80 transition-colors duration-300 flex items-end p-6">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                    <p className="text-background text-sm font-medium">{image.caption}</p>
                    <p className="text-background/60 text-xs uppercase tracking-widest">{image.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GalleryPage;
