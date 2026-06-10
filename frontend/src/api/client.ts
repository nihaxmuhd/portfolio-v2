import type {
  AuthUser,
  ContactMessage,
  Experience,
  PortfolioProfile,
  Project,
  Resume,
  Skill,
  Stats,
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";
const TOKEN_KEY = "portfolio.session.token";

function getHeaders(isFormData = false): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...getHeaders(isFormData),
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }
    let msg = res.statusText;
    try {
      const errBody = await res.json();
      msg = errBody.detail || errBody.non_field_errors?.[0] || JSON.stringify(errBody);
    } catch {
      // fallback to statusText
    }
    throw Object.assign(new Error(msg), { status: res.status });
  }

  if (res.status === 204) return null as T;
  return res.json();
}

// ---------- public endpoints ----------

export const getProfile = () => request<PortfolioProfile>("/api/profile/");
export const getStats = () => request<Stats>("/api/stats/");
export const getSkills = () => request<Skill[]>("/api/skills/");
export const getProjects = () => request<Project[]>("/api/projects/");
export const getExperience = () => request<Experience[]>("/api/experience/");
export const getResume = () => request<Resume | null>("/api/resume/").catch((e) => {
  if (e.status === 404) return null;
  throw e;
});

export const submitContact = (data: Omit<ContactMessage, "id" | "created_at" | "is_read">) =>
  request<ContactMessage>("/api/contact/", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ---------- auth endpoints ----------

export async function login(username: string, password: string) {
  const data = await request<{ token: string; user: AuthUser }>("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

export async function logout() {
  try {
    await request("/api/auth/logout/", { method: "POST" });
  } catch {
    // Ignore error if token is already invalid
  }
  localStorage.removeItem(TOKEN_KEY);
}

export const me = () => request<AuthUser>("/api/auth/me/").catch(() => null);

// ---------- admin endpoints ----------

export const updateProfile = (patch: Partial<PortfolioProfile>) =>
  request<PortfolioProfile>("/api/profile/", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });

export const createSkill = (data: Omit<Skill, "id">) =>
  request<Skill>("/api/skills/", { method: "POST", body: JSON.stringify(data) });

export const updateSkill = (id: number, patch: Partial<Skill>) =>
  request<Skill>(`/api/skills/${id}/`, { method: "PATCH", body: JSON.stringify(patch) });

export const deleteSkill = (id: number) =>
  request<void>(`/api/skills/${id}/`, { method: "DELETE" });

export const createProject = (data: Omit<Project, "id">) =>
  request<Project>("/api/projects/", { method: "POST", body: JSON.stringify(data) });

export const updateProject = (id: number, patch: Partial<Project>) =>
  request<Project>(`/api/projects/${id}/`, { method: "PATCH", body: JSON.stringify(patch) });

export const deleteProject = (id: number) =>
  request<void>(`/api/projects/${id}/`, { method: "DELETE" });

export const createExperience = (data: Omit<Experience, "id">) =>
  request<Experience>("/api/experience/", { method: "POST", body: JSON.stringify(data) });

export const updateExperience = (id: number, patch: Partial<Experience>) =>
  request<Experience>(`/api/experience/${id}/`, { method: "PATCH", body: JSON.stringify(patch) });

export const deleteExperience = (id: number) =>
  request<void>(`/api/experience/${id}/`, { method: "DELETE" });

export const uploadResume = (file: File) => {
  const fd = new FormData();
  fd.append("file", file);
  return request<Resume>("/api/resume/", { method: "POST", body: fd });
};

export const deleteResume = () => request<void>("/api/resume/", { method: "DELETE" });

export const getMessages = () => request<ContactMessage[]>("/api/messages/");

export const markMessageRead = (id: number) =>
  request<void>(`/api/messages/${id}/read/`, { method: "POST" });

export const deleteMessage = (id: number) =>
  request<void>(`/api/messages/${id}/`, { method: "DELETE" });


// ---------- AI assistant (client-side context aggregator) ----------

export async function askAssistant(question: string): Promise<string> {
  const q = question.toLowerCase().trim();

  // Fetch the latest data to provide context-aware answers
  const [profile, skills, projects, exp] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getExperience(),
  ]);

  const years = new Date().getFullYear() - profile.career_start_year;

  if (/\b(who|name|about you|introduce|intro)\b/.test(q)) {
    return `${profile.full_name} — ${profile.title} based in ${profile.location}. ${profile.bio}`;
  }

  if (/\b(email|contact|reach|phone|hire)\b/.test(q)) {
    return `You can reach ${profile.full_name} at ${profile.email}${profile.phone ? ` or ${profile.phone}` : ""}. Location: ${profile.location}.`;
  }

  if (/\b(skill|tech|stack|language|framework)\b/.test(q)) {
    const grouped = skills.reduce<Record<string, string[]>>((acc, s) => {
      (acc[s.category] ||= []).push(s.name);
      return acc;
    }, {});
    const parts = Object.entries(grouped).map(([cat, list]) => `**${cat}:** ${list.join(", ")}`);
    return `Here's the current tech stack:\n\n${parts.join("\n")}`;
  }

  if (/\b(project|work|built|portfolio|case stud)\b/.test(q)) {
    if (projects.length === 0) return "No projects published yet — check back soon.";
    const list = projects
      .slice(0, 5)
      .map((p) => `• **${p.title}** — ${p.description.split(".")[0]}. _Stack: ${p.tech_stack.join(", ")}_`)
      .join("\n");
    return `Recent projects:\n\n${list}`;
  }

  if (/\b(experience|career|job|work history|company|role)\b/.test(q)) {
    const list = exp
      .map(
        (e) =>
          `• **${e.role}** at ${e.company} (${e.start_date}${e.is_current ? " – Present" : ` – ${e.end_date}`})`
      )
      .join("\n");
    return `${years}+ years of experience:\n\n${list}`;
  }

  if (/\b(resume|cv)\b/.test(q)) {
    return `You can check if a resume is available via the **Download Resume** button in the hero section.`;
  }

  if (/\b(years?|how long)\b/.test(q)) {
    return `${profile.full_name} has been shipping production software for ${years} years (started in ${profile.career_start_year}).`;
  }

  if (/\b(github|linkedin|social)\b/.test(q)) {
    return `GitHub: ${profile.github_url}\nLinkedIn: ${profile.linkedin_url}`;
  }

  return `Great question. I can tell you about ${profile.full_name}'s skills, projects, experience, or how to get in touch. Try asking "What projects have you built?" or "What's your tech stack?"`;
}
