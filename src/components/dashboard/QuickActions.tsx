import { UserPlus, Heart, Calendar, FileText, Bell, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { icon: UserPlus, label: "Add Orphan", color: "warm" },
  { icon: Heart, label: "Record Donation", color: "cool" },
  { icon: Calendar, label: "Schedule Event", color: "default" },
  { icon: Bell, label: "Post Announcement", color: "default" },
  { icon: Image, label: "Upload Photos", color: "default" },
  { icon: FileText, label: "Generate Report", color: "default" },
];

const QuickActions = () => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card animate-fade-in" style={{ animationDelay: "500ms" }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <Button
            key={action.label}
            variant={action.color === "warm" ? "warm" : action.color === "cool" ? "cool" : "outline"}
            className="h-auto py-4 flex-col gap-2 animate-scale-in"
            style={{ animationDelay: `${600 + index * 50}ms` }}
          >
            <action.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
