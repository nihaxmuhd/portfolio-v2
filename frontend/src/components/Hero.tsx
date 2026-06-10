import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Mail, MapPin, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import * as api from "../api/client";
import type { PortfolioProfile, Resume, Stats } from "../api/types";
import { Button } from "./ui";

export default function Hero({ onOpenAI }: { onOpenAI: () => void }) {
  const [profile, setProfile] = useState<PortfolioProfile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProfile(), api.getStats(), api.getResume()]).then(([p, s, r]) => {
      setProfile(p);
      setStats(s);
      setResume(r);
      setLoading(false);
    });
  }, []);

  const handleResumeDownload = () => {
    if (!resume) return;
    window.open(resume.file, "_blank");
  };

  return (
    <section className="relative pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="grid md:grid-cols-5 gap-10 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="md:col-span-3"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 mb-5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for select engagements
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]">
              {loading ? (
                <span className="shimmer inline-block h-14 sm:h-16 w-full max-w-md rounded-md" />
              ) : (
                <>
                  <span className="block text-slate-100">Hi, I'm {profile?.full_name?.split(" ")[0]}.</span>
                  <span className="block gradient-text mt-1">{profile?.title}.</span>
                </>
              )}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              {loading ? (
                <>
                  <span className="shimmer inline-block h-4 w-full rounded" />
                  <span className="shimmer inline-block h-4 w-5/6 rounded mt-2" />
                </>
              ) : (
                profile?.bio
              )}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button size="lg" icon={<Mail className="h-4 w-4" />} onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Get in touch
              </Button>
              {resume && (
                <Button size="lg" variant="ghost" icon={<Download className="h-4 w-4" />} onClick={handleResumeDownload}>
                  Download Resume
                </Button>
              )}
              <Button size="lg" variant="outline" icon={<Sparkles className="h-4 w-4" />} onClick={onOpenAI}>
                Ask the AI
              </Button>
            </div>

            {profile && (
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
                <a href={profile.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-slate-200 transition">
                  <GithubIcon className="h-4 w-4" /> GitHub
                </a>
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-slate-200 transition">
                  <LinkedinIcon className="h-4 w-4" /> LinkedIn
                </a>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {profile.location}
                </span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="md:col-span-2"
          >
            <div className="relative mx-auto max-w-sm w-full">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-600/40 via-fuchsia-500/30 to-cyan-400/40 blur-2xl" />
              <div className="relative glass-strong rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-[11px] text-slate-500">portfolio.json</span>
                </div>
                <div className="space-y-2.5 font-mono text-xs sm:text-sm">
                  <div><span className="text-violet-300">const</span> <span className="text-cyan-300">dev</span> <span className="text-slate-500">=</span> <span className="text-amber-300">{"{"}</span></div>
                  <div className="pl-4"><span className="text-emerald-300">name</span>: <span className="text-slate-300">"{profile?.full_name ?? "..."}"</span>,</div>
                  <div className="pl-4"><span className="text-emerald-300">role</span>: <span className="text-slate-300">"{profile?.title ?? "..."}"</span>,</div>
                  <div className="pl-4"><span className="text-emerald-300">stack</span>: [<span className="text-slate-300">"React"</span>, <span className="text-slate-300">"Django"</span>],</div>
                  <div className="pl-4"><span className="text-emerald-300">years</span>: <span className="text-fuchsia-300">{stats?.years_experience ?? "…"}</span>,</div>
                  <div className="pl-4"><span className="text-emerald-300">coffee</span>: <span className="text-fuchsia-300">Infinity</span>,</div>
                  <div><span className="text-amber-300">{"}"}</span>;</div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[
                    { label: "Projects", value: stats?.projects_built },
                    { label: "Skills", value: stats?.tech_skills },
                    { label: "Years", value: stats?.years_experience },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                      <div className="text-lg sm:text-xl font-semibold gradient-text">
                        {s.value ?? <span className="shimmer inline-block h-5 w-5 rounded" />}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={onOpenAI}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-4 py-2.5 text-sm text-slate-200"
                >
                  <Sparkles className="h-4 w-4 text-violet-300" />
                  Ask me anything
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
