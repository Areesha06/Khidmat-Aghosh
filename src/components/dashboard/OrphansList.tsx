import { Users, MoreVertical, GraduationCap, HeartPulse } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const orphans = [
  { id: 1, name: "Aisha Rahman", age: 8, grade: "3rd Grade", health: "Good", avatar: "" },
  { id: 2, name: "Omar Hassan", age: 12, grade: "7th Grade", health: "Good", avatar: "" },
  { id: 3, name: "Fatima Ali", age: 6, grade: "1st Grade", health: "Checkup Due", avatar: "" },
  { id: 4, name: "Yusuf Khan", age: 10, grade: "5th Grade", health: "Good", avatar: "" },
  { id: 5, name: "Mariam Patel", age: 14, grade: "9th Grade", health: "Good", avatar: "" },
];

const OrphansList = () => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Children Overview</h3>
        </div>
        <a href="/orphans" className="text-sm font-medium text-primary hover:underline">
          View All
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Name</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Age</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Education</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Health</th>
              <th className="text-right py-3 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {orphans.map((orphan, index) => (
              <tr 
                key={orphan.id} 
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors animate-slide-in-left"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={orphan.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {orphan.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{orphan.name}</span>
                  </div>
                </td>
                <td className="py-4 px-2 text-muted-foreground">{orphan.age} years</td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    {orphan.grade}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <Badge variant={orphan.health === "Good" ? "default" : "destructive"} className={
                    orphan.health === "Good" 
                      ? "bg-success/10 text-success hover:bg-success/20 border-0" 
                      : "bg-warning/10 text-warning hover:bg-warning/20 border-0"
                  }>
                    <HeartPulse className="h-3 w-3 mr-1" />
                    {orphan.health}
                  </Badge>
                </td>
                <td className="py-4 px-2 text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrphansList;
