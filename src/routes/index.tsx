import { createFileRoute, Link } from "@tanstack/react-router";
import { useResumeData } from "@/lib/resume-data";
import { Mail, MapPin, ExternalLink, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [data] = useResumeData();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
        {/* HERO */}
        <section className="grid grid-cols-1 gap-10 md:grid-cols-[auto_1fr] md:items-center">
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-accent/40 to-transparent blur-xl" />
            <img
              src={data.photo || "/images/profile-placeholder.svg"}
              alt={data.name}
              className="relative h-40 w-40 rounded-full border-4 border-background object-cover shadow-xl md:h-48 md:w-48"
            />
          </div>
          <div>
            <p className="section-title mb-3">{data.title}</p>
            <h1 className="text-5xl font-semibold leading-[1.05] md:text-7xl">
              {data.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground md:text-xl">
              {data.tagline}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {data.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-accent" /> {data.location}
                </span>
              )}
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-foreground"
                >
                  <Mail className="h-4 w-4 text-accent" /> {data.email}
                </a>
              )}
              {data.socials.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  {s.label} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        {data.about && (
          <Section title="About">
            <p className="max-w-3xl text-lg leading-relaxed text-foreground/80">
              {data.about}
            </p>
          </Section>
        )}

        {/* EXPERIENCE */}
        {data.experiences.length > 0 && (
          <Section title="Experience">
            <ul className="space-y-8">
              {data.experiences.map((e) => (
                <li key={e.id} className="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <div className="font-display text-sm text-muted-foreground">{e.years}</div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {e.role} <span className="text-accent">· {e.company}</span>
                    </h3>
                    {e.location && (
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {e.location}
                      </p>
                    )}
                    <p className="mt-2 text-foreground/80">{e.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* EDUCATION */}
        {data.degrees.length > 0 && (
          <Section title="Education">
            <ul className="space-y-8">
              {data.degrees.map((d) => (
                <li key={d.id} className="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <div className="font-display text-sm text-muted-foreground">{d.years}</div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {d.degree}, {d.field}
                    </h3>
                    <p className="text-accent">{d.school}</p>
                    {d.detail && (
                      <p className="mt-2 text-foreground/80">{d.detail}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* PROJECTS */}
        {data.projects.length > 0 && (
          <Section title="Projects">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {data.projects.map((p) => (
                <article
                  key={p.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {p.image && (
                    <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-muted">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-foreground/80">{p.description}</p>
                  {p.tags && p.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-sm text-accent hover:underline"
                    >
                      Visit <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </article>
              ))}
            </div>
          </Section>
        )}

        {/* PUBLICATIONS */}
        {data.publications.length > 0 && (
          <Section title="Publications">
            <ul className="space-y-6">
              {data.publications.map((p) => (
                <li key={p.id} className="border-l-2 border-accent pl-5">
                  <h3 className="font-display text-lg font-semibold leading-snug">
                    {p.link ? (
                      <a href={p.link} target="_blank" rel="noreferrer" className="hover:text-accent">
                        {p.title}
                      </a>
                    ) : (
                      p.title
                    )}
                  </h3>
                  {p.authors && (
                    <p className="text-sm text-foreground/70">{p.authors}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    <em>{p.venue}</em> · {p.year}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* EXTRAS */}
        {data.extras.map((ex) => (
          <Section key={ex.id} title={ex.title}>
            <ul className="space-y-3">
              {ex.items.map((it) => (
                <li key={it.id} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <div>
                    <p className="font-medium">{it.title}</p>
                    {it.detail && (
                      <p className="text-sm text-muted-foreground">{it.detail}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        ))}

        <footer className="mt-24 border-t border-border pt-8 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <p>© {new Date().getFullYear()} {data.name}</p>
            <Link to="/secret" className="opacity-40 hover:opacity-100 hover:text-accent">
              ·
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-20">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="section-title">{title}</h2>
        <div className="h-px flex-1 bg-border" />
      </div>
      {children}
    </section>
  );
}
