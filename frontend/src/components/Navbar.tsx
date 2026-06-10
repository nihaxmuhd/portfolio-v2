import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Code2, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";

  const handleNav = (href: string) => {
    if (!isHome) {
      navigate("/", { state: { scrollTo: href } });
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? "py-2" : "py-3 sm:py-4"
      }`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between rounded-2xl transition-all duration-300 ${
            scrolled ? "glass-strong px-4 py-2.5 shadow-lg shadow-black/20" : "px-2 py-2"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-slate-100 leading-none">Muhammed Nihad</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">Full Stack Dev</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => handleNav(l.href)}
                className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Button variant="outline" size="sm" icon={<LogOut className="h-4 w-4" />} onClick={() => logout().then(() => navigate("/"))}>
                  Logout
                </Button>
              </>
            ) : (
              <button
                onClick={() => handleNav("#contact")}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/25 hover:brightness-110 transition"
              >
                Let's talk
              </button>
            )}
          </div>

          <button
            className="md:hidden rounded-lg p-2 text-slate-200 hover:bg-white/10"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden mt-2 glass-strong rounded-2xl p-3 flex flex-col gap-1"
            >
              {NAV_LINKS.map((l) => (
                <button
                  key={l.href}
                  onClick={() => handleNav(l.href)}
                  className="text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 rounded-lg"
                >
                  {l.label}
                </button>
              ))}
              <div className="h-px bg-white/10 my-1" />
              {user ? (
                <>
                  <Link to="/dashboard" className="px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 rounded-lg">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => logout().then(() => navigate("/"))}
                    className="text-left px-4 py-2.5 text-sm text-rose-300 hover:bg-white/5 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNav("#contact")}
                  className="text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 rounded-lg"
                >
                  Let's talk
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
