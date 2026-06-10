import { Code2, Heart, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-8 border-t border-white/5">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100">Muhammed Nihad</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Full Stack Developer</div>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400 max-w-xs leading-relaxed">
              Building polished, production-grade web platforms with React, Django, and a careful eye for detail.
            </p>
          </div>

          <div className="md:justify-self-center">
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">Explore</div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              {["About", "Skills", "Projects", "Experience", "Contact"].map((s) => (
                <a
                  key={s}
                  href={`#${s.toLowerCase()}`}
                  className="text-slate-400 hover:text-slate-100 transition w-fit"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="md:justify-self-end">
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">Connect</div>
            <div className="flex items-center gap-2">
              {[
                { Icon: GithubIcon, href: "https://github.com" },
                { Icon: LinkedinIcon, href: "https://linkedin.com" },
                { Icon: Mail, href: "mailto:hello@example.com" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 rounded-xl glass flex items-center justify-center text-slate-300 hover:text-white hover:border-white/20 transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>© {year} Muhammed Nihad. All rights reserved.</div>
          <div className="inline-flex items-center gap-1.5">
            Crafted with <Heart className="h-3 w-3 text-rose-400 fill-rose-400" /> using React & Django
          </div>
        </div>
      </div>
    </footer>
  );
}
