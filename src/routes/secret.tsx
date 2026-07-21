import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  DEFAULT_DATA,
  loadData,
  resetData,
  saveData,
  publishCloud,
  fetchCloud,
  uid,
  type Degree,
  type Experience,
  type ResumeData,
} from "@/lib/resume-data";
import { Download, Upload, RotateCcw, Plus, Trash2, Eye, Cloud, CloudDownload } from "lucide-react";

export const Route = createFileRoute("/secret")({
  component: SecretEditor,
  head: () => ({
    meta: [
      { title: "Editor" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function SecretEditor() {
  const [data, setData] = useState<ResumeData>(() =>
    typeof window === "undefined" ? DEFAULT_DATA : loadData(),
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<ResumeData>) => {
    const next = { ...data, ...patch };
    setData(next);
    saveData(next);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    setData(parsed);
    saveData(parsed);
  };

  const readAsDataUrl = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.onerror = rej;
      r.readAsDataURL(file);
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <h1 className="font-display text-xl font-semibold">Secret Editor</h1>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
            >
              <Eye className="h-4 w-4" /> View
            </Link>
            <button
              onClick={exportJson}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
            >
              <Download className="h-4 w-4" /> Export
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
            >
              <Upload className="h-4 w-4" /> Import
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])}
            />
            <button
              onClick={() => {
                if (confirm("Reset everything to defaults?")) {
                  resetData();
                  setData(DEFAULT_DATA);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-10 px-6 py-10">
        <Note>
          Changes save automatically in your browser. Use <b>Export</b> to download a{" "}
          <code>resume-data.json</code> backup, and <b>Import</b> to restore it.
          <br />
          For permanent images: drop files into <code>public/images/</code> in your
          GitHub repo, then reference them here as <code>/images/your-file.jpg</code>.
          You can also upload images below (they'll be embedded directly in the data).
        </Note>

        <Group title="Profile">
          <Field label="Name" value={data.name} onChange={(v) => update({ name: v })} />
          <Field label="Title" value={data.title} onChange={(v) => update({ title: v })} />
          <Field label="Tagline" value={data.tagline} onChange={(v) => update({ tagline: v })} textarea />
          <Field label="Location" value={data.location} onChange={(v) => update({ location: v })} />
          <Field label="Email" value={data.email} onChange={(v) => update({ email: v })} />
          <div>
            <label className="mb-1 block text-sm font-medium">Profile photo</label>
            <div className="flex items-center gap-4">
              <img src={data.photo || "/images/profile-placeholder.svg"} alt="" className="h-16 w-16 rounded-full object-cover" />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) update({ photo: await readAsDataUrl(f) });
                }}
                className="text-sm"
              />
            </div>
            <Field
              label="Or path (e.g. /images/me.jpg)"
              value={data.photo}
              onChange={(v) => update({ photo: v })}
            />
          </div>
          <Field label="About" value={data.about} onChange={(v) => update({ about: v })} textarea />
        </Group>

        <Group title="Socials">
          <ListEditor
            items={data.socials}
            onChange={(socials) => update({ socials })}
            newItem={() => ({ label: "New", url: "https://" })}
            render={(item, set) => (
              <div className="grid grid-cols-2 gap-2">
                <Field label="Label" value={item.label} onChange={(v) => set({ ...item, label: v })} />
                <Field label="URL" value={item.url} onChange={(v) => set({ ...item, url: v })} />
              </div>
            )}
          />
        </Group>

        <Group title="Experience">
          <ListEditor
            items={data.experiences}
            onChange={(experiences) => update({ experiences })}
            newItem={(): Experience => ({ id: uid(), role: "", company: "", years: "", location: "", description: "" })}
            render={(item, set) => (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Role" value={item.role} onChange={(v) => set({ ...item, role: v })} />
                  <Field label="Company" value={item.company} onChange={(v) => set({ ...item, company: v })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Years" value={item.years} onChange={(v) => set({ ...item, years: v })} />
                  <Field label="Location" value={item.location ?? ""} onChange={(v) => set({ ...item, location: v })} />
                </div>
                <Field label="Description" value={item.description} onChange={(v) => set({ ...item, description: v })} textarea />
              </div>
            )}
          />
        </Group>

        <Group title="Education">
          <ListEditor
            items={data.degrees}
            onChange={(degrees) => update({ degrees })}
            newItem={(): Degree => ({ id: uid(), school: "", degree: "", field: "", years: "", detail: "" })}
            render={(item, set) => (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Degree" value={item.degree} onChange={(v) => set({ ...item, degree: v })} />
                  <Field label="Field" value={item.field} onChange={(v) => set({ ...item, field: v })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="School" value={item.school} onChange={(v) => set({ ...item, school: v })} />
                  <Field label="Years" value={item.years} onChange={(v) => set({ ...item, years: v })} />
                </div>
                <Field label="Detail" value={item.detail ?? ""} onChange={(v) => set({ ...item, detail: v })} textarea />
              </div>
            )}
          />
        </Group>

        <Group title="Projects">
          <ListEditor
            items={data.projects}
            onChange={(projects) => update({ projects })}
            newItem={() => ({ id: uid(), title: "", description: "", tags: [], image: "", link: "" })}
            render={(item, set) => (
              <div className="space-y-2">
                <Field label="Title" value={item.title} onChange={(v) => set({ ...item, title: v })} />
                <Field label="Description" value={item.description} onChange={(v) => set({ ...item, description: v })} textarea />
                <Field label="Link" value={item.link ?? ""} onChange={(v) => set({ ...item, link: v })} />
                <Field
                  label="Tags (comma-separated)"
                  value={(item.tags ?? []).join(", ")}
                  onChange={(v) => set({ ...item, tags: v.split(",").map((s) => s.trim()).filter(Boolean) })}
                />
                <div>
                  <label className="mb-1 block text-sm font-medium">Image</label>
                  <div className="flex items-center gap-3">
                    {item.image && <img src={item.image} alt="" className="h-14 w-24 rounded object-cover" />}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) set({ ...item, image: await readAsDataUrl(f) });
                      }}
                      className="text-sm"
                    />
                  </div>
                  <Field
                    label="Or path"
                    value={item.image ?? ""}
                    onChange={(v) => set({ ...item, image: v })}
                  />
                </div>
              </div>
            )}
          />
        </Group>

        <Group title="Publications">
          <ListEditor
            items={data.publications}
            onChange={(publications) => update({ publications })}
            newItem={() => ({ id: uid(), title: "", venue: "", year: "", authors: "", link: "" })}
            render={(item, set) => (
              <div className="space-y-2">
                <Field label="Title" value={item.title} onChange={(v) => set({ ...item, title: v })} />
                <Field label="Authors" value={item.authors ?? ""} onChange={(v) => set({ ...item, authors: v })} />
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Venue" value={item.venue} onChange={(v) => set({ ...item, venue: v })} />
                  <Field label="Year" value={item.year} onChange={(v) => set({ ...item, year: v })} />
                </div>
                <Field label="Link" value={item.link ?? ""} onChange={(v) => set({ ...item, link: v })} />
              </div>
            )}
          />
        </Group>

        <Group title="Extra Sections">
          <ListEditor
            items={data.extras}
            onChange={(extras) => update({ extras })}
            newItem={() => ({ id: uid(), title: "New Section", items: [] })}
            render={(section, set) => (
              <div className="space-y-3">
                <Field label="Section title" value={section.title} onChange={(v) => set({ ...section, title: v })} />
                <ListEditor
                  items={section.items}
                  onChange={(items) => set({ ...section, items })}
                  newItem={() => ({ id: uid(), title: "", detail: "" })}
                  render={(it, setIt) => (
                    <div className="space-y-2">
                      <Field label="Title" value={it.title} onChange={(v) => setIt({ ...it, title: v })} />
                      <Field label="Detail" value={it.detail ?? ""} onChange={(v) => setIt({ ...it, detail: v })} />
                    </div>
                  )}
                />
              </div>
            )}
          />
        </Group>
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm text-foreground/80">
      {children}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 font-display text-2xl font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

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
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
        />
      )}
    </div>
  );
}

function ListEditor<T>({
  items,
  onChange,
  render,
  newItem,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, set: (v: T) => void) => React.ReactNode;
  newItem: () => T;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="relative rounded-lg border border-border bg-background p-4">
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {render(item, (v) => onChange(items.map((it, j) => (j === i ? v : it))))}
        </div>
      ))}
      <button
        onClick={() => onChange([...items, newItem()])}
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:border-accent hover:text-accent"
      >
        <Plus className="h-4 w-4" /> Add
      </button>
    </div>
  );
}
