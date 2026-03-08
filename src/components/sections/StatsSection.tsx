import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 48, suffix: "", label: "Children in Our Care" },
  { value: 15, suffix: "+", label: "Years of Service" },
  { value: 34, suffix: "", label: "Active Sponsors" },
  { value: 100, suffix: "%", label: "Dedication" },
];

const Counter = ({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section ref={ref} className="section-spacing bg-foreground text-background overflow-hidden">
      <div className="container-fluid">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="relative"
            >
              <div className="text-5xl md:text-6xl lg:text-7xl font-display text-background mb-4">
                <Counter value={stat.value} suffix={stat.suffix} inView={isInView} />
              </div>
              <div className="text-background/50 text-sm tracking-[0.1em] uppercase">
                {stat.label}
              </div>
              
              {/* Decorative line */}
              {index < stats.length - 1 && (
                <div className="hidden lg:block absolute top-0 right-0 h-full w-px bg-background/10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
