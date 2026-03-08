import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const galleryImages = [
  { id: 1, category: "Activities", caption: "Art class session" },
  { id: 2, category: "Events", caption: "Winter celebration" },
  { id: 3, category: "Daily Life", caption: "Morning assembly" },
  { id: 4, category: "Activities", caption: "Sports day" },
  { id: 5, category: "Education", caption: "Library reading time" },
  { id: 6, category: "Events", caption: "Birthday celebration" },
  { id: 7, category: "Daily Life", caption: "Gardening activity" },
  { id: 8, category: "Education", caption: "Science experiment" },
  { id: 9, category: "Activities", caption: "Music practice" },
  { id: 10, category: "Events", caption: "Cultural program" },
  { id: 11, category: "Daily Life", caption: "Mealtime" },
  { id: 12, category: "Education", caption: "Computer class" },
];

const categories = ["All", "Activities", "Events", "Daily Life", "Education"];

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filteredImages = activeCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

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
              Gallery
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display"
            >
              Moments That Matter
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section ref={ref} className="section-padding">
        <div className="container-narrow">
          {/* Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 text-sm uppercase tracking-widest transition-colors ${
                  activeCategory === category
                    ? "bg-foreground text-background"
                    : "border border-border hover:border-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative aspect-square bg-muted overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl text-muted-foreground/30">{image.id}</span>
                </div>
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/80 transition-colors duration-300 flex items-end p-6">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                    <p className="text-background text-sm font-medium">{image.caption}</p>
                    <p className="text-background/60 text-xs uppercase tracking-widest">{image.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GalleryPage;
