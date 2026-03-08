import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { GraduationCap, Heart, Stethoscope, Home } from "lucide-react";

const programs = [
  {
    id: "01",
    icon: GraduationCap,
    title: "Education",
    description: "Comprehensive educational support from primary through secondary levels, with tutoring and mentorship programs.",
    image: "/placeholder.svg"
  },
  {
    id: "02",
    icon: Stethoscope,
    title: "Healthcare",
    description: "Regular health checkups, medical care, dental services, and mental wellness support for all children.",
    image: "/placeholder.svg"
  },
  {
    id: "03",
    icon: Heart,
    title: "Emotional Care",
    description: "Professional counseling, art therapy, and a nurturing environment that helps children heal and grow.",
    image: "/placeholder.svg"
  },
  {
    id: "04",
    icon: Home,
    title: "Life Skills",
    description: "Practical training in essential life skills, preparing our children for independent, successful futures.",
    image: "/placeholder.svg"
  },
];

const ProgramsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section ref={ref} className="section-spacing bg-muted/30">
      <div className="container-fluid">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 lg:mb-24"
        >
          <span className="text-accent text-sm tracking-[0.2em] uppercase block mb-6">
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display max-w-2xl leading-[1.1]">
            Comprehensive care for every child
          </h2>
        </motion.div>

        {/* Programs Grid - Desktop: Horizontal, Mobile: Stack */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-px bg-border">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              onMouseEnter={() => setActiveIndex(index)}
              className={`group relative bg-background p-8 lg:p-10 cursor-pointer transition-all duration-700 ${
                activeIndex === index ? "bg-foreground text-background" : ""
              }`}
            >
              {/* Number */}
              <span className={`text-xs tracking-[0.15em] block mb-12 transition-colors duration-500 ${
                activeIndex === index ? "text-background/40" : "text-muted-foreground"
              }`}>
                {program.id}
              </span>
              
              {/* Icon */}
              <program.icon className={`w-8 h-8 mb-6 transition-colors duration-500 ${
                activeIndex === index ? "text-accent" : "text-foreground"
              }`} />
              
              {/* Title */}
              <h3 className="text-2xl font-display mb-4">
                {program.title}
              </h3>
              
              {/* Description */}
              <p className={`text-sm leading-relaxed transition-colors duration-500 ${
                activeIndex === index ? "text-background/70" : "text-muted-foreground"
              }`}>
                {program.description}
              </p>
              
              {/* Hover Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: activeIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-accent origin-left"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Programs */}
        <div className="lg:hidden space-y-4">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-background p-6 border border-border"
            >
              <div className="flex items-start gap-4">
                <program.icon className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-display mb-2">{program.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
