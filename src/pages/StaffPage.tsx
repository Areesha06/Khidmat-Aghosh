import { motion, useInView } from "framer-motion";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  addStaffMember,
  deleteStaffMember,
  fetchStaffMembers,
  type StaffMember,
  updateStaffMember,
} from "@/lib/publicData";
import { uploadImageToSupabase } from "@/lib/media";

const StaffPage = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const loadStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchStaffMembers();
      setStaffData(data);
    } catch (error) {
      toast({
        title: "Could not load team",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setBio("");
    setPhoto(null);
  };

  const onEdit = (staff: StaffMember) => {
    setEditingId(staff.id);
    setName(staff.name);
    setRole(staff.role);
    setBio(staff.bio || "");
    setPhoto(null);
  };

  const onDelete = async (id: number) => {
    if (!window.confirm("Delete this team member?")) {
      return;
    }

    try {
      await deleteStaffMember(id);
      await loadStaff();
      toast({ title: "Deleted", description: "Team member removed." });
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      toast({
        title: "Could not delete",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined;
      if (photo) {
        const uploaded = await uploadImageToSupabase(photo, "staff");
        imageUrl = uploaded.publicUrl;
      }

      if (editingId) {
        await updateStaffMember(editingId, {
          name: name.trim(),
          role: role.trim(),
          bio: bio.trim(),
          imageUrl,
        });
      } else {
        await addStaffMember({
          name: name.trim(),
          role: role.trim(),
          bio: bio.trim(),
          imageUrl,
        });
      }

      resetForm();
      await loadStaff();
      toast({
        title: editingId ? "Staff updated" : "Staff added",
        description: editingId ? "Team member changes saved." : "Team member saved to database.",
      });
    } catch (error) {
      toast({
        title: "Could not save staff",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Our Team
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display"
            >
              The People Behind Our Mission
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section ref={ref} className="section-padding">
        <div className="container-narrow">
          {isAdmin && (
            <form onSubmit={onSubmit} className="mb-12 grid gap-4 rounded-xl border border-border bg-card p-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-foreground">
                  {editingId ? "Edit Team Member" : "Add Team Member"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-name">Name</Label>
                <Input id="staff-name" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staff-role">Role</Label>
                <Input id="staff-role" value={role} onChange={(event) => setRole(event.target.value)} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="staff-bio">Bio</Label>
                <Textarea id="staff-bio" value={bio} onChange={(event) => setBio(event.target.value)} rows={3} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="staff-photo">Photo</Label>
                <Input id="staff-photo" type="file" accept="image/*" onChange={(event) => setPhoto(event.target.files?.[0] || null)} />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <Button className="justify-self-start" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingId ? "Update Team Member" : "Add Team Member"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          )}

          {isLoading && <p className="mb-6 text-sm text-muted-foreground">Loading team members...</p>}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
            {staffData.map((staff, index) => (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="aspect-[3/4] bg-muted mb-6 flex items-center justify-center overflow-hidden group">
                  {staff.image_url ? (
                    <img src={staff.image_url} alt={staff.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-7xl font-display text-muted-foreground/20 group-hover:scale-110 transition-transform duration-500">
                      {staff.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-display mb-1">{staff.name}</h3>
                <p className="text-sm text-primary uppercase tracking-widest mb-3">{staff.role}</p>
                <p className="text-muted-foreground leading-relaxed">{staff.bio || "No bio available."}</p>
                {isAdmin && (
                  <div className="mt-4 flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(staff)}>
                      <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(staff.id)}>
                      <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {!isLoading && staffData.length === 0 && (
            <p className="mt-6 text-sm text-muted-foreground">No team members available yet.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StaffPage;
