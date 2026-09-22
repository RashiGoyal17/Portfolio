export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  image: string;
}

export interface AwardItem {
  id: string;
  title: string;
  description: string;
  year: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  years: string;
  gpa: string;
  detail: string;
  highlights?: string[];
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface SocialLinks {
  linkedin: string;
  github: string;
  email: string;
  phone: string;
  leetcode?: string;
  atcoder?: string;
}

export interface PortfolioContent {
  name: string;
  title: string;
  tagline: string;
  location: string;
  summary: string;
  social: SocialLinks;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  awards: AwardItem[];
  education: EducationItem[];
  skills: SkillGroup[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}
