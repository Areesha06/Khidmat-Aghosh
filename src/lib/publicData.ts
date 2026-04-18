import { supabase } from "@/integrations/supabase/client";

export interface PublicChild {
  id: number;
  name: string;
  dob: string;
  class: string | null;
  profile_image_url: string | null;
}

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  created_at: string;
}

export interface DonationRecord {
  id: number;
  donor_name: string;
  amount: number;
  purpose: string | null;
  donated_at: string;
  receipt_image_url: string | null;
}

export interface GalleryImage {
  id: number;
  category: string;
  caption: string;
  image_url: string;
  created_at: string;
}

export async function fetchPublicChildren() {
  const { data, error } = await supabase
    .from("children")
    .select("id,name,dob,class,profile_image_url")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as PublicChild[];
}

export async function fetchStaffMembers() {
  const { data, error } = await supabase
    .from("staff_members")
    .select("id,name,role,bio,image_url,created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as StaffMember[];
}

export async function addStaffMember(input: {
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
}) {
  const { error } = await supabase.from("staff_members").insert({
    name: input.name,
    role: input.role,
    bio: input.bio || null,
    image_url: input.imageUrl || null,
  });

  if (error) throw error;
}

export async function updateStaffMember(
  id: number,
  input: {
    name: string;
    role: string;
    bio?: string;
    imageUrl?: string;
  },
) {
  const payload: Record<string, unknown> = {
    name: input.name,
    role: input.role,
    bio: input.bio || null,
    updated_at: new Date().toISOString(),
  };

  if (input.imageUrl !== undefined) {
    payload.image_url = input.imageUrl;
  }

  const { error } = await supabase.from("staff_members").update(payload).eq("id", id);

  if (error) throw error;
}

export async function deleteStaffMember(id: number) {
  const { error } = await supabase.from("staff_members").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchDonationRecords() {
  const { data, error } = await supabase
    .from("donation_records")
    .select("id,donor_name,amount,purpose,donated_at,receipt_image_url")
    .order("donated_at", { ascending: false });

  if (error) throw error;
  return (data || []) as DonationRecord[];
}

export async function addDonationRecord(input: {
  donorName: string;
  amount: number;
  purpose?: string;
  donatedAt?: string;
  receiptImageUrl?: string;
}) {
  const { error } = await supabase.from("donation_records").insert({
    donor_name: input.donorName,
    amount: input.amount,
    purpose: input.purpose || null,
    donated_at: input.donatedAt || new Date().toISOString().slice(0, 10),
    receipt_image_url: input.receiptImageUrl || null,
  });

  if (error) throw error;
}

export async function updateDonationRecord(
  id: number,
  input: {
    donorName: string;
    amount: number;
    purpose?: string;
    donatedAt?: string;
    receiptImageUrl?: string;
  },
) {
  const payload: Record<string, unknown> = {
    donor_name: input.donorName,
    amount: input.amount,
    purpose: input.purpose || null,
    donated_at: input.donatedAt || new Date().toISOString().slice(0, 10),
  };

  if (input.receiptImageUrl !== undefined) {
    payload.receipt_image_url = input.receiptImageUrl;
  }

  const { error } = await supabase.from("donation_records").update(payload).eq("id", id);

  if (error) throw error;
}

export async function deleteDonationRecord(id: number) {
  const { error } = await supabase.from("donation_records").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchGalleryImages() {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("id,category,caption,image_url,created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as GalleryImage[];
}

export async function addGalleryImage(input: {
  category: string;
  caption: string;
  imageUrl: string;
}) {
  const { error } = await supabase.from("gallery_images").insert({
    category: input.category,
    caption: input.caption,
    image_url: input.imageUrl,
  });

  if (error) throw error;
}

export async function updateGalleryImage(
  id: number,
  input: {
    category: string;
    caption: string;
    imageUrl?: string;
  },
) {
  const payload: Record<string, unknown> = {
    category: input.category,
    caption: input.caption,
  };

  if (input.imageUrl !== undefined) {
    payload.image_url = input.imageUrl;
  }

  const { error } = await supabase.from("gallery_images").update(payload).eq("id", id);
  if (error) throw error;
}

export async function deleteGalleryImage(id: number) {
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) throw error;
}
