import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Code2, Mail, MapPin, Rocket, Sparkles } from "lucide-react";
import * as api from "../api/client";
import type { PortfolioProfile } from "../api/types";
import { Section } from "./ui";

export default function About() {
  const [profile, setProfile] = useState<PortfolioProfile | null>(null);
  useEffect(() => {
    api.getProfile().then(setProfile);
  }, []);

  const highlights = [
    { icon: Rocket, title: "Product-minded", text: "I ship with the user in mind — every feature starts with the problem it solves." },
    { icon: Code2, title: "Craft-first", text: "Clean architecture, typed contracts, and tests I'm actually proud of." },
    { icon: Sparkles, title: "Polished UI", text: "Motion, micro-interactions, and attention to the details people feel." },
    { icon: Briefcase, title: "End-to-end", text: "From database migrations to production deploys, I own the full stack." },
  ];

  return (
    <Section
      id="about"
      eyebrow="About"
      title="Engineering with intent"
      subtitle="I build platforms that are fast, accessible, and maintainable — with the kind of polish that makes teams proud to ship."
    >
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass rounded-2xl p-6 sm:p-7">
            <div className="flex items-center gap-4 mb-5">
              <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-500/30">
                {profile?.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2) ?? "AC"}
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-100">{profile?.full_name}</div>
                <div className="text-sm text-slate-400">{profile?.title}</div>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{profile?.bio}</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4" /> {profile?.email}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {profile?.location}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-3">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-2xl p-5 hover:border-white/20 transition"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mb-3">
                <h.icon className="h-5 w-5 text-violet-300" />
              </div>
              <div className="text-sm font-semibold text-slate-100">{h.title}</div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">{h.text}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
