import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Children", path: "/orphans" },
  { label: "Team", path: "/staff" },
  { label: "Support", path: "/donations" },
  { label: "Events", path: "/events" },
  { label: "Gallery", path: "/gallery" },
  { label: "Admin", path: "/admin-setup" },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-xl py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container-fluid flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative z-10">
            <motion.span 
              className={`font-display text-2xl md:text-3xl transition-colors duration-500 ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              Aghosh
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-3 rounded-full border border-border/40 bg-background/20 px-3 py-2 backdrop-blur-sm">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative rounded-full px-3 py-1.5 text-[12px] tracking-[0.14em] uppercase transition-all duration-300 ${
                  isScrolled 
                    ? "text-foreground" 
                    : "text-white"
                } ${location.pathname === item.path 
                    ? "opacity-100 bg-background/80 text-foreground" 
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.span
                    layoutId="nav-underline"
                    className={`absolute -bottom-1 left-2 right-2 h-px ${
                      isScrolled ? "bg-foreground" : "bg-white"
                    }`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={handleSignOut}
                className={`text-[12px] tracking-[0.14em] uppercase transition-all duration-500 px-3 py-2 ${
                  isScrolled ? "text-foreground hover:text-foreground/70" : "text-white hover:text-white/70"
                }`}
              >
                {isSigningOut ? "Signing Out..." : "Logout"}
              </button>
            )}

            {!isAdmin && (
              <Link
                to="/login"
                className={`text-[12px] tracking-[0.14em] uppercase transition-all duration-500 px-3 py-2 ${
                  isScrolled ? "text-foreground hover:text-foreground/70" : "text-white hover:text-white/70"
                }`}
              >
                Login
              </Link>
            )}

            <Link
              to="/donations"
              className={`rounded-full text-[12px] tracking-[0.14em] uppercase transition-all duration-500 px-6 py-3 ${
                isScrolled
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "text-white hover:text-white/80"
              }`}
            >
              Donate
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className={`lg:hidden relative z-10 p-2 ${isScrolled ? "text-foreground" : "text-white"}`}
            aria-label="Open menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className="w-full h-px bg-current" />
              <span className="w-4 h-px bg-current ml-auto" />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu - Fullscreen */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-foreground"
          >
            <div className="container-fluid py-6 flex justify-between items-center">
              <span className="font-display text-2xl text-background">Aghosh</span>
              <button 
                onClick={() => setIsMobileOpen(false)} 
                className="p-2 text-background"
                aria-label="Close menu"
              >
                <div className="w-6 h-6 relative">
                  <span className="absolute top-1/2 left-0 w-full h-px bg-current rotate-45" />
                  <span className="absolute top-1/2 left-0 w-full h-px bg-current -rotate-45" />
                </div>
              </button>
            </div>
            
            <nav className="container-fluid pt-16 flex flex-col">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="border-b border-background/10"
                >
                  <Link
                    to={item.path}
                    className="block py-5 text-4xl md:text-5xl font-display text-background hover:text-accent transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: navItems.length * 0.08 }}
                className="border-b border-background/10"
              >
                {isAdmin ? (
                  <button
                    onClick={handleSignOut}
                    className="block py-5 text-4xl md:text-5xl font-display text-background hover:text-accent transition-colors w-full text-left"
                  >
                    {isSigningOut ? "Signing Out..." : "Logout"}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block py-5 text-4xl md:text-5xl font-display text-background hover:text-accent transition-colors"
                  >
                    Login
                  </Link>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
