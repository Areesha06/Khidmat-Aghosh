import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const impactItems = [
  { amount: "$25", impact: "Provides school supplies for one child for a month" },
  { amount: "$50", impact: "Covers healthcare essentials for one child" },
  { amount: "$100", impact: "Sponsors a child's education for one month" },
  { amount: "$500", impact: "Funds comprehensive care for one child for a month" },
];

const DonateSection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={containerRef} className="relative overflow-hidden">
      {/* Background */}
      <motion.div 
        className="absolute inset-0 bg-foreground"
        style={{ y: backgroundY }}
      />
      
      <div className="relative section-spacing">
        <div className="container-fluid">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left - CTA */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className="text-accent text-sm tracking-[0.2em] uppercase block mb-6">
                Make a Difference
              </span>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-background leading-[1.1] mb-8">
                Your support changes lives
              </h2>
              
              <p className="text-background/60 text-lg leading-relaxed mb-10 max-w-lg">
                Every contribution, regardless of size, directly impacts a child's future. 
                Join our community of supporters creating lasting change.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/donations"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-accent-foreground text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors"
                >
                  <span>Donate Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/donations"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-background/20 text-background text-sm tracking-[0.15em] uppercase hover:bg-background/10 transition-colors"
                >
                  Become a Sponsor
                </Link>
              </div>
            </motion.div>

            {/* Right - Impact Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <h4 className="text-xs tracking-[0.2em] uppercase text-background/40 mb-6">
                Your Impact
              </h4>
              
              {impactItems.map((item, index) => (
                <motion.div
                  key={item.amount}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="group flex items-center gap-6 p-6 border border-background/10 hover:border-background/30 transition-colors cursor-pointer"
                >
                  <span className="text-3xl font-display text-background min-w-[80px]">
                    {item.amount}
                  </span>
                  <span className="text-background/60 text-sm leading-relaxed">
                    {item.impact}
                  </span>
                  <ArrowRight className="w-4 h-4 text-background/30 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonateSection;
