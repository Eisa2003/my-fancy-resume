import { useEffect, useState } from "react";

export type Degree = {
  id: string;
  school: string;
  degree: string;
  field: string;
  years: string;
  detail?: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  years: string;
  location?: string;
  description: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  tags?: string[];
};

export type Publication = {
  id: string;
  title: string;
  venue: string;
  year: string;
  authors?: string;
  link?: string;
};

export type ExtraItem = {
  id: string;
  title: string;
  detail?: string;
};

export type ExtraSection = {
  id: string;
  title: string;
  items: ExtraItem[];
};

export type ResumeData = {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  photo: string;
  socials: { label: string; url: string }[];
  about: string;
  degrees: Degree[];
  experiences: Experience[];
  projects: Project[];
  publications: Publication[];
  extras: ExtraSection[];
};

export const DEFAULT_DATA: ResumeData = {
  name: "Your Name",
  title: "Researcher · Engineer · Maker",
  tagline: "Building thoughtful things at the intersection of software and science.",
  location: "Somewhere on Earth",
  email: "hello@example.com",
  photo: "/images/profile-placeholder.svg",
  socials: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "LinkedIn", url: "https://linkedin.com/" },
    { label: "Scholar", url: "https://scholar.google.com/" },
  ],
  about:
    "Short introduction goes here. Talk about what you do, what you care about, and the kinds of problems you love solving. Edit this from the /secret page.",
  degrees: [
    {
      id: "d1",
      school: "University of Somewhere",
      degree: "Ph.D.",
      field: "Computer Science",
      years: "2020 — 2024",
      detail: "Dissertation on something fascinating.",
    },
    {
      id: "d2",
      school: "Another University",
      degree: "B.Sc.",
      field: "Mathematics",
      years: "2015 — 2019",
    },
  ],
  experiences: [
    {
      id: "e1",
      role: "Senior Engineer",
      company: "Cool Company",
      years: "2024 — Present",
      location: "Remote",
      description:
        "Leading a small team building tools that make research reproducible and fun.",
    },
    {
      id: "e2",
      role: "Research Intern",
      company: "Famous Lab",
      years: "Summer 2023",
      description: "Worked on distributed systems for large-scale simulation.",
    },
  ],
  projects: [
    {
      id: "p1",
      title: "Project One",
      description: "A short description of a project you are proud of.",
      tags: ["python", "ml"],
      image: "",
      link: "",
    },
    {
      id: "p2",
      title: "Project Two",
      description: "Another meaningful thing you built or contributed to.",
      tags: ["typescript", "web"],
      image: "",
      link: "",
    },
  ],
  publications: [
    {
      id: "pub1",
      title: "A Paper With A Long And Impressive Title",
      venue: "NeurIPS",
      year: "2024",
      authors: "You, A. Collaborator, B. Advisor",
      link: "",
    },
  ],
  extras: [
    {
      id: "x1",
      title: "Talks & Awards",
      items: [
        { id: "i1", title: "Best Paper Award — Conference 2024" },
        { id: "i2", title: "Invited talk at Somewhere Symposium, 2023" },
      ],
    },
  ],
};

const STORAGE_KEY = "resume-data-v1";

export function loadData(): ResumeData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    return { ...DEFAULT_DATA, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveData(data: ResumeData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("resume-data-updated"));
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("resume-data-updated"));
}

export function useResumeData(): [ResumeData, (d: ResumeData) => void] {
  const [data, setData] = useState<ResumeData>(DEFAULT_DATA);
  useEffect(() => {
    setData(loadData());
    const handler = () => setData(loadData());
    window.addEventListener("resume-data-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("resume-data-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  const update = (d: ResumeData) => {
    saveData(d);
    setData(d);
  };
  return [data, update];
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
