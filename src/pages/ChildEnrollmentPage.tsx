import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  createChild,
  deleteChildRecord,
  fetchAdminLookups,
  fetchChildrenForAdmin,
  linkDonorToChild,
  linkGuardianToChild,
  type AdminChildRecord,
  type AdminLookups,
  updateChildRecord,
} from "@/lib/adminData";
import { uploadImageToSupabase } from "@/lib/media";

const ChildEnrollmentPage = () => {
  const { toast } = useToast();
  const [lookups, setLookups] = useState<AdminLookups>({ schools: [], mothers: [], guardians: [], donors: [], children: [] });
  const [childRows, setChildRows] = useState<AdminChildRecord[]>([]);
  const [isLoadingLookups, setIsLoadingLookups] = useState(true);

  const [childName, setChildName] = useState("");
  const [dob, setDob] = useState("");
  const [siblingsCount, setSiblingsCount] = useState("0");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [className, setClassName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [fatherDod, setFatherDod] = useState("");
  const [motherCnic, setMotherCnic] = useState("");
  const [primaryGuardianId, setPrimaryGuardianId] = useState("");
  const [childPhoto, setChildPhoto] = useState<File | null>(null);
  const [editingChildId, setEditingChildId] = useState<number | null>(null);

  const [linkChildId, setLinkChildId] = useState("");
  const [linkGuardianId, setLinkGuardianId] = useState("");
  const [relationship, setRelationship] = useState("");

  const [sponsorChildId, setSponsorChildId] = useState("");
  const [sponsorDonorId, setSponsorDonorId] = useState("");
  const [frequency, setFrequency] = useState<"monthly" | "quarterly" | "yearly" | "one-time">("monthly");
  const [status, setStatus] = useState<"active" | "paused" | "ended">("active");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [busySection, setBusySection] = useState<"child" | "guardian" | "donor" | null>(null);

  const refreshLookups = async () => {
    setIsLoadingLookups(true);
    try {
      const [data, children] = await Promise.all([fetchAdminLookups(), fetchChildrenForAdmin()]);
      setLookups(data);
      setChildRows(children);
    } catch (error) {
      toast({
        title: "Lookup load failed",
        description: error instanceof Error ? error.message : "Could not load dropdown data.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLookups(false);
    }
  };

  useEffect(() => {
    refreshLookups();
  }, []);

  const onCreateChild = async (event: FormEvent) => {
    event.preventDefault();
    setBusySection("child");

    try {
      let profileImageUrl: string | undefined;
      if (childPhoto) {
        const uploaded = await uploadImageToSupabase(childPhoto, "children");
        profileImageUrl = uploaded.publicUrl;
      }

      if (editingChildId) {
        await updateChildRecord(editingChildId, {
          name: childName.trim(),
          dob,
          siblingsCount: Number(siblingsCount) || 0,
          floor: floor.trim(),
          room: room.trim(),
          admissionDate,
          schoolId: schoolId ? Number(schoolId) : undefined,
          className: className.trim(),
          fatherName: fatherName.trim(),
          fatherDod,
          motherCnic: motherCnic || undefined,
          primaryGuardianId: primaryGuardianId ? Number(primaryGuardianId) : undefined,
          profileImageUrl,
        });
      } else {
        await createChild({
          name: childName.trim(),
          dob,
          siblingsCount: Number(siblingsCount) || 0,
          floor: floor.trim(),
          room: room.trim(),
          admissionDate,
          schoolId: schoolId ? Number(schoolId) : undefined,
          className: className.trim(),
          fatherName: fatherName.trim(),
          fatherDod,
          motherCnic: motherCnic || undefined,
          primaryGuardianId: primaryGuardianId ? Number(primaryGuardianId) : undefined,
          profileImageUrl,
        });
      }

      setChildName("");
      setDob("");
      setSiblingsCount("0");
      setFloor("");
      setRoom("");
      setAdmissionDate("");
      setSchoolId("");
      setClassName("");
      setFatherName("");
      setFatherDod("");
      setMotherCnic("");
      setPrimaryGuardianId("");
      setChildPhoto(null);
      setEditingChildId(null);
      await refreshLookups();
      toast({
        title: editingChildId ? "Child updated" : "Child added",
        description: editingChildId ? "Child record updated successfully." : "Child enrollment record created.",
      });
    } catch (error) {
      toast({
        title: "Create failed",
        description: error instanceof Error ? error.message : "Could not create child.",
        variant: "destructive",
      });
    } finally {
      setBusySection(null);
    }
  };

  const onEditChild = (child: AdminChildRecord) => {
    setEditingChildId(child.id);
    setChildName(child.name);
    setDob(child.dob || "");
    setSiblingsCount(String(child.siblings_count ?? 0));
    setFloor(child.floor || "");
    setRoom(child.room || "");
    setAdmissionDate(child.admission_date || "");
    setSchoolId(child.school_id ? String(child.school_id) : "");
    setClassName(child.class || "");
    setFatherName(child.father_name || "");
    setFatherDod(child.father_dod || "");
    setMotherCnic(child.mother_cnic || "");
    setPrimaryGuardianId(child.primary_guardian_id ? String(child.primary_guardian_id) : "");
    setChildPhoto(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDeleteChild = async (id: number) => {
    if (!window.confirm("Delete this child record? Linked guardians/sponsors will be removed.")) {
      return;
    }

    setBusySection("child");
    try {
      await deleteChildRecord(id);
      if (editingChildId === id) {
        setEditingChildId(null);
      }
      await refreshLookups();
      toast({ title: "Child deleted", description: "Child record removed." });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Could not delete child.",
        variant: "destructive",
      });
    } finally {
      setBusySection(null);
    }
  };

  const cancelChildEdit = () => {
    setEditingChildId(null);
    setChildName("");
    setDob("");
    setSiblingsCount("0");
    setFloor("");
    setRoom("");
    setAdmissionDate("");
    setSchoolId("");
    setClassName("");
    setFatherName("");
    setFatherDod("");
    setMotherCnic("");
    setPrimaryGuardianId("");
    setChildPhoto(null);
  };

  const onLinkGuardian = async (event: FormEvent) => {
    event.preventDefault();
    setBusySection("guardian");

    try {
      await linkGuardianToChild({
        childId: Number(linkChildId),
        guardianId: Number(linkGuardianId),
        relationship: relationship.trim(),
      });
      setLinkChildId("");
      setLinkGuardianId("");
      setRelationship("");
      toast({ title: "Guardian linked", description: "Child-guardian relationship saved." });
    } catch (error) {
      toast({
        title: "Link failed",
        description: error instanceof Error ? error.message : "Could not link guardian.",
        variant: "destructive",
      });
    } finally {
      setBusySection(null);
    }
  };

  const onLinkDonor = async (event: FormEvent) => {
    event.preventDefault();
    setBusySection("donor");

    try {
      await linkDonorToChild({
        childId: Number(sponsorChildId),
        donorId: Number(sponsorDonorId),
        frequency,
        status,
        sponsorshipStartDate: startDate,
        sponsorshipEndDate: endDate,
      });
      setSponsorChildId("");
      setSponsorDonorId("");
      setStartDate("");
      setEndDate("");
      setFrequency("monthly");
      setStatus("active");
      toast({ title: "Donor linked", description: "Sponsorship mapping saved." });
    } catch (error) {
      toast({
        title: "Link failed",
        description: error instanceof Error ? error.message : "Could not link donor.",
        variant: "destructive",
      });
    } finally {
      setBusySection(null);
    }
  };

  return (
    <div className="min-h-screen admin-bg">
      <Navigation />

      <section className="relative h-[52vh] text-background flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="absolute inset-0 admin-grid-pattern opacity-20" />
        <div className="section-padding pb-16 w-full relative z-10">
          <div className="container-narrow">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="admin-pill mb-4"
            >
              Enrollment
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display"
            >
              Add Children and Relationships
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 max-w-2xl text-background/75"
            >
              Use this flow to create child records and map guardianship and sponsorship in a single operational workspace.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow space-y-8">
          <Card className="admin-section">
            <CardHeader>
              <CardTitle className="text-3xl font-display">{editingChildId ? "Edit Child" : "New Child"}</CardTitle>
              <CardDescription>
                {editingChildId
                  ? "Update selected child record details below."
                  : "Create the main child record first, then link guardians and donors below."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid md:grid-cols-2 gap-4" onSubmit={onCreateChild}>
                <div className="space-y-2">
                  <Label htmlFor="child-name">Child Name</Label>
                  <Input id="child-name" value={childName} onChange={(event) => setChildName(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="child-dob">Date of Birth</Label>
                  <Input id="child-dob" type="date" value={dob} onChange={(event) => setDob(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="child-siblings">No. of Siblings</Label>
                  <Input id="child-siblings" type="number" min={0} value={siblingsCount} onChange={(event) => setSiblingsCount(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="child-admission">Admission Date</Label>
                  <Input id="child-admission" type="date" value={admissionDate} onChange={(event) => setAdmissionDate(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="child-floor">Floor</Label>
                  <Input id="child-floor" value={floor} onChange={(event) => setFloor(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="child-room">Room</Label>
                  <Input id="child-room" value={room} onChange={(event) => setRoom(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>School</Label>
                  <Select value={schoolId} onValueChange={setSchoolId}>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingLookups ? "Loading schools..." : "Select school"} />
                    </SelectTrigger>
                    <SelectContent>
                      {lookups.schools.map((school) => (
                        <SelectItem key={school.id} value={String(school.id)}>{school.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="child-class">Class</Label>
                  <Input id="child-class" value={className} onChange={(event) => setClassName(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="father-name">Father Name</Label>
                  <Input id="father-name" value={fatherName} onChange={(event) => setFatherName(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="father-dod">Father Date of Death</Label>
                  <Input id="father-dod" type="date" value={fatherDod} onChange={(event) => setFatherDod(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Mother (CNIC)</Label>
                  <Select value={motherCnic} onValueChange={setMotherCnic}>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingLookups ? "Loading mothers..." : "Select mother"} />
                    </SelectTrigger>
                    <SelectContent>
                      {lookups.mothers.map((mother) => (
                        <SelectItem key={mother.cnic} value={mother.cnic}>{mother.name} ({mother.cnic})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Primary Guardian</Label>
                  <Select value={primaryGuardianId} onValueChange={setPrimaryGuardianId}>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingLookups ? "Loading guardians..." : "Select guardian"} />
                    </SelectTrigger>
                    <SelectContent>
                      {lookups.guardians.map((guardian) => (
                        <SelectItem key={guardian.id} value={String(guardian.id)}>{guardian.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="child-photo">Child Profile Photo</Label>
                  <Input id="child-photo" type="file" accept="image/*" onChange={(event) => setChildPhoto(event.target.files?.[0] || null)} />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <Button className="justify-self-start" disabled={busySection === "child"}>
                    {busySection === "child"
                      ? "Saving child..."
                      : editingChildId
                        ? "Update Child Record"
                        : "Create Child Record"}
                  </Button>
                  {editingChildId && (
                    <Button type="button" variant="outline" onClick={cancelChildEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-display">Manage Children</CardTitle>
              <CardDescription>Edit or delete existing child records.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {childRows.length === 0 && <p className="text-sm text-muted-foreground">No children added yet.</p>}

              {childRows.map((child) => (
                <div key={child.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium">{child.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {child.class || "Class not set"}
                      {child.school_id
                        ? ` • ${lookups.schools.find((s) => s.id === child.school_id)?.name || "School linked"}`
                        : " • No school"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEditChild(child)}>
                      <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDeleteChild(child.id)}>
                      <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="admin-section">
              <CardHeader>
                <CardTitle className="text-2xl font-display">Link Guardian</CardTitle>
                <CardDescription>Map a guardian-child relationship.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={onLinkGuardian}>
                  <div className="space-y-2">
                    <Label>Child</Label>
                    <Select value={linkChildId} onValueChange={setLinkChildId}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingLookups ? "Loading children..." : "Select child"} />
                      </SelectTrigger>
                      <SelectContent>
                        {lookups.children.map((child) => (
                          <SelectItem key={child.id} value={String(child.id)}>{child.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Guardian</Label>
                    <Select value={linkGuardianId} onValueChange={setLinkGuardianId}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingLookups ? "Loading guardians..." : "Select guardian"} />
                      </SelectTrigger>
                      <SelectContent>
                        {lookups.guardians.map((guardian) => (
                          <SelectItem key={guardian.id} value={String(guardian.id)}>{guardian.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input id="relationship" value={relationship} onChange={(event) => setRelationship(event.target.value)} required />
                  </div>
                  <Button disabled={busySection === "guardian"}>{busySection === "guardian" ? "Linking..." : "Save Relationship"}</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="admin-section">
              <CardHeader>
                <CardTitle className="text-2xl font-display">Link Donor</CardTitle>
                <CardDescription>Assign sponsorship details to a child.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={onLinkDonor}>
                  <div className="space-y-2">
                    <Label>Child</Label>
                    <Select value={sponsorChildId} onValueChange={setSponsorChildId}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingLookups ? "Loading children..." : "Select child"} />
                      </SelectTrigger>
                      <SelectContent>
                        {lookups.children.map((child) => (
                          <SelectItem key={child.id} value={String(child.id)}>{child.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Donor</Label>
                    <Select value={sponsorDonorId} onValueChange={setSponsorDonorId}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingLookups ? "Loading donors..." : "Select donor"} />
                      </SelectTrigger>
                      <SelectContent>
                        {lookups.donors.map((donor) => (
                          <SelectItem key={donor.id} value={String(donor.id)}>{donor.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select value={frequency} onValueChange={(value) => setFrequency(value as "monthly" | "quarterly" | "yearly" | "one-time")}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="one-time">One-time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={status} onValueChange={(value) => setStatus(value as "active" | "paused" | "ended")}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="ended">Ended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input id="start-date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input id="end-date" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                    </div>
                  </div>
                  <Button disabled={busySection === "donor"}>{busySection === "donor" ? "Linking..." : "Save Sponsorship"}</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ChildEnrollmentPage;
