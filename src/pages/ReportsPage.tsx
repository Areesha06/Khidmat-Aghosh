import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const reportsData = [
  { id: 1, title: "Monthly Donation Report", type: "Financial", date: "December 2025" },
  { id: 2, title: "Children Health Summary", type: "Health", date: "December 2025" },
  { id: 3, title: "Education Progress Report", type: "Education", date: "December 2025" },
  { id: 4, title: "Staff Attendance Report", type: "HR", date: "December 2025" },
  { id: 5, title: "Quarterly Financial Summary", type: "Financial", date: "Q4 2025" },
  { id: 6, title: "Annual Activities Report", type: "General", date: "2025" },
];

const ReportsPage = () => {
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
              Resources
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display"
            >
              Reports & Documents
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="space-y-0 border-t border-border">
            {reportsData.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between py-6 border-b border-border group cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-muted group-hover:bg-primary/10 transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">{report.type} • {report.date}</p>
                  </div>
                </div>
                <button className="p-3 border border-border hover:bg-foreground hover:text-background transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReportsPage;
