import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const donationsData = [
  { id: 1, donor: "John Smith", amount: 500, date: "Dec 25, 2025", purpose: "Education" },
  { id: 2, donor: "Anonymous", amount: 1000, date: "Dec 24, 2025", purpose: "General" },
  { id: 3, donor: "Sarah Wilson", amount: 250, date: "Dec 23, 2025", purpose: "Medical" },
  { id: 4, donor: "Michael Brown", amount: 150, date: "Dec 22, 2025", purpose: "Food" },
  { id: 5, donor: "Emily Davis", amount: 750, date: "Dec 21, 2025", purpose: "General" },
  { id: 6, donor: "David Lee", amount: 300, date: "Dec 20, 2025", purpose: "Clothing" },
];

const DonationsPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const totalAmount = donationsData.reduce((sum, d) => sum + d.amount, 0);

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
              Support Us
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display"
            >
              Make a Difference Today
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Donation Options */}
      <section className="section-padding border-b border-border">
        <div className="container-narrow">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 border border-border hover:border-primary transition-colors group"
            >
              <Heart className="w-8 h-8 text-primary mb-6" />
              <h3 className="text-xl font-display mb-3">One-Time Gift</h3>
              <p className="text-muted-foreground mb-6">Make an immediate impact with a single contribution.</p>
              <button className="inline-flex items-center gap-2 text-sm font-medium group-hover:text-primary transition-colors">
                <span>Donate Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 border border-primary bg-primary/5"
            >
              <Heart className="w-8 h-8 text-primary mb-6" />
              <h3 className="text-xl font-display mb-3">Monthly Sponsor</h3>
              <p className="text-muted-foreground mb-6">Provide ongoing support with recurring donations.</p>
              <button className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                <span>Become a Sponsor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 border border-border hover:border-primary transition-colors group"
            >
              <Heart className="w-8 h-8 text-primary mb-6" />
              <h3 className="text-xl font-display mb-3">Sponsor a Child</h3>
              <p className="text-muted-foreground mb-6">Support a specific child's education and care.</p>
              <Link to="/orphans" className="inline-flex items-center gap-2 text-sm font-medium group-hover:text-primary transition-colors">
                <span>View Children</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/50">
        <div className="container-narrow px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-display mb-2">${totalAmount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest">This Month</div>
            </div>
            <div>
              <div className="text-4xl font-display mb-2">34</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest">Active Sponsors</div>
            </div>
            <div>
              <div className="text-4xl font-display mb-2">48</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest">Children Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Donations */}
      <section ref={ref} className="section-padding">
        <div className="container-narrow">
          <h2 className="text-3xl font-display mb-12">Recent Contributions</h2>
          <div className="space-y-0 border-t border-border">
            {donationsData.map((donation, index) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between py-6 border-b border-border"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center font-display">
                    {donation.donor === "Anonymous" ? "?" : donation.donor.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-medium">{donation.donor}</div>
                    <div className="text-sm text-muted-foreground">{donation.purpose} • {donation.date}</div>
                  </div>
                </div>
                <div className="text-xl font-display">${donation.amount}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DonationsPage;
