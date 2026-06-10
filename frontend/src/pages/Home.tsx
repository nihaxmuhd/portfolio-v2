import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import AIAssistant from "../components/AIAssistant";

export default function Home() {
  const [aiOpen, setAiOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const s = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (s) {
      setTimeout(() => document.querySelector(s)?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [location.state]);

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>
        <Hero onOpenAI={() => setAiOpen(true)} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <AIAssistant open={aiOpen} onClose={() => setAiOpen((v) => !v)} />
    </div>
  );
}
