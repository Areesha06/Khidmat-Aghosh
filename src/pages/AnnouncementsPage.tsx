import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Bell, Pin } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const announcementsData = [
  {
    id: 1,
    title: "Holiday Schedule Update",
    content: "Please note that the orphanage will have modified hours during the holiday season from December 24-January 2. Regular activities will resume on January 3rd.",
    date: "December 26, 2025",
    pinned: true,
  },
  {
    id: 2,
    title: "New Volunteer Training Program",
    content: "We are launching a comprehensive volunteer training program starting January 15th. Interested volunteers can register through the office.",
    date: "December 24, 2025",
    pinned: false,
  },
  {
    id: 3,
    title: "Health Checkup Reminder",
    content: "Annual health checkup for all children is scheduled for December 28th. Please ensure all medical records are updated.",
    date: "December 23, 2025",
    pinned: true,
  },
  {
    id: 4,
    title: "Donation Drive Success",
    content: "Thank you to everyone who participated in our winter donation drive! We exceeded our goal by 20% and collected essential supplies for all children.",
    date: "December 20, 2025",
    pinned: false,
  },
];

const AnnouncementsPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
              News
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display"
            >
              Announcements
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section ref={ref} className="section-padding">
        <div className="container-narrow max-w-3xl">
          <div className="space-y-8">
            {announcementsData.map((announcement, index) => (
              <motion.article
                key={announcement.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border-b border-border pb-8"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted flex-shrink-0">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {announcement.pinned && (
                        <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-primary">
                          <Pin className="w-3 h-3" />
                          Pinned
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{announcement.date}</span>
                    </div>
                    <h2 className="text-xl font-display mb-3">{announcement.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{announcement.content}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AnnouncementsPage;
