"use client";

import { useState } from "react";
import { randomId } from "@/lib/randomId";
import type {
  PortfolioContent,
  ExperienceItem,
  ProjectItem,
  AwardItem,
  EducationItem,
  SkillGroup,
} from "@/lib/types";

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      )}
    </div>
  );
}

function Card({ children, onDelete, onMoveUp, onMoveDown }: {
  children: React.ReactNode;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      {children}
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onMoveUp} className="text-xs text-muted hover:text-foreground">↑ Up</button>
        <button type="button" onClick={onMoveDown} className="text-xs text-muted hover:text-foreground">↓ Down</button>
        <button type="button" onClick={onDelete} className="text-xs text-red-400 hover:text-red-300 ml-auto">Delete</button>
      </div>
    </div>
  );
}

function move<T>(arr: T[], index: number, dir: -1 | 1): T[] {
  const next = [...arr];
  const target = index + dir;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function AdminEditor({ initialContent }: { initialContent: PortfolioContent }) {
  const [content, setContent] = useState<PortfolioContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Save failed.");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-12 pb-32">
      {/* Basics */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Basics</h2>
        <Field label="Name" value={content.name} onChange={(v) => setContent({ ...content, name: v })} />
        <Field label="Title" value={content.title} onChange={(v) => setContent({ ...content, title: v })} />
        <Field label="Tagline" value={content.tagline} onChange={(v) => setContent({ ...content, tagline: v })} />
        <Field label="Location" value={content.location} onChange={(v) => setContent({ ...content, location: v })} />
        <Field label="Summary" textarea value={content.summary} onChange={(v) => setContent({ ...content, summary: v })} />
      </section>

      {/* Social */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Contact & Social Links</h2>
        <Field label="Email" value={content.social.email} onChange={(v) => setContent({ ...content, social: { ...content.social, email: v } })} />
        <Field label="Phone" value={content.social.phone} onChange={(v) => setContent({ ...content, social: { ...content.social, phone: v } })} />
        <Field label="LinkedIn URL" value={content.social.linkedin} onChange={(v) => setContent({ ...content, social: { ...content.social, linkedin: v } })} />
        <Field label="GitHub URL" value={content.social.github} onChange={(v) => setContent({ ...content, social: { ...content.social, github: v } })} />
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Experience</h2>
          <button
            type="button"
            className="text-xs text-accent"
            onClick={() =>
              setContent({
                ...content,
                experience: [
                  ...content.experience,
                  { id: randomId(), role: "", company: "", location: "", start: "", end: "", bullets: [] } as ExperienceItem,
                ],
              })
            }
          >
            + Add Experience
          </button>
        </div>
        {content.experience.map((exp, i) => (
          <Card
            key={exp.id}
            onDelete={() => setContent({ ...content, experience: content.experience.filter((_, idx) => idx !== i) })}
            onMoveUp={() => setContent({ ...content, experience: move(content.experience, i, -1) })}
            onMoveDown={() => setContent({ ...content, experience: move(content.experience, i, 1) })}
          >
            <Field label="Role" value={exp.role} onChange={(v) => {
              const next = [...content.experience]; next[i] = { ...exp, role: v }; setContent({ ...content, experience: next });
            }} />
            <Field label="Company" value={exp.company} onChange={(v) => {
              const next = [...content.experience]; next[i] = { ...exp, company: v }; setContent({ ...content, experience: next });
            }} />
            <Field label="Location" value={exp.location} onChange={(v) => {
              const next = [...content.experience]; next[i] = { ...exp, location: v }; setContent({ ...content, experience: next });
            }} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start" value={exp.start} onChange={(v) => {
                const next = [...content.experience]; next[i] = { ...exp, start: v }; setContent({ ...content, experience: next });
              }} />
              <Field label="End" value={exp.end} onChange={(v) => {
                const next = [...content.experience]; next[i] = { ...exp, end: v }; setContent({ ...content, experience: next });
              }} />
            </div>
            <Field
              label="Bullets (one per line)"
              textarea
              value={exp.bullets.join("\n")}
              onChange={(v) => {
                const next = [...content.experience];
                next[i] = { ...exp, bullets: v.split("\n").filter(Boolean) };
                setContent({ ...content, experience: next });
              }}
            />
          </Card>
        ))}
      </section>

      {/* Projects */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Projects</h2>
          <button
            type="button"
            className="text-xs text-accent"
            onClick={() =>
              setContent({
                ...content,
                projects: [
                  ...content.projects,
                  { id: randomId(), title: "", description: "", tags: [], liveUrl: "", githubUrl: "", image: "" } as ProjectItem,
                ],
              })
            }
          >
            + Add Project
          </button>
        </div>
        {content.projects.map((p, i) => (
          <Card
            key={p.id}
            onDelete={() => setContent({ ...content, projects: content.projects.filter((_, idx) => idx !== i) })}
            onMoveUp={() => setContent({ ...content, projects: move(content.projects, i, -1) })}
            onMoveDown={() => setContent({ ...content, projects: move(content.projects, i, 1) })}
          >
            <Field label="Title" value={p.title} onChange={(v) => {
              const next = [...content.projects]; next[i] = { ...p, title: v }; setContent({ ...content, projects: next });
            }} />
            <Field label="Description" textarea value={p.description} onChange={(v) => {
              const next = [...content.projects]; next[i] = { ...p, description: v }; setContent({ ...content, projects: next });
            }} />
            <Field label="Tags (comma separated)" value={p.tags.join(", ")} onChange={(v) => {
              const next = [...content.projects]; next[i] = { ...p, tags: v.split(",").map((t) => t.trim()).filter(Boolean) }; setContent({ ...content, projects: next });
            }} />
            <Field label="Live URL" value={p.liveUrl} onChange={(v) => {
              const next = [...content.projects]; next[i] = { ...p, liveUrl: v }; setContent({ ...content, projects: next });
            }} />
            <Field label="GitHub URL" value={p.githubUrl} onChange={(v) => {
              const next = [...content.projects]; next[i] = { ...p, githubUrl: v }; setContent({ ...content, projects: next });
            }} />
            <Field label="Image URL" value={p.image} onChange={(v) => {
              const next = [...content.projects]; next[i] = { ...p, image: v }; setContent({ ...content, projects: next });
            }} />
          </Card>
        ))}
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Skills</h2>
          <button
            type="button"
            className="text-xs text-accent"
            onClick={() =>
              setContent({ ...content, skills: [...content.skills, { id: randomId(), category: "", items: [] } as SkillGroup] })
            }
          >
            + Add Group
          </button>
        </div>
        {content.skills.map((s, i) => (
          <Card
            key={s.id}
            onDelete={() => setContent({ ...content, skills: content.skills.filter((_, idx) => idx !== i) })}
            onMoveUp={() => setContent({ ...content, skills: move(content.skills, i, -1) })}
            onMoveDown={() => setContent({ ...content, skills: move(content.skills, i, 1) })}
          >
            <Field label="Category" value={s.category} onChange={(v) => {
              const next = [...content.skills]; next[i] = { ...s, category: v }; setContent({ ...content, skills: next });
            }} />
            <Field label="Items (comma separated)" value={s.items.join(", ")} onChange={(v) => {
              const next = [...content.skills]; next[i] = { ...s, items: v.split(",").map((t) => t.trim()).filter(Boolean) }; setContent({ ...content, skills: next });
            }} />
          </Card>
        ))}
      </section>

      {/* Education */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Education</h2>
          <button
            type="button"
            className="text-xs text-accent"
            onClick={() =>
              setContent({
                ...content,
                education: [...content.education, { id: randomId(), institution: "", degree: "", years: "", gpa: "", detail: "" } as EducationItem],
              })
            }
          >
            + Add Education
          </button>
        </div>
        {content.education.map((e, i) => (
          <Card
            key={e.id}
            onDelete={() => setContent({ ...content, education: content.education.filter((_, idx) => idx !== i) })}
            onMoveUp={() => setContent({ ...content, education: move(content.education, i, -1) })}
            onMoveDown={() => setContent({ ...content, education: move(content.education, i, 1) })}
          >
            <Field label="Institution" value={e.institution} onChange={(v) => {
              const next = [...content.education]; next[i] = { ...e, institution: v }; setContent({ ...content, education: next });
            }} />
            <Field label="Degree" value={e.degree} onChange={(v) => {
              const next = [...content.education]; next[i] = { ...e, degree: v }; setContent({ ...content, education: next });
            }} />
            <Field label="Years" value={e.years} onChange={(v) => {
              const next = [...content.education]; next[i] = { ...e, years: v }; setContent({ ...content, education: next });
            }} />
            <Field label="GPA" value={e.gpa} onChange={(v) => {
              const next = [...content.education]; next[i] = { ...e, gpa: v }; setContent({ ...content, education: next });
            }} />
          </Card>
        ))}
      </section>

      {/* Awards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Awards</h2>
          <button
            type="button"
            className="text-xs text-accent"
            onClick={() =>
              setContent({ ...content, awards: [...content.awards, { id: randomId(), title: "", description: "", year: "" } as AwardItem] })
            }
          >
            + Add Award
          </button>
        </div>
        {content.awards.map((a, i) => (
          <Card
            key={a.id}
            onDelete={() => setContent({ ...content, awards: content.awards.filter((_, idx) => idx !== i) })}
            onMoveUp={() => setContent({ ...content, awards: move(content.awards, i, -1) })}
            onMoveDown={() => setContent({ ...content, awards: move(content.awards, i, 1) })}
          >
            <Field label="Title" value={a.title} onChange={(v) => {
              const next = [...content.awards]; next[i] = { ...a, title: v }; setContent({ ...content, awards: next });
            }} />
            <Field label="Description" textarea value={a.description} onChange={(v) => {
              const next = [...content.awards]; next[i] = { ...a, description: v }; setContent({ ...content, awards: next });
            }} />
            <Field label="Year" value={a.year} onChange={(v) => {
              const next = [...content.awards]; next[i] = { ...a, year: v }; setContent({ ...content, awards: next });
            }} />
          </Card>
        ))}
      </section>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {saved && <span className="text-sm text-accent">Saved!</span>}
          {error && <span className="text-sm text-red-400">{error}</span>}
        </div>
      </div>
    </div>
  );
}
