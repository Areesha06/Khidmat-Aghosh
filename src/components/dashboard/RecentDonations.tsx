import { Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const donations = [
  { id: 1, name: "John Smith", amount: 500, date: "2 hours ago", type: "One-time" },
  { id: 2, name: "Anonymous", amount: 1000, date: "5 hours ago", type: "Monthly" },
  { id: 3, name: "Sarah Wilson", amount: 250, date: "Yesterday", type: "One-time" },
  { id: 4, name: "Michael Brown", amount: 150, date: "2 days ago", type: "Monthly" },
  { id: 5, name: "Emily Davis", amount: 750, date: "3 days ago", type: "One-time" },
];

const RecentDonations = () => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-warm">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Recent Donations</h3>
        </div>
        <a href="/donations" className="text-sm font-medium text-primary hover:underline">
          View All
        </a>
      </div>

      <div className="space-y-4">
        {donations.map((donation, index) => (
          <div
            key={donation.id}
            className="flex items-center justify-between py-3 border-b border-border last:border-0 animate-slide-in-left"
            style={{ animationDelay: `${400 + index * 100}ms` }}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                  {donation.name === "Anonymous" ? "?" : donation.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{donation.name}</p>
                <p className="text-xs text-muted-foreground">{donation.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">${donation.amount.toLocaleString()}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                donation.type === "Monthly" 
                  ? "bg-secondary/10 text-secondary" 
                  : "bg-primary/10 text-primary"
              }`}>
                {donation.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDonations;
