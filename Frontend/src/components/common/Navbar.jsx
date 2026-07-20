import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import Button from "./Button.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import logo from "../../assets/logos/logo.png";

const scrollToTop = () =>
  window.scrollTo({ top: 0, behavior: "smooth" });

const navLinks = [
  { label: "Home", to: "/", onClick: scrollToTop },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Contact", href: "#footer" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border">
      <nav className="mx-auto max-w-7xl px-8">
        <div className="flex h-20 items-center justify-between">

          <Link to="/" onClick={scrollToTop} className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="SkillSyncAI" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-extrabold tracking-tight text-ink">
              SkillSyncAI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) =>
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={link.onClick}
                  className="text-[15px] font-medium text-muted hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                
                 <a key={link.label}
                  href={link.href}
                  className="text-[15px] font-medium text-muted hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          <div className="hidden md:flex items-center gap-5">
            <ThemeToggle />

            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Log In
            </Button>

            <Button variant="primary" size="sm" onClick={() => navigate("/register")}>
              Get Started
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-lg p-2"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-surface md:hidden"
          >
            <div className="flex flex-col gap-5 px-6 py-6">
              {navLinks.map((link) =>
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => {
                      link.onClick?.();
                      setIsOpen(false);
                    }}
                    className="text-muted"
                  >
                    {link.label}
                  </Link>
                ) : (
                  
                   <a key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-muted"
                  >
                    {link.label}
                  </a>
                )
              )}

              <div className="border-t border-border pt-5 flex flex-col gap-3">
                <div className="flex justify-center mb-2">
                  <ThemeToggle />
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                >
                  Log In
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/register");
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}