import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const AboutSection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} className="section-spacing overflow-hidden">
      <div className="container-fluid">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left - Text Content */}
          <motion.div 
            className="lg:col-span-5 order-2 lg:order-1"
            style={{ y: textY }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-accent text-sm tracking-[0.2em] uppercase block mb-6"
            >
              Our Story
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display leading-[1.1] mb-8"
            >
              Nurturing futures with love & purpose
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-muted-foreground text-lg leading-relaxed mb-10"
            >
              For over fifteen years, Aghosh Home has been more than an orphanage—it's been 
              a family. We provide comprehensive care, education, and emotional support, 
              ensuring every child has the opportunity to thrive and dream.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/orphans"
                className="group inline-flex items-center gap-4 text-sm tracking-[0.15em] uppercase"
              >
                <span>Meet our children</span>
                <span className="w-10 h-px bg-foreground transition-all duration-500 group-hover:w-16" />
                <ArrowRight className="w-4 h-4 -ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div 
            className="lg:col-span-7 order-1 lg:order-2"
            style={{ y: imageY }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              {/* Main Image Placeholder */}
              <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl opacity-5">♡</span>
                </div>
              </div>
              
              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -bottom-8 -left-8 lg:-left-16 bg-foreground text-background p-8"
              >
                <div className="text-5xl font-display mb-2">15+</div>
                <div className="text-xs tracking-[0.15em] uppercase text-background/60">
                  Years of<br />Service
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
