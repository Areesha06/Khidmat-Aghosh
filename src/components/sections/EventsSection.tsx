import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const events = [
  {
    date: { day: "28", month: "Jan" },
    title: "Annual Health Checkup",
    description: "Comprehensive health screening for all children",
    time: "10:00 AM"
  },
  {
    date: { day: "14", month: "Feb" },
    title: "Valentine's Day Celebration",
    description: "A day of love, crafts, and community bonding",
    time: "2:00 PM"
  },
  {
    date: { day: "22", month: "Feb" },
    title: "Career Day Workshop",
    description: "Inspiring talks from professionals in various fields",
    time: "11:00 AM"
  },
];

const EventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section ref={ref} className="section-spacing">
      <div className="container-fluid">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <span className="text-accent text-sm tracking-[0.2em] uppercase block mb-6">
              Upcoming Events
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display leading-[1.1]">
              Join our community
            </h2>
          </div>
          <Link
            to="/events"
            className="group inline-flex items-center gap-4 text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>View all events</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Events List */}
        <div className="space-y-0">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group border-t border-border py-8 md:py-10 cursor-pointer hover:bg-muted/30 transition-colors -mx-6 px-6 md:-mx-12 md:px-12 lg:-mx-20 lg:px-20 xl:-mx-32 xl:px-32"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                {/* Date */}
                <div className="flex items-baseline gap-2 md:min-w-[100px]">
                  <span className="text-4xl font-display">{event.date.day}</span>
                  <span className="text-sm tracking-[0.1em] uppercase text-muted-foreground">
                    {event.date.month}
                  </span>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-display mb-2 group-hover:text-accent transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {event.description}
                  </p>
                </div>
                
                {/* Time & Arrow */}
                <div className="flex items-center gap-6 md:gap-12">
                  <span className="text-sm text-muted-foreground">
                    {event.time}
                  </span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-px bg-border origin-left"
        />
      </div>
    </section>
  );
};

export default EventsSection;
