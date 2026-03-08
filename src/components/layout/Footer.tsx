import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const footerLinks = {
  navigation: [
    { label: "Home", path: "/" },
    { label: "Children", path: "/orphans" },
    { label: "Team", path: "/staff" },
    { label: "Events", path: "/events" },
    { label: "Gallery", path: "/gallery" },
  ],
  support: [
    { label: "Donate", path: "/donations" },
    { label: "Sponsor a Child", path: "/donations" },
    { label: "Volunteer", path: "/staff" },
    { label: "Partner With Us", path: "/donations" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container-fluid section-spacing pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link to="/" className="inline-block mb-6">
              <span className="font-display text-4xl md:text-5xl">Aghosh</span>
            </Link>
            <p className="text-background/50 leading-relaxed max-w-sm mb-8">
              Nurturing futures with love, education, and care. 
              Every child deserves a chance to thrive.
            </p>
            <div className="flex gap-4">
              {["Fb", "Tw", "In", "Yt"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 border border-background/20 flex items-center justify-center text-sm text-background/60 hover:text-background hover:border-background/40 transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-xs tracking-[0.2em] uppercase text-background/40 mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.path + link.label}>
                  <Link
                    to={link.path}
                    className="text-background/60 hover:text-background transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h4 className="text-xs tracking-[0.2em] uppercase text-background/40 mb-6">
              Support Us
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={link.label + index}>
                  <Link
                    to={link.path}
                    className="text-background/60 hover:text-background transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-xs tracking-[0.2em] uppercase text-background/40 mb-6">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-background/60">
              <li>123 Care Street</li>
              <li>City, Country 12345</li>
              <li className="pt-2">info@aghoshhome.org</li>
              <li>+1 234 567 890</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container-fluid py-6 border-t border-background/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/40">
          <span>© 2025 Aghosh Home. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-background transition-colors">Privacy</a>
            <a href="#" className="hover:text-background transition-colors">Terms</a>
            <a href="#" className="hover:text-background transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
