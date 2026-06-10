import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as api from "../api/client";
import type { Skill } from "../api/types";
import { Section, Skeleton } from "./ui";

const categoryColors: Record<string, string> = {
  Frontend: "from-violet-500 to-fuchsia-500",
  Backend: "from-cyan-500 to-sky-500",
  Database: "from-emerald-500 to-teal-500",
  DevOps: "from-amber-500 to-orange-500",
  Tools: "from-rose-500 to-pink-500",
  Mobile: "from-indigo-500 to-blue-500",
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSkills().then((s) => {
      setSkills(s);
      setLoading(false);
    });
  }, []);

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});

  return (
    <Section
      id="skills"
      eyebrow="Tech Stack"
      title="Tools I reach for"
      subtitle="A curated set of technologies I've shipped production software with — chosen for the right job, not the resume."
    >
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(grouped).map(([category, items], ci) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: ci * 0.08 }}
              className="glass rounded-2xl p-5 hover:border-white/20 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-slate-100">{category}</div>
                <div className="text-xs text-slate-500">{items.length} skills</div>
              </div>
              <div className="space-y-3">
                {items.map((skill) => {
                  const gradient = categoryColors[skill.category] || "from-violet-500 to-cyan-500";
                  return (
                    <div key={skill.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">{skill.name}</span>
                        <span className="text-slate-500">{skill.proficiency}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  );
}
