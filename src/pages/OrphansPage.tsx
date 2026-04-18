import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchPublicChildren, type PublicChild } from "@/lib/publicData";

const OrphansPage = () => {
  const { toast } = useToast();
  const [children, setChildren] = useState<PublicChild[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const loadChildren = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPublicChildren();
        setChildren(data);
      } catch (error) {
        toast({
          title: "Could not load children",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadChildren();
  }, [toast]);

  const getAge = (dob: string) => {
    const now = new Date();
    const birth = new Date(dob);
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age -= 1;
    }
    return Math.max(age, 0);
  };

  const filteredOrphans = children.filter((child) =>
    child.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            {isLoading && (
              <div className="md:col-span-2 lg:col-span-3 bg-background p-8 text-sm text-muted-foreground">Loading children...</div>
            )}

            {!isLoading && filteredOrphans.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 bg-background p-8 text-sm text-muted-foreground">
                No children found yet.
              </div>
            )}

            {filteredOrphans.map((orphan, index) => (
              <motion.div
                key={orphan.id}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background p-8 group cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="aspect-square bg-muted mb-6 flex items-center justify-center overflow-hidden">
                  {orphan.profile_image_url ? (
                    <img src={orphan.profile_image_url} alt={orphan.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-6xl font-display text-muted-foreground/20 group-hover:scale-110 transition-transform duration-500">
                      {orphan.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-display mb-2">{orphan.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {getAge(orphan.dob)} years • {orphan.class || "Class not set"}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enrolled under Khidmat Aghosh care program.
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
