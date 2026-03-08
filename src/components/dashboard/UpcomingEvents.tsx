import { Calendar, Clock, MapPin } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Annual Health Checkup",
    date: "Dec 28, 2025",
    time: "10:00 AM",
    location: "Main Hall",
    type: "health",
  },
  {
    id: 2,
    title: "New Year Celebration",
    date: "Dec 31, 2025",
    time: "6:00 PM",
    location: "Garden Area",
    type: "celebration",
  },
  {
    id: 3,
    title: "Parent-Teacher Meeting",
    date: "Jan 5, 2026",
    time: "2:00 PM",
    location: "Conference Room",
    type: "education",
  },
];

const eventTypeColors = {
  health: "bg-success/10 text-success border-success/20",
  celebration: "bg-accent/10 text-accent-foreground border-accent/20",
  education: "bg-secondary/10 text-secondary border-secondary/20",
};

const UpcomingEvents = () => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-cool">
            <Calendar className="h-5 w-5 text-secondary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
        </div>
        <a href="/events" className="text-sm font-medium text-primary hover:underline">
          View All
        </a>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`p-4 rounded-lg border ${eventTypeColors[event.type as keyof typeof eventTypeColors]} animate-slide-in-left`}
            style={{ animationDelay: `${500 + index * 100}ms` }}
          >
            <h4 className="font-semibold text-foreground mb-2">{event.title}</h4>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {event.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {event.time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
