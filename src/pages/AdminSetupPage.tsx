import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Handshake, Pencil, Trash2, UserRound, UsersRound, X } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  createDonor,
  createGuardian,
  createMother,
  createSchool,
  deleteSchool,
  fetchAdminLookups,
  getChildCountForSchool,
  reassignChildrenFromSchool,
  updateSchool,
} from "@/lib/adminData";

const AdminSetupPage = () => {
  const { toast } = useToast();
  const [counts, setCounts] = useState({ schools: 0, mothers: 0, guardians: 0, donors: 0, children: 0 });
  const [schools, setSchools] = useState<{ id: number; name: string }[]>([]);
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);

  const [schoolName, setSchoolName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherCnic, setMotherCnic] = useState("");
  const [motherMaritalStatus, setMotherMaritalStatus] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorCareOf, setDonorCareOf] = useState("");
  const [donorContact, setDonorContact] = useState("");
  const [busyTab, setBusyTab] = useState<string | null>(null);
  const [editingSchoolId, setEditingSchoolId] = useState<number | null>(null);
  const [editingSchoolName, setEditingSchoolName] = useState("");
  const [reassignmentTargetBySchool, setReassignmentTargetBySchool] = useState<Record<number, string>>({});

  const refreshCounts = async () => {
    setIsLoadingCounts(true);
    try {
      const lookups = await fetchAdminLookups();
      setSchools(lookups.schools);
      setCounts({
        schools: lookups.schools.length,
        mothers: lookups.mothers.length,
        guardians: lookups.guardians.length,
        donors: lookups.donors.length,
        children: lookups.children.length,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not refresh counts.";
      toast({ title: "Load failed", description: message, variant: "destructive" });
    } finally {
      setIsLoadingCounts(false);
    }
  };

  const beginSchoolEdit = (id: number, name: string) => {
    setEditingSchoolId(id);
    setEditingSchoolName(name);
  };

  const cancelSchoolEdit = () => {
    setEditingSchoolId(null);
    setEditingSchoolName("");
  };

  const saveSchoolEdit = async () => {
    if (!editingSchoolId) return;

    setBusyTab("school-edit");
    try {
      await updateSchool(editingSchoolId, editingSchoolName.trim());
      await refreshCounts();
      cancelSchoolEdit();
      toast({ title: "School updated", description: "School record updated successfully." });
    } catch (error) {
      toast({ title: "Failed", description: error instanceof Error ? error.message : "Could not update school.", variant: "destructive" });
    } finally {
      setBusyTab(null);
    }
  };

  const removeSchool = async (id: number) => {
    if (!window.confirm("Delete this school?")) {
      return;
    }

    setBusyTab(`school-delete-${id}`);
    try {
      const childCount = await getChildCountForSchool(id);
      if (childCount > 0) {
        const selectedTarget = reassignmentTargetBySchool[id];
        if (!selectedTarget) {
          toast({
            title: "Reassignment required",
            description: `This school has ${childCount} linked children. Select a target school or Unassign before deleting.`,
            variant: "destructive",
          });
          return;
        }

        const targetSchoolId = selectedTarget === "__none" ? null : Number(selectedTarget);
        await reassignChildrenFromSchool(id, targetSchoolId);
      }

      await deleteSchool(id);
      await refreshCounts();
      if (editingSchoolId === id) {
        cancelSchoolEdit();
      }
      toast({ title: "School deleted", description: "School removed successfully." });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Could not delete school.",
        variant: "destructive",
      });
    } finally {
      setBusyTab(null);
    }
  };

  useEffect(() => {
    refreshCounts();
  }, []);

  const submitSchool = async (event: FormEvent) => {
    event.preventDefault();
    setBusyTab("school");
    try {
      await createSchool(schoolName.trim());
      setSchoolName("");
      await refreshCounts();
      toast({ title: "School added", description: "School record created successfully." });
    } catch (error) {
      toast({ title: "Failed", description: error instanceof Error ? error.message : "Could not add school.", variant: "destructive" });
    } finally {
      setBusyTab(null);
    }
  };

  const submitMother = async (event: FormEvent) => {
    event.preventDefault();
    setBusyTab("mother");
    try {
      await createMother({
        cnic: motherCnic.trim(),
        name: motherName.trim(),
        maritalStatus: motherMaritalStatus.trim(),
        occupation: motherOccupation.trim(),
      });
      setMotherName("");
      setMotherCnic("");
      setMotherMaritalStatus("");
      setMotherOccupation("");
      await refreshCounts();
      toast({ title: "Mother added", description: "Mother record created successfully." });
    } catch (error) {
      toast({ title: "Failed", description: error instanceof Error ? error.message : "Could not add mother.", variant: "destructive" });
    } finally {
      setBusyTab(null);
    }
  };

  const submitGuardian = async (event: FormEvent) => {
    event.preventDefault();
    setBusyTab("guardian");
    try {
      await createGuardian(guardianName.trim());
      setGuardianName("");
      await refreshCounts();
      toast({ title: "Guardian added", description: "Guardian record created successfully." });
    } catch (error) {
      toast({ title: "Failed", description: error instanceof Error ? error.message : "Could not add guardian.", variant: "destructive" });
    } finally {
      setBusyTab(null);
    }
  };

  const submitDonor = async (event: FormEvent) => {
    event.preventDefault();
    setBusyTab("donor");
    try {
      await createDonor({ name: donorName.trim(), careOf: donorCareOf.trim(), contactNumber: donorContact.trim() });
      setDonorName("");
      setDonorCareOf("");
      setDonorContact("");
      await refreshCounts();
      toast({ title: "Donor added", description: "Donor record created successfully." });
    } catch (error) {
      toast({ title: "Failed", description: error instanceof Error ? error.message : "Could not add donor.", variant: "destructive" });
    } finally {
      setBusyTab(null);
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
              Admin Setup
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display"
            >
              Build Core Records
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 max-w-2xl text-background/75"
            >
              Configure foundational entities before enrollment to keep your dataset clean and relationships reliable.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow space-y-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Schools", value: counts.schools, icon: Building2 },
              { label: "Mothers", value: counts.mothers, icon: UsersRound },
              { label: "Guardians", value: counts.guardians, icon: UserRound },
              { label: "Donors", value: counts.donors, icon: Handshake },
              { label: "Children", value: counts.children, icon: UsersRound },
            ].map((item) => (
              <Card key={item.label} className="admin-section border-border/60">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <item.icon className="h-4 w-4" />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-display">{isLoadingCounts ? "..." : item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="school" className="space-y-6">
            <TabsList className="w-full justify-start overflow-x-auto rounded-xl border border-border/70 bg-card/80 p-1">
              <TabsTrigger value="school">School</TabsTrigger>
              <TabsTrigger value="mother">Mother</TabsTrigger>
              <TabsTrigger value="guardian">Guardian</TabsTrigger>
              <TabsTrigger value="donor">Donor</TabsTrigger>
            </TabsList>

            <TabsContent value="school">
              <Card className="admin-section">
                <CardHeader>
                  <CardTitle className="text-3xl font-display">Add School</CardTitle>
                  <CardDescription>Register school records before assigning children.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid md:grid-cols-[1fr_auto] gap-4" onSubmit={submitSchool}>
                    <div className="space-y-2">
                      <Label htmlFor="school-name">School Name</Label>
                      <Input id="school-name" value={schoolName} onChange={(event) => setSchoolName(event.target.value)} required />
                    </div>
                    <Button className="md:self-end" disabled={busyTab === "school"}>{busyTab === "school" ? "Saving..." : "Add School"}</Button>
                  </form>

                  <div className="mt-6 space-y-2">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Existing Schools</p>
                    {schools.length === 0 && <p className="text-sm text-muted-foreground">No schools added yet.</p>}

                    {schools.map((school) => (
                      <div key={school.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-2">
                        {editingSchoolId === school.id ? (
                          <Input value={editingSchoolName} onChange={(event) => setEditingSchoolName(event.target.value)} />
                        ) : (
                          <p className="min-w-[180px] flex-1 text-sm">{school.name}</p>
                        )}

                        {editingSchoolId === school.id ? (
                          <>
                            <Button size="sm" onClick={saveSchoolEdit} disabled={busyTab === "school-edit"}>
                              {busyTab === "school-edit" ? "Saving..." : "Save"}
                            </Button>
                            <Button size="icon" variant="outline" onClick={cancelSchoolEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="min-w-[210px]">
                              <Select
                                value={reassignmentTargetBySchool[school.id] || ""}
                                onValueChange={(value) => setReassignmentTargetBySchool((prev) => ({ ...prev, [school.id]: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Reassign children to..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__none">Unassign children</SelectItem>
                                  {schools
                                    .filter((candidate) => candidate.id !== school.id)
                                    .map((candidate) => (
                                      <SelectItem key={candidate.id} value={String(candidate.id)}>
                                        {candidate.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => beginSchoolEdit(school.id, school.name)}>
                              <Pencil className="mr-2 h-3.5 w-3.5" />Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeSchool(school.id)}
                              disabled={busyTab === `school-delete-${school.id}`}
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" />Delete
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mother">
              <Card className="admin-section">
                <CardHeader>
                  <CardTitle className="text-3xl font-display">Add Mother</CardTitle>
                  <CardDescription>Capture mother profile for child records and guardianship context.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid md:grid-cols-2 gap-4" onSubmit={submitMother}>
                    <div className="space-y-2">
                      <Label htmlFor="mother-name">Name</Label>
                      <Input id="mother-name" value={motherName} onChange={(event) => setMotherName(event.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mother-cnic">CNIC</Label>
                      <Input id="mother-cnic" value={motherCnic} onChange={(event) => setMotherCnic(event.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mother-marital">Marital Status</Label>
                      <Input id="mother-marital" value={motherMaritalStatus} onChange={(event) => setMotherMaritalStatus(event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mother-occupation">Occupation</Label>
                      <Input id="mother-occupation" value={motherOccupation} onChange={(event) => setMotherOccupation(event.target.value)} />
                    </div>
                    <Button className="md:col-span-2 justify-self-start" disabled={busyTab === "mother"}>{busyTab === "mother" ? "Saving..." : "Add Mother"}</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guardian">
              <Card className="admin-section">
                <CardHeader>
                  <CardTitle className="text-3xl font-display">Add Guardian</CardTitle>
                  <CardDescription>Create guardians so they can be linked to children in enrollment.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid md:grid-cols-[1fr_auto] gap-4" onSubmit={submitGuardian}>
                    <div className="space-y-2">
                      <Label htmlFor="guardian-name">Guardian Name</Label>
                      <Input id="guardian-name" value={guardianName} onChange={(event) => setGuardianName(event.target.value)} required />
                    </div>
                    <Button className="md:self-end" disabled={busyTab === "guardian"}>{busyTab === "guardian" ? "Saving..." : "Add Guardian"}</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donor">
              <Card className="admin-section">
                <CardHeader>
                  <CardTitle className="text-3xl font-display">Add Donor</CardTitle>
                  <CardDescription>Create donor and optional contact details in one flow.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid md:grid-cols-2 gap-4" onSubmit={submitDonor}>
                    <div className="space-y-2">
                      <Label htmlFor="donor-name">Donor Name</Label>
                      <Input id="donor-name" value={donorName} onChange={(event) => setDonorName(event.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donor-careof">C/O</Label>
                      <Input id="donor-careof" value={donorCareOf} onChange={(event) => setDonorCareOf(event.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="donor-contact">Primary Contact Number (Optional)</Label>
                      <Input id="donor-contact" value={donorContact} onChange={(event) => setDonorContact(event.target.value)} />
                    </div>
                    <Button className="md:col-span-2 justify-self-start" disabled={busyTab === "donor"}>{busyTab === "donor" ? "Saving..." : "Add Donor"}</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="admin-section bg-muted/30">
            <CardHeader>
              <CardTitle className="text-2xl font-display">Next Step</CardTitle>
              <CardDescription>Once core records are ready, use child enrollment to map relationships and sponsorships.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/child-enrollment" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest px-4 py-2 rounded-lg border border-border/70 hover:bg-muted transition-colors">
                Open Child Enrollment <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminSetupPage;
