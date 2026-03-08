import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Search } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";

const orphansData = [
  { id: 1, name: "Aisha Rahman", age: 8, grade: "3rd Grade", story: "Loves painting and dreams of becoming an artist." },
  { id: 2, name: "Omar Hassan", age: 12, grade: "7th Grade", story: "Passionate about mathematics and coding." },
  { id: 3, name: "Fatima Ali", age: 6, grade: "1st Grade", story: "Enjoys storytelling and making new friends." },
  { id: 4, name: "Yusuf Khan", age: 10, grade: "5th Grade", story: "Aspires to be a doctor to help others." },
  { id: 5, name: "Mariam Patel", age: 14, grade: "9th Grade", story: "A talented writer working on her first book." },
  { id: 6, name: "Ahmed Syed", age: 9, grade: "4th Grade", story: "Football enthusiast and team captain." },
  { id: 7, name: "Zara Mohammed", age: 7, grade: "2nd Grade", story: "Loves music and learning piano." },
  { id: 8, name: "Ibrahim Malik", age: 11, grade: "6th Grade", story: "Science fair winner with big dreams." },
];

const OrphansPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filteredOrphans = orphansData.filter(orphan =>
    orphan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Our Children
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display"
            >
              Meet the Hearts of Aghosh
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section ref={ref} className="section-padding">
        <div className="container-narrow">
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-md"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search children..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 border-border bg-transparent text-base"
              />
            </div>
          </motion.div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {filteredOrphans.map((orphan, index) => (
              <motion.div
                key={orphan.id}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background p-8 group cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="aspect-square bg-muted mb-6 flex items-center justify-center overflow-hidden">
                  <span className="text-6xl font-display text-muted-foreground/20 group-hover:scale-110 transition-transform duration-500">
                    {orphan.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <h3 className="text-xl font-display mb-2">{orphan.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {orphan.age} years • {orphan.grade}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {orphan.story}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrphansPage;
