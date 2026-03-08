import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const staffData = [
  { id: 1, name: "Dr. Sarah Ahmed", role: "Medical Director", bio: "15 years of pediatric care experience, dedicated to children's health." },
  { id: 2, name: "Mohammad Ali", role: "Lead Educator", bio: "Passionate teacher shaping young minds through innovative methods." },
  { id: 3, name: "Fatima Hassan", role: "Head Caretaker", bio: "Nurturing presence ensuring every child feels loved and secure." },
  { id: 4, name: "Ahmed Khan", role: "Administrator", bio: "Managing operations with efficiency and compassion." },
  { id: 5, name: "Zainab Malik", role: "Counselor", bio: "Supporting emotional wellbeing through dedicated guidance." },
  { id: 6, name: "Ibrahim Syed", role: "Activities Coordinator", bio: "Creating enriching experiences through art, sports, and culture." },
];

const StaffPage = () => {
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
              Our Team
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display"
            >
              The People Behind Our Mission
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section ref={ref} className="section-padding">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
            {staffData.map((staff, index) => (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="aspect-[3/4] bg-muted mb-6 flex items-center justify-center overflow-hidden group">
                  <span className="text-7xl font-display text-muted-foreground/20 group-hover:scale-110 transition-transform duration-500">
                    {staff.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
                  </span>
                </div>
                <h3 className="text-xl font-display mb-1">{staff.name}</h3>
                <p className="text-sm text-primary uppercase tracking-widest mb-3">{staff.role}</p>
                <p className="text-muted-foreground leading-relaxed">{staff.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StaffPage;
