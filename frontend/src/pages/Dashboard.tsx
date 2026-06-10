import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Code2, FileText, FolderKanban, LayoutDashboard, LogOut, Mail, MessageSquare,
  Pencil, Plus, Sparkles, Trash2, Upload, User, X, Save
} from "lucide-react";
import * as api from "../api/client";
import type {
  Experience as ExperienceT, PortfolioProfile, Project, Resume, Skill, ContactMessage, Stats,
} from "../api/types";
import { useAuth } from "../context/AuthContext";
import { Badge, Button, Card, Input, Modal, Textarea, Toast } from "../components/ui";
import { GithubIcon, LinkedinIcon } from "../components/BrandIcons";

type Tab = "overview" | "profile" | "skills" | "projects" | "experience" | "resume" | "messages";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "messages", label: "Messages", icon: MessageSquare },
];

const skillCategories: Skill["category"][] = ["Frontend", "Backend", "Database", "DevOps", "Tools", "Mobile"];

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
  const [profile, setProfile] = useState<PortfolioProfile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<ExperienceT[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const [p, s, sk, pr, ex, r, m] = await Promise.all([
      api.getProfile(), api.getStats(), api.getSkills(), api.getProjects(),
      api.getExperience(), api.getResume(), api.getMessages(),
    ]);
    setProfile(p); setStats(s); setSkills(sk); setProjects(pr);
    setExperience(ex); setResume(r); setMessages(m);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Checking session…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;

  const notify = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const unread = messages.filter((m) => !m.is_read).length;

  const doLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence>{toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>

      {/* Top bar */}
      <header className="sticky top-0 z-30 glass-strong border-b border-white/5">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-lg p-2 hover:bg-white/5"
              aria-label="Menu"
            >
              <LayoutDashboard className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100 leading-none">Admin Console</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">Portfolio CMS</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden sm:inline-flex text-xs text-slate-400 hover:text-slate-200 px-3 py-2">
              View site →
            </Link>
            <Button variant="outline" size="sm" icon={<LogOut className="h-4 w-4" />} onClick={doLogout}>
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 grid lg:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky lg:top-20 inset-y-0 left-0 z-40 w-64 lg:w-auto lg:block ${sidebarOpen ? "block" : "hidden"}`}>
          <div
            className="lg:hidden absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <nav className="relative h-full lg:h-auto glass-strong lg:glass rounded-none lg:rounded-2xl p-4 w-64 flex flex-col gap-1">
            <div className="lg:hidden flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-slate-200">Navigation</div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400"><X className="h-4 w-4" /></button>
            </div>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  tab === t.id
                    ? "bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-slate-100 border border-white/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <t.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{t.label}</span>
                {t.id === "messages" && unread > 0 && (
                  <span className="h-5 min-w-5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">{unread}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="min-w-0">
          {tab === "overview" && <Overview stats={stats} messages={messages} skills={skills} loading={loading} onNav={setTab} />}
          {tab === "profile" && <ProfileSection profile={profile} setProfile={setProfile} notify={notify} refresh={refresh} loading={loading} />}
          {tab === "skills" && <SkillsSection skills={skills} refresh={refresh} notify={notify} />}
          {tab === "projects" && <ProjectsSection projects={projects} refresh={refresh} notify={notify} />}
          {tab === "experience" && <ExperienceSection experience={experience} refresh={refresh} notify={notify} />}
          {tab === "resume" && <ResumeSection resume={resume} setResume={setResume} notify={notify} />}
          {tab === "messages" && <MessagesSection messages={messages} refresh={refresh} notify={notify} />}
        </main>
      </div>
    </div>
  );
}

/* ---------- Overview ---------- */
function Overview({ stats, messages, skills, loading, onNav }: {
  stats: Stats | null; messages: ContactMessage[]; skills: Skill[]; loading: boolean;
  onNav: (t: Tab) => void;
}) {
  const unread = messages.filter((m) => !m.is_read).length;
  const cards = [
    { label: "Projects Built", value: stats?.projects_built, icon: FolderKanban, color: "from-violet-500 to-fuchsia-500" },
    { label: "Tech Skills", value: stats?.tech_skills, icon: Code2, color: "from-cyan-500 to-sky-500" },
    { label: "Years Experience", value: stats?.years_experience, icon: Briefcase, color: "from-amber-500 to-orange-500" },
    { label: "New Messages", value: unread, icon: MessageSquare, color: "from-rose-500 to-pink-500" },
  ];
  const recent = messages.slice(0, 3);
  const topSkills = [...skills].sort((a, b) => b.proficiency - a.proficiency).slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-widest text-violet-300 mb-1">Dashboard</div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">Welcome back 👋</h1>
        <p className="text-sm text-slate-400 mt-1">Here's what's happening with your portfolio today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="!p-4 sm:!p-5">
            <div className="flex items-center justify-between">
              <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg`}>
                <c.icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="mt-4 text-2xl sm:text-3xl font-semibold text-slate-50">
              {loading ? <span className="shimmer inline-block h-8 w-12 rounded" /> : c.value ?? 0}
            </div>
            <div className="text-xs text-slate-400 mt-1">{c.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">Recent messages</h3>
            <button onClick={() => onNav("messages")} className="text-xs text-violet-300 hover:text-violet-200">View all →</button>
          </div>
          <div className="space-y-2">
            {recent.length === 0 && <div className="text-xs text-slate-500">No messages yet.</div>}
            {recent.map((m) => (
              <div key={m.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-200 truncate">{m.name}</div>
                  {!m.is_read && <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />}
                </div>
                <div className="text-[11px] text-slate-500 truncate">{m.subject || "No subject"}</div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-2">{m.message}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">Top skills</h3>
            <button onClick={() => onNav("skills")} className="text-xs text-violet-300 hover:text-violet-200">Manage →</button>
          </div>
          <div className="space-y-3">
            {topSkills.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{s.name}</span>
                  <span className="text-slate-500">{s.proficiency}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500" style={{ width: `${s.proficiency}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

/* ---------- Profile Section ---------- */
function ProfileSection({ profile, setProfile, notify, refresh, loading }: {
  profile: PortfolioProfile | null; setProfile: (p: PortfolioProfile) => void;
  notify: (m: string, t?: "success" | "error" | "info") => void; refresh: () => Promise<void>; loading: boolean;
}) {
  const [form, setForm] = useState<PortfolioProfile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (profile) setForm(profile); }, [profile]);

  const set = (k: keyof PortfolioProfile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => (f ? { ...f, [k]: e.target.value as any } : f));

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const updated = await api.updateProfile({
        ...form,
        career_start_year: Number(form.career_start_year),
      });
      setProfile(updated);
      await refresh();
      notify("Profile updated.");
    } catch {
      notify("Failed to save profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <div className="text-sm text-slate-500">Loading…</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-violet-300 mb-1">Profile</div>
          <h1 className="text-2xl font-semibold text-slate-50">Public profile</h1>
        </div>
        <Button icon={<Save className="h-4 w-4" />} onClick={save} loading={saving}>Save changes</Button>
      </div>

      <Card>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Full name</label>
            <Input value={form.full_name} onChange={set("full_name")} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Title</label>
            <Input value={form.title} onChange={set("title")} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400 mb-1.5 block">Bio</label>
            <Textarea rows={4} value={form.bio} onChange={set("bio")} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Email</label>
            <Input value={form.email} onChange={set("email")} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Phone</label>
            <Input value={form.phone} onChange={set("phone")} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Location</label>
            <Input value={form.location} onChange={set("location")} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Career start year</label>
            <Input type="number" value={form.career_start_year} onChange={set("career_start_year")} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block flex items-center gap-1.5"><GithubIcon className="h-3 w-3" /> GitHub URL</label>
            <Input value={form.github_url} onChange={set("github_url")} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block flex items-center gap-1.5"><LinkedinIcon className="h-3 w-3" /> LinkedIn URL</label>
            <Input value={form.linkedin_url} onChange={set("linkedin_url")} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ---------- Skills CRUD ---------- */
function SkillsSection({ skills, refresh, notify }: {
  skills: Skill[]; refresh: () => Promise<void>; notify: (m: string, t?: "success" | "error" | "info") => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);

  const blank = (): Omit<Skill, "id"> => ({ name: "", category: "Frontend", proficiency: 80, order: skills.length + 1 });
  const [form, setForm] = useState<Omit<Skill, "id">>(blank());

  const openNew = () => { setEditing(null); setForm(blank()); setOpen(true); };
  const openEdit = (s: Skill) => { setEditing(s); setForm({ name: s.name, category: s.category, proficiency: s.proficiency, order: s.order }); setOpen(true); };

  const save = async () => {
    try {
      if (editing) await api.updateSkill(editing.id, form);
      else await api.createSkill(form);
      setOpen(false);
      await refresh();
      notify(editing ? "Skill updated." : "Skill added.");
    } catch {
      notify("Failed to save skill.", "error");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await api.deleteSkill(id);
      await refresh();
      notify("Skill deleted.", "info");
    } catch {
      notify("Failed to delete.", "error");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-violet-300 mb-1">Skills</div>
          <h1 className="text-2xl font-semibold text-slate-50">Tech skills ({skills.length})</h1>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openNew}>Add skill</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((s) => (
          <Card key={s.id} className="!p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-100 truncate">{s.name}</div>
                <Badge className="mt-1.5">{s.category}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-slate-400 hover:bg-white/10 hover:text-slate-200"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => remove(s.id)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-500">Proficiency</span>
                <span className="text-slate-300">{s.proficiency}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500" style={{ width: `${s.proficiency}%` }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit skill" : "New skill"}>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Skill["category"] })}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-violet-400/60"
              >
                {skillCategories.map((c) => <option key={c} value={c} className="bg-[#0b0b14]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Order</label>
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Proficiency — {form.proficiency}%</label>
            <input
              type="range" min={0} max={100} value={form.proficiency}
              onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
              className="w-full accent-violet-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save" : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

/* ---------- Projects CRUD ---------- */
function ProjectsSection({ projects, refresh, notify }: {
  projects: Project[]; refresh: () => Promise<void>; notify: (m: string, t?: "success" | "error" | "info") => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const blank = (): Omit<Project, "id"> => ({
    title: "", description: "", tech_stack: [], github_url: "", live_url: "", featured: false, order: projects.length + 1,
  });
  const [form, setForm] = useState<Omit<Project, "id">>(blank());
  const [stackInput, setStackInput] = useState("");

  const openNew = () => { setEditing(null); setForm(blank()); setStackInput(""); setOpen(true); };
  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, tech_stack: p.tech_stack, github_url: p.github_url, live_url: p.live_url, featured: p.featured, order: p.order });
    setStackInput(p.tech_stack.join(", "));
    setOpen(true);
  };

  const save = async () => {
    try {
      const payload = { ...form, tech_stack: stackInput.split(",").map((s) => s.trim()).filter(Boolean) };
      if (editing) await api.updateProject(editing.id, payload);
      else await api.createProject(payload);
      setOpen(false);
      await refresh();
      notify(editing ? "Project updated." : "Project added.");
    } catch {
      notify("Failed to save project.", "error");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.deleteProject(id);
      await refresh();
      notify("Project deleted.", "info");
    } catch {
      notify("Failed to delete.", "error");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-violet-300 mb-1">Projects</div>
          <h1 className="text-2xl font-semibold text-slate-50">Portfolio projects ({projects.length})</h1>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openNew}>Add project</Button>
      </div>

      <div className="space-y-3">
        {projects.map((p) => (
          <Card key={p.id} className="!p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-sm font-semibold text-slate-100">{p.title}</div>
                  {p.featured && <Badge className="!text-amber-200 !border-amber-400/30 !bg-amber-500/10"><Sparkles className="h-3 w-3" /> Featured</Badge>}
                </div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tech_stack.slice(0, 6).map((t) => <Badge key={t}>{t}</Badge>)}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-slate-200"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(p.id)} className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit project" : "New project"} size="lg">
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Order</label>
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Description</label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Tech stack (comma separated)</label>
            <Input value={stackInput} onChange={(e) => setStackInput(e.target.value)} placeholder="React, Django, PostgreSQL" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">GitHub URL</label>
              <Input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Live URL</label>
              <Input value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-violet-500" />
            Mark as featured
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save" : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

/* ---------- Experience CRUD ---------- */
function ExperienceSection({ experience, refresh, notify }: {
  experience: ExperienceT[]; refresh: () => Promise<void>; notify: (m: string, t?: "success" | "error" | "info") => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ExperienceT | null>(null);
  const blank = (): Omit<ExperienceT, "id"> => ({
    company: "", role: "", start_date: "", end_date: null, is_current: false, description: "", order: experience.length + 1,
  });
  const [form, setForm] = useState<Omit<ExperienceT, "id">>(blank());

  const openNew = () => { setEditing(null); setForm(blank()); setOpen(true); };
  const openEdit = (e: ExperienceT) => {
    setEditing(e);
    setForm({ company: e.company, role: e.role, start_date: e.start_date, end_date: e.end_date, is_current: e.is_current, description: e.description, order: e.order });
    setOpen(true);
  };

  const save = async () => {
    try {
      const payload = { ...form, end_date: form.is_current ? null : (form.end_date || null) };
      if (editing) await api.updateExperience(editing.id, payload);
      else await api.createExperience(payload);
      setOpen(false);
      await refresh();
      notify(editing ? "Experience updated." : "Experience added.");
    } catch {
      notify("Failed to save.", "error");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await api.deleteExperience(id);
      await refresh();
      notify("Experience deleted.", "info");
    } catch {
      notify("Failed to delete.", "error");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-violet-300 mb-1">Experience</div>
          <h1 className="text-2xl font-semibold text-slate-50">Work history ({experience.length})</h1>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openNew}>Add role</Button>
      </div>

      <div className="space-y-3">
        {experience.map((e) => (
          <Card key={e.id} className="!p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-sm font-semibold text-slate-100">{e.role}</div>
                  {e.is_current && <Badge className="!text-emerald-200 !border-emerald-500/30 !bg-emerald-500/10">Current</Badge>}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{e.company} · {e.start_date} → {e.end_date ?? "Present"}</div>
                <div className="text-xs text-slate-300 mt-2 line-clamp-3">{e.description}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(e)} className="p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-slate-200"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(e.id)} className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit experience" : "New experience"} size="lg">
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Role</label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Company</label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Start date</label>
              <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">End date</label>
              <Input type="date" value={form.end_date ?? ""} disabled={form.is_current} onChange={(e) => setForm({ ...form, end_date: e.target.value || null })} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.is_current} onChange={(e) => setForm({ ...form, is_current: e.target.checked })} className="accent-violet-500" />
              Currently working here
            </label>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Order</label>
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Description</label>
            <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save" : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

/* ---------- Resume ---------- */
function ResumeSection({ resume, setResume, notify }: {
  resume: Resume | null; setResume: (r: Resume | null) => void; notify: (m: string, t?: "success" | "error" | "info") => void;
}) {
  const [uploading, setUploading] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const r = await api.uploadResume(file);
      setResume(r);
      notify("Resume uploaded.");
    } catch {
      notify("Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    if (!confirm("Remove the uploaded resume?")) return;
    try {
      await api.deleteResume();
      setResume(null);
      notify("Resume removed.", "info");
    } catch {
      notify("Failed to remove.", "error");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-5">
        <div className="text-[10px] uppercase tracking-widest text-violet-300 mb-1">Resume</div>
        <h1 className="text-2xl font-semibold text-slate-50">Downloadable resume</h1>
        <p className="text-sm text-slate-400 mt-1">If a resume is uploaded, the "Download Resume" button appears in the hero section.</p>
      </div>

      <Card className="!p-6">
        {resume ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shrink-0">
              <FileText className="h-6 w-6 text-violet-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-100">Resume on file</div>
              <div className="text-xs text-slate-400 mt-0.5">Last updated {new Date(resume.updated_at).toLocaleString()}</div>
              <Badge className="mt-2">Active — button visible</Badge>
            </div>
            <div className="flex items-center gap-2">
              <a href={resume.file} download className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-slate-200">
                <Upload className="h-4 w-4" /> Download
              </a>
              <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} onClick={remove}>Remove</Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-slate-500" />
            </div>
            <div className="text-sm text-slate-300">No resume uploaded</div>
            <div className="text-xs text-slate-500 mt-1">The resume button is hidden on the public site.</div>
          </div>
        )}

        <div className="mt-5 pt-5 border-t border-white/10">
          <label className="block">
            <div className="text-xs text-slate-400 mb-2">Upload new {resume ? "(replaces current)" : ""}</div>
            <div className="rounded-xl border border-dashed border-white/15 bg-white/5 hover:bg-white/10 transition p-5 text-center cursor-pointer">
              <Upload className="h-5 w-5 mx-auto text-slate-400 mb-2" />
              <div className="text-xs text-slate-300">Click to choose a PDF</div>
              <input type="file" accept="application/pdf,.pdf" onChange={onFile} className="hidden" disabled={uploading} />
            </div>
          </label>
          {uploading && <div className="text-xs text-slate-400 mt-2">Uploading…</div>}
        </div>
      </Card>
    </motion.div>
  );
}

/* ---------- Messages ---------- */
function MessagesSection({ messages, refresh, notify }: {
  messages: ContactMessage[]; refresh: () => Promise<void>; notify: (m: string, t?: "success" | "error" | "info") => void;
}) {
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const open = async (m: ContactMessage) => {
    setSelected(m);
    if (!m.is_read) {
      await api.markMessageRead(m.id);
      await refresh();
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.deleteMessage(id);
      if (selected?.id === id) setSelected(null);
      await refresh();
      notify("Message deleted.", "info");
    } catch {
      notify("Failed to delete.", "error");
    }
  };

  const fmt = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-5">
        <div className="text-[10px] uppercase tracking-widest text-violet-300 mb-1">Inbox</div>
        <h1 className="text-2xl font-semibold text-slate-50">Contact messages ({messages.length})</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-4">
        <div className="space-y-2">
          {messages.length === 0 && <div className="text-sm text-slate-500">No messages yet.</div>}
          {messages.map((m) => (
            <button
              key={m.id}
              onClick={() => open(m)}
              className={`w-full text-left glass rounded-xl p-3 transition ${selected?.id === m.id ? "!border-violet-400/40 bg-white/10" : "hover:bg-white/5"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {!m.is_read && <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />}
                  <div className="text-sm font-semibold text-slate-100 truncate">{m.name}</div>
                </div>
                <div className="text-[10px] text-slate-500 shrink-0">{fmt(m.created_at)}</div>
              </div>
              <div className="text-xs text-slate-400 truncate mt-0.5">{m.subject || "No subject"}</div>
              <div className="text-xs text-slate-500 truncate mt-0.5">{m.message}</div>
            </button>
          ))}
        </div>

        <Card className="min-h-[300px]">
          {selected ? (
            <div>
              <div className="flex items-start justify-between gap-2 pb-4 border-b border-white/10">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-100">{selected.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    <a href={`mailto:${selected.email}`} className="hover:text-slate-200">{selected.email}</a>
                    <span className="mx-2 text-slate-600">·</span>
                    {fmt(selected.created_at)}
                  </div>
                  <div className="text-xs text-slate-300 mt-2">{selected.subject || "No subject"}</div>
                </div>
                <Button variant="danger" size="sm" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => remove(selected.id)}>
                  Delete
                </Button>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mt-4 whitespace-pre-wrap">{selected.message}</p>
              <div className="mt-5 flex items-center gap-2">
                <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "")}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-sm">
                  <Mail className="h-4 w-4" /> Reply
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[260px] flex items-center justify-center text-center">
              <div>
                <Mail className="h-8 w-8 mx-auto text-slate-600 mb-2" />
                <div className="text-sm text-slate-400">Select a message to read</div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </motion.div>
  );
}
