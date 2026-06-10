import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import * as api from "../api/client";
import type { PortfolioProfile } from "../api/types";
import { Button, Input, Textarea } from "./ui";
import { Section } from "./ui";
import { useEffect } from "react";

export default function Contact() {
  const [profile, setProfile] = useState<PortfolioProfile | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getProfile().then(setProfile);
  }, []);

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in name, email, and message.");
      return;
    }
    setLoading(true);
    try {
      await api.submitContact(form);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const channels = profile
  ? [
      {
        icon: Mail,
        label: "Email",
        value: profile.email,
        href: `mailto:${profile.email}`,
      },
      {
        icon: Phone,
        label: "Phone",
        value: profile.phone || "Not provided",
        href: profile.phone
          ? `tel:${profile.phone.replace(/\s+/g, "")}`
          : undefined,
      },
      {
        icon: MapPin,
        label: "Location",
        value: profile.location,
      },
      {
        icon: GithubIcon,
        label: "GitHub",
        value: profile.github_url.replace(/^https?:\/\//, ""),
        href: profile.github_url,
      },
      {
        icon: LinkedinIcon,
        label: "LinkedIn",
        value: profile.linkedin_url.replace(/^https?:\/\//, ""),
        href: profile.linkedin_url,
      },
    ]
  : [];

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's build something"
      subtitle="Have a project in mind, a role to fill, or just want to say hi? Drop a note — I reply to everyone."
    >
      <div className="grid lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-slate-100 mb-1">Direct lines</h3>
          <p className="text-sm text-slate-400 mb-5">Pick whichever channel works best for you.</p>
          <div className="space-y-3">
            {channels.map((c) => {
              const Wrap: any = c.href ? "a" : "div";
              return (
                <Wrap
                  key={c.label}
                  {...(c.href ? { href: c.href, target: c.href.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" } : {})}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                >
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shrink-0">
                    <c.icon className="h-4 w-4 text-violet-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">{c.label}</div>
                    <div className="text-sm text-slate-200 truncate">{c.value}</div>
                  </div>
                </Wrap>
              );
            })}
          </div>
        </motion.div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-3 glass rounded-2xl p-6"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Name</label>
              <Input value={form.name} onChange={onChange("name")} placeholder="Your name" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Email</label>
              <Input type="email" value={form.email} onChange={onChange("email")} placeholder="you@company.com" />
            </div>
          </div>
          <div className="mt-3">
            <label className="text-xs text-slate-400 mb-1.5 block">Subject</label>
            <Input value={form.subject} onChange={onChange("subject")} placeholder="What's this about?" />
          </div>
          <div className="mt-3">
            <label className="text-xs text-slate-400 mb-1.5 block">Message</label>
            <Textarea rows={5} value={form.message} onChange={onChange("message")} placeholder="Tell me about your project, timeline, and goals…" />
          </div>

          {error && <div className="mt-3 text-xs text-rose-300">{error}</div>}
          {sent && (
            <div className="mt-3 inline-flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
              <CheckCircle2 className="h-4 w-4" /> Message received — I'll be in touch soon.
            </div>
          )}

          <div className="mt-5 flex items-center justify-between">
            <p className="text-[11px] text-slate-500 hidden sm:block">Your message is sent to the admin dashboard.</p>
            <Button type="submit" loading={loading} icon={<Send className="h-4 w-4" />}>Send message</Button>
          </div>
        </motion.form>
      </div>
    </Section>
  );
}
