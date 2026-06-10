import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import * as api from "../api/client";
import type { Experience as ExperienceT } from "../api/types";
import { Section, Skeleton } from "./ui";

function fmtDate(iso: string | null) {
  if (!iso) return "Present";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function Experience() {
  const [items, setItems] = useState<ExperienceT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getExperience().then((e) => {
      setItems(e);
      setLoading(false);
    });
  }, []);

  return (
    <Section
      id="experience"
      eyebrow="Journey"
      title="Where I've worked"
      subtitle="A timeline of teams, products, and the craft I've sharpened along the way."
    >
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-3 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-cyan-400/40 to-transparent sm:-translate-x-1/2" />
          <div className="space-y-6">
            {items.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative flex sm:items-start gap-4 sm:gap-0 ${
                  i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                <div className="hidden sm:block sm:w-1/2" />
                <div className="absolute left-3 sm:left-1/2 top-2 sm:-translate-x-1/2 h-3 w-3 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 ring-4 ring-[#0b0b14] z-10" />
                <div className="sm:w-1/2 pl-8 sm:pl-0 sm:px-6">
                  <div className="glass rounded-2xl p-5 hover:border-white/20 transition">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-violet-300" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <div className="text-sm font-semibold text-slate-100">{e.role}</div>
                          {e.is_current && (
                            <span className="text-[10px] uppercase tracking-widest text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{e.company} · {fmtDate(e.start_date)} – {fmtDate(e.end_date)}</div>
                        <p className="text-sm text-slate-300 leading-relaxed mt-3">{e.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
