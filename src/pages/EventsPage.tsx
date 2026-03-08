import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const eventsData = [
  {
    id: 1,
    title: "Annual Health Checkup",
    date: "December 28, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Main Hall",
    description: "Comprehensive health checkup for all children including dental and eye examination.",
    featured: true,
  },
  {
    id: 2,
    title: "New Year Celebration",
    date: "December 31, 2025",
    time: "6:00 PM - 10:00 PM",
    location: "Garden Area",
    description: "New Year's Eve celebration with games, music, and special dinner.",
    featured: true,
  },
  {
    id: 3,
    title: "Parent-Teacher Meeting",
    date: "January 5, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "Conference Room",
    description: "Quarterly progress review meeting with guardians and teachers.",
    featured: false,
  },
  {
    id: 4,
    title: "Art & Craft Workshop",
    date: "January 10, 2026",
    time: "10:00 AM - 1:00 PM",
    location: "Activity Room",
    description: "Creative art and craft session for all age groups.",
    featured: false,
  },
  {
    id: 5,
    title: "Donor Appreciation Day",
    date: "January 15, 2026",
    time: "11:00 AM - 3:00 PM",
    location: "Main Hall",
    description: "Annual event to thank and recognize our generous donors.",
    featured: false,
  },
];

const EventsPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const featuredEvents = eventsData.filter(e => e.featured);
  const upcomingEvents = eventsData.filter(e => !e.featured);

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
              Events
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display"
            >
              Join Our Community
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="section-padding border-b border-border">
        <div className="container-narrow">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-12">Featured Events</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border border-border p-8 hover:border-primary transition-colors group"
              >
                <div className="flex gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-display">{event.date.split(" ")[1].replace(",", "")}</div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{event.date.split(" ")[0]}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                </div>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section ref={ref} className="section-padding">
        <div className="container-narrow">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-12">Upcoming Events</h2>
          <div className="space-y-0 border-t border-border">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="py-8 border-b border-border group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-8">
                  <div className="flex gap-8 flex-1">
                    <div className="text-center min-w-[60px]">
                      <div className="text-3xl font-display">{event.date.split(" ")[1].replace(",", "")}</div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">{event.date.split(" ")[0].slice(0, 3)}</div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{event.time}</span>
                        <span>•</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventsPage;
