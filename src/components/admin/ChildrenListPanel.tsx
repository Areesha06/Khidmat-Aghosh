import { useEffect, useMemo, useState } from "react";
import { Filter, X, Camera, Loader2, User, Calendar, Home, BookOpen, Heart, Printer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  fetchAdminLookups,
  fetchChildrenForAdmin,
  updateChildRecord,
  type AdminChildRecord,
  type AdminLookups,
} from "@/lib/adminData";
import { uploadImageToSupabase } from "@/lib/media";

type ChildrenListPanelProps = {
  refreshKey?: number;
  schoolIdFilter?: number | null;
  titleOverride?: string;
  hideFilters?: boolean;
};

const emptyFilters = {
  name: "",
  schoolId: "",
  className: "",
  motherCnic: "",
  primaryGuardianId: "",
  floor: "",
  room: "",
  fatherName: "",
};

const ChildrenListPanel = ({ refreshKey, schoolIdFilter, titleOverride, hideFilters }: ChildrenListPanelProps) => {
  const { toast } = useToast();
  const [children, setChildren] = useState<AdminChildRecord[]>([]);
  const [lookups, setLookups] = useState<AdminLookups>({ schools: [], mothers: [], guardians: [], donors: [], children: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(emptyFilters);

  // Profile Dialog and Edit States
  const [selectedChild, setSelectedChild] = useState<AdminChildRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states for editing child
  const [editName, setEditName] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editSiblingsCount, setEditSiblingsCount] = useState("0");
  const [editFloor, setEditFloor] = useState("");
  const [editRoom, setEditRoom] = useState("");
  const [editAdmissionDate, setEditAdmissionDate] = useState("");
  const [editSchoolId, setEditSchoolId] = useState("");
  const [editClass, setEditClass] = useState("");
  const [editFatherName, setEditFatherName] = useState("");
  const [editFatherDod, setEditFatherDod] = useState("");
  const [editMotherCnic, setEditMotherCnic] = useState("");
  const [editPrimaryGuardianId, setEditPrimaryGuardianId] = useState("");
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);

  // Validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [childRows, lookupData] = await Promise.all([fetchChildrenForAdmin(), fetchAdminLookups()]);
      setChildren(childRows);
      setLookups(lookupData);
    } catch (error) {
      toast({
        title: "Load failed",
        description: error instanceof Error ? error.message : "Could not load children.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((value) => value.trim() !== "").length,
    [filters],
  );

  const filteredChildren = useMemo(() => {
    return children.filter((child) => {
      // If a school filter prop is active, restrict children by school id
      if (schoolIdFilter !== undefined && schoolIdFilter !== null) {
        if (child.school_id !== schoolIdFilter) return false;
      }

      if (filters.name && !child.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      if (filters.schoolId) {
        if (filters.schoolId === "__none" && child.school_id !== null) return false;
        if (filters.schoolId !== "__none" && String(child.school_id ?? "") !== filters.schoolId) return false;
      }

      if (filters.className && !(child.class || "").toLowerCase().includes(filters.className.toLowerCase())) {
        return false;
      }

      if (filters.motherCnic && child.mother_cnic !== filters.motherCnic) {
        return false;
      }

      if (filters.primaryGuardianId && String(child.primary_guardian_id ?? "") !== filters.primaryGuardianId) {
        return false;
      }

      if (filters.floor && !(child.floor || "").toLowerCase().includes(filters.floor.toLowerCase())) {
        return false;
      }

      if (filters.room && !(child.room || "").toLowerCase().includes(filters.room.toLowerCase())) {
        return false;
      }

      if (filters.fatherName && !(child.father_name || "").toLowerCase().includes(filters.fatherName.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [children, filters, schoolIdFilter]);

  const schoolName = (schoolId: number | null) => {
    if (!schoolId) return "—";
    return lookups.schools.find((school) => school.id === schoolId)?.name || "Unknown school";
  };

  const motherName = (motherCnic: string | null) => {
    if (!motherCnic) return "—";
    const mother = lookups.mothers.find((item) => item.cnic === motherCnic);
    return mother ? `${mother.name} (${mother.cnic})` : motherCnic;
  };

  const guardianName = (guardianId: number | null) => {
    if (!guardianId) return "—";
    return lookups.guardians.find((guardian) => guardian.id === guardianId)?.name || "Unknown guardian";
  };

  const formatDate = (value: string | null) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
  };

  const getAge = (dobString: string | null) => {
    if (!dobString) return "—";
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const updateFilter = (key: keyof typeof emptyFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
  };

  const openProfile = (child: AdminChildRecord) => {
    setSelectedChild(child);
    setIsEditing(false);
    setValidationErrors({});
    
    // Initialize form states with current record values
    setEditName(child.name);
    setEditDob(child.dob || "");
    setEditSiblingsCount(String(child.siblings_count ?? 0));
    setEditFloor(child.floor || "");
    setEditRoom(child.room || "");
    setEditAdmissionDate(child.admission_date || "");
    setEditSchoolId(child.school_id ? String(child.school_id) : "");
    setEditClass(child.class || "");
    setEditFatherName(child.father_name || "");
    setEditFatherDod(child.father_dod || "");
    setEditMotherCnic(child.mother_cnic || "");
    setEditPrimaryGuardianId(child.primary_guardian_id ? String(child.primary_guardian_id) : "");
    setEditPhotoFile(null);
    setEditPhotoPreview(null);
    
    setIsDialogOpen(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditPhotoFile(file);
      setEditPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handlePrintCertificate = (child: AdminChildRecord) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    const school = schoolName(child.school_id);
    const primaryGuardian = guardianName(child.primary_guardian_id);
    const dobFormatted = formatDate(child.dob);

    const htmlContent = `
      <html>
        <head>
          <title>Enrollment Certificate - ${child.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@300;500;700&display=swap');
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 20px;
              box-sizing: border-box;
              font-family: 'Montserrat', sans-serif;
              background-color: #ffffff;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              -webkit-print-color-adjust: exact;
            }
            .certificate-container {
              border: 12px double #8a7a5f;
              padding: 40px;
              width: 95%;
              max-width: 900px;
              background: #fff;
              text-align: center;
              position: relative;
              box-shadow: 0 0 20px rgba(0,0,0,0.05);
            }
            .certificate-container::before {
              content: "";
              position: absolute;
              top: 10px; left: 10px; right: 10px; bottom: 10px;
              border: 2px solid #8a7a5f;
              pointer-events: none;
            }
            .header {
              font-family: 'Cinzel', serif;
              color: #1a2e40;
              font-size: 26px;
              font-weight: 700;
              letter-spacing: 3px;
              margin-bottom: 5px;
            }
            .subheader {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 4px;
              color: #8a7a5f;
              margin-bottom: 25px;
              font-weight: 500;
            }
            .title {
              font-family: 'Cinzel', serif;
              font-size: 34px;
              color: #8a7a5f;
              margin-bottom: 20px;
              font-weight: 700;
              letter-spacing: 2px;
            }
            .certify-text {
              font-size: 14px;
              color: #555;
              font-style: italic;
              margin-bottom: 15px;
            }
            .name {
              font-family: 'Cinzel', serif;
              font-size: 42px;
              color: #1a2e40;
              font-weight: 700;
              border-bottom: 2px solid #8a7a5f;
              display: inline-block;
              padding-bottom: 5px;
              margin-bottom: 20px;
              min-width: 300px;
            }
            .description {
              font-size: 14px;
              color: #444;
              line-height: 1.6;
              margin-bottom: 30px;
              max-width: 650px;
              margin-left: auto;
              margin-right: auto;
            }
            .details-grid {
              display: grid;
              grid-template-cols: repeat(2, 1fr);
              gap: 15px;
              max-width: 600px;
              margin: 0 auto 40px auto;
              text-align: left;
              background: #fdfcf9;
              padding: 20px;
              border: 1px solid #e8e3d9;
              border-radius: 6px;
            }
            .detail-item {
              font-size: 13px;
            }
            .detail-label {
              font-weight: 600;
              color: #8a7a5f;
              text-transform: uppercase;
              font-size: 10px;
              letter-spacing: 1px;
              margin-bottom: 2px;
            }
            .detail-value {
              color: #222;
              font-weight: 500;
            }
            .footer-section {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              max-width: 700px;
              margin: 0 auto;
              padding-top: 20px;
            }
            .signature-line {
              width: 200px;
              border-top: 1px solid #999;
              font-size: 11px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 1px;
              padding-top: 5px;
            }
            .badge-gold {
              width: 80px;
              height: 80px;
              background: radial-gradient(circle, #d4af37 0%, #aa7c11 100%);
              border-radius: 50%;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(0,0,0,0.15);
              border: 2px dashed #fff;
            }
            .badge-gold::after {
              content: "KHIDMAT";
              color: #fff;
              font-size: 9px;
              font-weight: 700;
              letter-spacing: 1px;
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="header">KHIDMAT AGHOSH</div>
            <div class="subheader">Orphan Care Program</div>
            <div class="title">Certificate of Enrollment</div>
            <div class="certify-text">This is to certify that the child</div>
            <div class="name">${child.name}</div>
            <div class="description">
              is a registered resident under the care of the Khidmat Aghosh Care Program (Child ID: #${child.id}), and is provided full academic, housing, and healthcare sponsorships.
            </div>
            
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Date of Birth</div>
                <div class="detail-value">${dobFormatted}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Academic Level</div>
                <div class="detail-value">${child.class || "Not Set"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Enrolled Institution</div>
                <div class="detail-value">${school}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Primary Guardian</div>
                <div class="detail-value">${primaryGuardian}</div>
              </div>
            </div>

            <div class="footer-section">
              <div>
                <div class="signature-line">Program Director</div>
              </div>
              <div class="badge-gold"></div>
              <div>
                <div class="signature-line">Date of Issuance</div>
                <div style="font-size: 11px; margin-top: 5px; color: #444;">${new Date().toLocaleDateString(undefined, { dateStyle: "medium" })}</div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.parent.document.body.removeChild(window.frameElement);
              }, 1000);
            };
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    // Client-side validations
    const errors: Record<string, string> = {};
    if (!editName.trim()) {
      errors.name = "Name is required.";
    }
    if (!editDob.trim()) {
      errors.dob = "Date of Birth is required.";
    }
    if (!editSiblingsCount.trim()) {
      errors.siblingsCount = "Siblings count is required.";
    } else if (isNaN(Number(editSiblingsCount)) || Number(editSiblingsCount) < 0) {
      errors.siblingsCount = "Siblings count must be a non-negative number.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Validation error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      let profileImageUrl = selectedChild.profile_image_url;
      if (editPhotoFile) {
        const uploaded = await uploadImageToSupabase(editPhotoFile, "children");
        profileImageUrl = uploaded.publicUrl;
      }

      await updateChildRecord(selectedChild.id, {
        name: editName.trim(),
        dob: editDob,
        siblingsCount: Number(editSiblingsCount) || 0,
        floor: editFloor.trim(),
        room: editRoom.trim(),
        admissionDate: editAdmissionDate || undefined,
        schoolId: editSchoolId && editSchoolId !== "__none" ? Number(editSchoolId) : undefined,
        className: editClass.trim(),
        fatherName: editFatherName.trim(),
        fatherDod: editFatherDod || undefined,
        motherCnic: editMotherCnic && editMotherCnic !== "__none" ? editMotherCnic : undefined,
        primaryGuardianId: editPrimaryGuardianId && editPrimaryGuardianId !== "__none" ? Number(editPrimaryGuardianId) : undefined,
        profileImageUrl: profileImageUrl || undefined,
      });

      toast({
        title: "Profile updated",
        description: `${editName.trim()}'s profile has been updated successfully.`,
      });

      setIsEditing(false);
      setIsDialogOpen(false);
      
      // Refresh state to update the list view
      await loadData();
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Could not update child details.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="admin-section">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-3xl font-display">{titleOverride || "Children"}</CardTitle>
            <CardDescription>
              {isLoading
                ? "Loading children..."
                : `Showing ${filteredChildren.length} of ${children.length} children`}
            </CardDescription>
          </div>
          {!hideFilters && (
            <Button
              type="button"
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters((open) => !open)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-background/20 px-2 py-0.5 text-xs">{activeFilterCount}</span>
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {showFilters && !hideFilters && (
          <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Filter Fields</p>
              {activeFilterCount > 0 && (
                <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                  <X className="h-3.5 w-3.5" />
                  Clear filters
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filter-child-name">Name</Label>
                <Input
                  id="filter-child-name"
                  value={filters.name}
                  onChange={(event) => updateFilter("name", event.target.value)}
                  placeholder="Search by name"
                />
              </div>

              <div className="space-y-2">
                <Label>School</Label>
                <Select value={filters.schoolId || "__all"} onValueChange={(value) => updateFilter("schoolId", value === "__all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All schools" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">All schools</SelectItem>
                    <SelectItem value="__none">No school assigned</SelectItem>
                    {lookups.schools.map((school) => (
                      <SelectItem key={school.id} value={String(school.id)}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-class">Class</Label>
                <Input
                  id="filter-class"
                  value={filters.className}
                  onChange={(event) => updateFilter("className", event.target.value)}
                  placeholder="Search by class"
                />
              </div>

              <div className="space-y-2">
                <Label>Mother</Label>
                <Select value={filters.motherCnic || "__all"} onValueChange={(value) => updateFilter("motherCnic", value === "__all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All mothers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">All mothers</SelectItem>
                    {lookups.mothers.map((mother) => (
                      <SelectItem key={mother.cnic} value={mother.cnic}>
                        {mother.name} ({mother.cnic})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Primary Guardian</Label>
                <Select
                  value={filters.primaryGuardianId || "__all"}
                  onValueChange={(value) => updateFilter("primaryGuardianId", value === "__all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All guardians" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">All guardians</SelectItem>
                    {lookups.guardians.map((guardian) => (
                      <SelectItem key={guardian.id} value={String(guardian.id)}>
                        {guardian.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-father-name">Father Name</Label>
                <Input
                  id="filter-father-name"
                  value={filters.fatherName}
                  onChange={(event) => updateFilter("fatherName", event.target.value)}
                  placeholder="Search by father name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-floor">Floor</Label>
                <Input
                  id="filter-floor"
                  value={filters.floor}
                  onChange={(event) => updateFilter("floor", event.target.value)}
                  placeholder="Search by floor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-room">Room</Label>
                <Input
                  id="filter-room"
                  value={filters.room}
                  onChange={(event) => updateFilter("room", event.target.value)}
                  placeholder="Search by room"
                />
              </div>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border/70 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Mother</TableHead>
                <TableHead>Guardian</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Floor / Room</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground">
                    Loading children...
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && filteredChildren.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground">
                    {children.length === 0 ? "No children in the database yet." : "No children match the current filters."}
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                filteredChildren.map((child) => (
                  <TableRow key={child.id}>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => openProfile(child)}
                        className="font-medium text-primary hover:underline text-left cursor-pointer transition-colors"
                      >
                        {child.name}
                      </button>
                    </TableCell>
                    <TableCell>{child.class || "—"}</TableCell>
                    <TableCell>{schoolName(child.school_id)}</TableCell>
                    <TableCell>{motherName(child.mother_cnic)}</TableCell>
                    <TableCell>{guardianName(child.primary_guardian_id)}</TableCell>
                    <TableCell>{formatDate(child.dob)}</TableCell>
                    <TableCell>
                      {[child.floor, child.room].filter(Boolean).join(" / ") || "—"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6 bg-background rounded-xl border border-border">
          {selectedChild && (
            <>
              <DialogHeader className="border-b pb-4">
                <DialogTitle className="text-2xl font-display">
                  {isEditing ? "Edit Child Profile" : `${selectedChild.name}'s Profile`}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Modify information for this child. Fields marked with * are required."
                    : "Detailed overview of the child's academic, residential, and family record."}
                </DialogDescription>
              </DialogHeader>

              {!isEditing ? (
                // View Mode Profile Panel
                <div className="space-y-6 py-4">
                  <div className="grid md:grid-cols-[160px_1fr] gap-6">
                    {/* Left Column: Picture */}
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="w-36 h-36 rounded-2xl bg-muted border border-border flex items-center justify-center overflow-hidden shadow-sm">
                        {selectedChild.profile_image_url ? (
                          <img
                            src={selectedChild.profile_image_url}
                            alt={selectedChild.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl font-display text-muted-foreground/35 select-none">
                            {selectedChild.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          {selectedChild.class || "No Class"}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1.5">ID: #{selectedChild.id}</p>
                      </div>
                    </div>

                    {/* Right Column: Grid details */}
                    <div className="space-y-5">
                      {/* Personal Information */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b pb-1">
                          <User className="h-3.5 w-3.5" /> Personal Details
                        </h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Date of Birth</p>
                            <p className="font-medium">
                              {formatDate(selectedChild.dob)} ({getAge(selectedChild.dob)} years)
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Siblings Count</p>
                            <p className="font-medium">{selectedChild.siblings_count}</p>
                          </div>
                        </div>
                      </div>

                      {/* Education & Housing */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b pb-1">
                          <BookOpen className="h-3.5 w-3.5" /> Education & Housing
                        </h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">School</p>
                            <p className="font-medium">{schoolName(selectedChild.school_id)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Class</p>
                            <p className="font-medium">{selectedChild.class || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Floor / Room</p>
                            <p className="font-medium">
                              {[selectedChild.floor, selectedChild.room].filter(Boolean).join(" / ") || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Admission Date</p>
                            <p className="font-medium">{formatDate(selectedChild.admission_date)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Family & Guardians */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b pb-1">
                          <Heart className="h-3.5 w-3.5" /> Family & Guardians
                        </h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Father's Name</p>
                            <p className="font-medium">{selectedChild.father_name || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Father's DOD (Deceased Date)</p>
                            <p className="font-medium">{formatDate(selectedChild.father_dod)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Mother's Profile</p>
                            <p className="font-medium">{motherName(selectedChild.mother_cnic)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Primary Guardian</p>
                            <p className="font-medium">{guardianName(selectedChild.primary_guardian_id)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="border-t pt-4 flex flex-wrap gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handlePrintCertificate(selectedChild)}
                      className="gap-2 border-primary/40 text-primary hover:bg-primary/5 mr-auto"
                    >
                      <Printer className="h-4 w-4" />
                      Print Certificate
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Close
                    </Button>
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                // Edit Mode Profile Panel
                <form onSubmit={handleSaveChanges} className="space-y-6 py-4">
                  <div className="grid md:grid-cols-[160px_1fr] gap-6">
                    {/* Left Column: Photo Upload Preview */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-36 h-36 rounded-2xl bg-muted border border-border flex items-center justify-center overflow-hidden shadow-sm relative group">
                        {editPhotoPreview ? (
                          <img
                            src={editPhotoPreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : selectedChild.profile_image_url ? (
                          <img
                            src={selectedChild.profile_image_url}
                            alt={selectedChild.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl font-display text-muted-foreground/35 select-none">
                            {editName.split(" ").map((n) => n[0]).join("")}
                          </span>
                        )}
                      </div>
                      <Label htmlFor="edit-photo" className="cursor-pointer text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors flex items-center gap-1">
                        <Camera className="h-3 w-3" /> Change Photo
                      </Label>
                      <input
                        id="edit-photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      {editPhotoFile && (
                        <p className="text-[10px] text-muted-foreground text-center truncate max-w-[150px]">
                          Selected: {editPhotoFile.name}
                        </p>
                      )}
                    </div>

                    {/* Right Column: Edit inputs */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <Label htmlFor="edit-name">Name *</Label>
                        <Input
                          id="edit-name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={validationErrors.name ? "border-destructive" : ""}
                        />
                        {validationErrors.name && (
                          <p className="text-xs text-destructive">{validationErrors.name}</p>
                        )}
                      </div>

                      {/* DOB */}
                      <div className="space-y-1">
                        <Label htmlFor="edit-dob">Date of Birth *</Label>
                        <Input
                          id="edit-dob"
                          type="date"
                          value={editDob}
                          onChange={(e) => setEditDob(e.target.value)}
                          className={validationErrors.dob ? "border-destructive" : ""}
                        />
                        {validationErrors.dob && (
                          <p className="text-xs text-destructive">{validationErrors.dob}</p>
                        )}
                      </div>

                      {/* Siblings Count */}
                      <div className="space-y-1">
                        <Label htmlFor="edit-siblings">Siblings Count *</Label>
                        <Input
                          id="edit-siblings"
                          type="number"
                          min="0"
                          value={editSiblingsCount}
                          onChange={(e) => setEditSiblingsCount(e.target.value)}
                          className={validationErrors.siblingsCount ? "border-destructive" : ""}
                        />
                        {validationErrors.siblingsCount && (
                          <p className="text-xs text-destructive">{validationErrors.siblingsCount}</p>
                        )}
                      </div>

                      {/* Class */}
                      <div className="space-y-1">
                        <Label htmlFor="edit-class">Class</Label>
                        <Input
                          id="edit-class"
                          value={editClass}
                          onChange={(e) => setEditClass(e.target.value)}
                        />
                      </div>

                      {/* School Selection */}
                      <div className="space-y-1">
                        <Label>School</Label>
                        <Select
                          value={editSchoolId || "__none"}
                          onValueChange={(value) => setEditSchoolId(value === "__none" ? "" : value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select school" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none">No school assigned</SelectItem>
                            {lookups.schools.map((school) => (
                              <SelectItem key={school.id} value={String(school.id)}>
                                {school.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Admission Date */}
                      <div className="space-y-1">
                        <Label htmlFor="edit-admission">Admission Date</Label>
                        <Input
                          id="edit-admission"
                          type="date"
                          value={editAdmissionDate}
                          onChange={(e) => setEditAdmissionDate(e.target.value)}
                        />
                      </div>

                      {/* Floor */}
                      <div className="space-y-1">
                        <Label htmlFor="edit-floor">Floor</Label>
                        <Input
                          id="edit-floor"
                          value={editFloor}
                          onChange={(e) => setEditFloor(e.target.value)}
                        />
                      </div>

                      {/* Room */}
                      <div className="space-y-1">
                        <Label htmlFor="edit-room">Room</Label>
                        <Input
                          id="edit-room"
                          value={editRoom}
                          onChange={(e) => setEditRoom(e.target.value)}
                        />
                      </div>

                      {/* Father's Name */}
                      <div className="space-y-1">
                        <Label htmlFor="edit-father-name">Father's Name</Label>
                        <Input
                          id="edit-father-name"
                          value={editFatherName}
                          onChange={(e) => setEditFatherName(e.target.value)}
                        />
                      </div>

                      {/* Father's DOD */}
                      <div className="space-y-1">
                        <Label htmlFor="edit-father-dod">Father's Date of Death</Label>
                        <Input
                          id="edit-father-dod"
                          type="date"
                          value={editFatherDod}
                          onChange={(e) => setEditFatherDod(e.target.value)}
                        />
                      </div>

                      {/* Mother CNIC Selection */}
                      <div className="space-y-1">
                        <Label>Mother</Label>
                        <Select
                          value={editMotherCnic || "__none"}
                          onValueChange={(value) => setEditMotherCnic(value === "__none" ? "" : value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select mother" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none">No mother profile linked</SelectItem>
                            {lookups.mothers.map((mother) => (
                              <SelectItem key={mother.cnic} value={mother.cnic}>
                                {mother.name} ({mother.cnic})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Guardian Selection */}
                      <div className="space-y-1">
                        <Label>Primary Guardian</Label>
                        <Select
                          value={editPrimaryGuardianId || "__none"}
                          onValueChange={(value) => setEditPrimaryGuardianId(value === "__none" ? "" : value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select guardian" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none">No primary guardian linked</SelectItem>
                            {lookups.guardians.map((guardian) => (
                              <SelectItem key={guardian.id} value={String(guardian.id)}>
                                {guardian.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="border-t pt-4 flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setValidationErrors({});
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ChildrenListPanel;
