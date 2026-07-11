import { motion } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ChildEnrollmentPanel from "@/components/admin/ChildEnrollmentPanel";

const ChildEnrollmentPage = () => {
  return (
    <div className="min-h-screen admin-bg">
      <Navigation />

      <section className="relative h-[52vh] text-background flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="absolute inset-0 admin-grid-pattern opacity-20" />
        <div className="section-padding pb-16 w-full relative z-10">
          <div className="container-narrow">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="admin-pill mb-4"
            >
              Enrollment
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display"
            >
              Add Children and Relationships
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 max-w-2xl text-background/75"
            >
              Use this flow to create child records and map guardianship and sponsorship in a single operational workspace.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          <ChildEnrollmentPanel />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ChildEnrollmentPage;
