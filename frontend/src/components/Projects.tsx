import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { GithubIcon } from "./BrandIcons";
import * as api from "../api/client";
import type { Project } from "../api/types";
import { Badge, Section, Skeleton } from "./ui";

const thumbs = [
  "linear-gradient(135deg,#7c3aed,#22d3ee)",
  "linear-gradient(135deg,#ec4899,#8b5cf6)",
  "linear-gradient(135deg,#06b6d4,#10b981)",
  "linear-gradient(135deg,#f59e0b,#ec4899)",
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjects().then((p) => {
      setProjects(p);
      setLoading(false);
    });
  }, []);

  return (
    <Section
      id="projects"
      eyebrow="Work"
      title="Things I've built"
      subtitle="A selection of products and platforms I've designed, architected, and shipped."
    >
      {loading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className="group glass rounded-2xl overflow-hidden hover:border-white/20 transition flex flex-col"
            >
              <div
                className="relative h-40 sm:h-48 flex items-end p-5 overflow-hidden"
                style={{ background: thumbs[i % thumbs.length] }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
                <div className="absolute top-3 right-3 flex gap-2">
                  {p.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-widest text-amber-200 border border-amber-400/30">
                      <Star className="h-3 w-3 fill-amber-300" /> Featured
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="text-white/80 text-[11px] uppercase tracking-widest">Project {String(i + 1).padStart(2, "0")}</div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mt-1 drop-shadow">{p.title}</h3>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-sm text-slate-300 leading-relaxed">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech_stack.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2 pt-4 border-t border-white/5">
                  {p.github_url && (
                    <a
                      href={p.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition"
                    >
                      <GithubIcon className="h-4 w-4" /> Source
                    </a>
                  )}
                  {p.live_url && (
                    <a
                      href={p.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition"
                    >
                      <ExternalLink className="h-4 w-4" /> Live
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </Section>
  );
}
