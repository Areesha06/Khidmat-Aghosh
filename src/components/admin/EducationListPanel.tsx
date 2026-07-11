import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Building2, School, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAdminLookups,
  fetchChildrenForAdmin,
  type AdminChildRecord,
  type AdminLookups,
} from "@/lib/adminData";
import ChildrenListPanel from "./ChildrenListPanel";

type EducationListPanelProps = {
  refreshKey?: number;
};

const EducationListPanel = ({ refreshKey }: EducationListPanelProps) => {
  const { toast } = useToast();
  const [children, setChildren] = useState<AdminChildRecord[]>([]);
  const [lookups, setLookups] = useState<AdminLookups>({ schools: [], mothers: [], guardians: [], donors: [], children: [] });
  const [isLoading, setIsLoading] = useState(true);
  
  // Drill-down states
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const [selectedSchoolName, setSelectedSchoolName] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [childRows, lookupData] = await Promise.all([fetchChildrenForAdmin(), fetchAdminLookups()]);
      setChildren(childRows);
      setLookups(lookupData);
    } catch (error) {
      toast({
        title: "Load failed",
        description: error instanceof Error ? error.message : "Could not load education directory.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshKey, selectedSchoolId]); // Reload when back or changed

  // Calculate child count per school dynamically
  const schoolCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    children.forEach((child) => {
      if (child.school_id !== null) {
        counts[child.school_id] = (counts[child.school_id] || 0) + 1;
      }
    });
    return counts;
  }, [children]);

  const handleSchoolClick = (schoolId: number, schoolName: string) => {
    setSelectedSchoolId(schoolId);
    setSelectedSchoolName(schoolName);
  };

  if (selectedSchoolId !== null) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setSelectedSchoolId(null)}
          className="gap-2 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Schools
        </Button>
        <ChildrenListPanel
          refreshKey={refreshKey}
          schoolIdFilter={selectedSchoolId}
          titleOverride={`Children Enrolled in ${selectedSchoolName}`}
          hideFilters={true}
        />
      </div>
    );
  }

  return (
    <Card className="admin-section">
      <CardHeader>
        <CardTitle className="text-3xl font-display flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          Education Directory
        </CardTitle>
        <CardDescription>
          {isLoading
            ? "Loading school details..."
            : `Showing ${lookups.schools.length} registered schools`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading && <p className="text-sm text-muted-foreground">Loading schools list...</p>}

        {!isLoading && lookups.schools.length === 0 && (
          <p className="text-sm text-muted-foreground">No schools registered in the database yet.</p>
        )}

        {!isLoading && lookups.schools.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lookups.schools.map((school) => {
              const studentCount = schoolCounts[school.id] || 0;
              return (
                <div
                  key={school.id}
                  onClick={() => handleSchoolClick(school.id, school.name)}
                  className="group relative rounded-xl border border-border bg-card/60 p-5 hover:bg-card hover:border-primary/40 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md flex items-start gap-4"
                >
                  <div className="rounded-lg bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {school.name}
                    </h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {studentCount === 1 ? "1 Student Enrolled" : `${studentCount} Students Enrolled`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationListPanel;
