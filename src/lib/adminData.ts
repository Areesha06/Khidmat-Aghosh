import { supabase } from "@/integrations/supabase/client";

export interface SchoolOption {
  id: number;
  name: string;
}

export interface MotherOption {
  cnic: string;
  name: string;
}

export interface GuardianOption {
  id: number;
  name: string;
}

export interface DonorOption {
  id: number;
  name: string;
}

export interface ChildOption {
  id: number;
  name: string;
}

export interface AdminChildRecord {
  id: number;
  name: string;
  dob: string;
  siblings_count: number;
  floor: string | null;
  room: string | null;
  admission_date: string | null;
  school_id: number | null;
  class: string | null;
  father_name: string | null;
  father_dod: string | null;
  mother_cnic: string | null;
  primary_guardian_id: number | null;
  profile_image_url: string | null;
}

export interface AdminLookups {
  schools: SchoolOption[];
  mothers: MotherOption[];
  guardians: GuardianOption[];
  donors: DonorOption[];
  children: ChildOption[];
}

export async function fetchAdminLookups(): Promise<AdminLookups> {
  const [schoolsRes, mothersRes, guardiansRes, donorsRes, childrenRes] = await Promise.all([
    supabase.from("schools").select("id,name").order("name"),
    supabase.from("mothers").select("cnic,name").order("name"),
    supabase.from("guardians").select("id,name").order("name"),
    supabase.from("donors").select("id,name").order("name"),
    supabase.from("children").select("id,name").order("name"),
  ]);

  const errors = [schoolsRes.error, mothersRes.error, guardiansRes.error, donorsRes.error, childrenRes.error].filter(Boolean);
  if (errors.length) {
    throw new Error(errors[0]?.message || "Could not load lookup records.");
  }

  return {
    schools: schoolsRes.data || [],
    mothers: mothersRes.data || [],
    guardians: guardiansRes.data || [],
    donors: donorsRes.data || [],
    children: childrenRes.data || [],
  };
}

export async function createSchool(name: string) {
  const { error } = await supabase.from("schools").insert({ name });
  if (error) throw error;
}

export async function updateSchool(id: number, name: string) {
  const { error } = await supabase.from("schools").update({ name }).eq("id", id);
  if (error) throw error;
}

export async function deleteSchool(id: number) {
  const { error } = await supabase.from("schools").delete().eq("id", id);
  if (error) throw error;
}

export async function getChildCountForSchool(schoolId: number) {
  const { count, error } = await supabase
    .from("children")
    .select("id", { count: "exact", head: true })
    .eq("school_id", schoolId);

  if (error) throw error;
  return count || 0;
}

export async function reassignChildrenFromSchool(sourceSchoolId: number, targetSchoolId: number | null) {
  const { error } = await supabase
    .from("children")
    .update({ school_id: targetSchoolId })
    .eq("school_id", sourceSchoolId);

  if (error) throw error;
}

export async function createMother(input: { cnic: string; name: string; maritalStatus?: string; occupation?: string }) {
  const { error } = await supabase.from("mothers").insert({
    cnic: input.cnic,
    name: input.name,
    marital_status: input.maritalStatus || null,
    occupation: input.occupation || null,
  });
  if (error) throw error;
}

export async function createGuardian(name: string) {
  const { error } = await supabase.from("guardians").insert({ name });
  if (error) throw error;
}

export async function createDonor(input: { name: string; careOf?: string; contactNumber?: string }) {
  const { data, error } = await supabase.from("donors").insert({
    name: input.name,
    care_of: input.careOf || null,
  }).select("id").single();

  if (error) throw error;

  if (input.contactNumber) {
    const { error: contactError } = await supabase.from("donor_contacts").insert({
      donor_id: data.id,
      contact_number: input.contactNumber,
    });
    if (contactError) throw contactError;
  }
}

export async function createChild(input: {
  name: string;
  dob: string;
  siblingsCount: number;
  floor?: string;
  room?: string;
  admissionDate?: string;
  schoolId?: number;
  className?: string;
  fatherName?: string;
  fatherDod?: string;
  motherCnic?: string;
  primaryGuardianId?: number;
  profileImageUrl?: string;
}) {
  const { error } = await supabase.from("children").insert({
    name: input.name,
    dob: input.dob,
    siblings_count: input.siblingsCount,
    floor: input.floor || null,
    room: input.room || null,
    admission_date: input.admissionDate || null,
    school_id: input.schoolId || null,
    class: input.className || null,
    father_name: input.fatherName || null,
    father_dod: input.fatherDod || null,
    mother_cnic: input.motherCnic || null,
    primary_guardian_id: input.primaryGuardianId || null,
    profile_image_url: input.profileImageUrl || null,
  });
  if (error) throw error;
}

export async function fetchChildrenForAdmin(): Promise<AdminChildRecord[]> {
  const { data, error } = await supabase
    .from("children")
    .select(
      "id,name,dob,siblings_count,floor,room,admission_date,school_id,class,father_name,father_dod,mother_cnic,primary_guardian_id,profile_image_url",
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as AdminChildRecord[];
}

export async function updateChildRecord(
  id: number,
  input: {
    name: string;
    dob: string;
    siblingsCount: number;
    floor?: string;
    room?: string;
    admissionDate?: string;
    schoolId?: number;
    className?: string;
    fatherName?: string;
    fatherDod?: string;
    motherCnic?: string;
    primaryGuardianId?: number;
    profileImageUrl?: string;
  },
) {
  const payload: Record<string, unknown> = {
    name: input.name,
    dob: input.dob,
    siblings_count: input.siblingsCount,
    floor: input.floor || null,
    room: input.room || null,
    admission_date: input.admissionDate || null,
    school_id: input.schoolId || null,
    class: input.className || null,
    father_name: input.fatherName || null,
    father_dod: input.fatherDod || null,
    mother_cnic: input.motherCnic || null,
    primary_guardian_id: input.primaryGuardianId || null,
  };

  if (input.profileImageUrl !== undefined) {
    payload.profile_image_url = input.profileImageUrl || null;
  }

  const { error } = await supabase.from("children").update(payload).eq("id", id);
  if (error) throw error;
}

export async function deleteChildRecord(id: number) {
  const { error } = await supabase.from("children").delete().eq("id", id);
  if (error) throw error;
}

export async function linkGuardianToChild(input: { guardianId: number; childId: number; relationship: string }) {
  const { error } = await supabase.from("orphan_guardians").insert({
    guardian_id: input.guardianId,
    child_id: input.childId,
    relationship: input.relationship,
  });
  if (error) throw error;
}

export async function linkDonorToChild(input: {
  donorId: number;
  childId: number;
  frequency: "monthly" | "quarterly" | "yearly" | "one-time";
  sponsorshipStartDate?: string;
  sponsorshipEndDate?: string;
  status: "active" | "paused" | "ended";
}) {
  const { error } = await supabase.from("orphan_donors").insert({
    donor_id: input.donorId,
    child_id: input.childId,
    frequency: input.frequency,
    sponsorship_start_date: input.sponsorshipStartDate || null,
    sponsorship_end_date: input.sponsorshipEndDate || null,
    status: input.status,
  });
  if (error) throw error;
}
