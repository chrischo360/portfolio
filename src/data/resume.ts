import generatedResumeData from "@/data/resume.generated.json";

export type RelatedWork = {
  slug: string;
  label?: string;
};

export type ResumeBullet = {
  text: string;
  relatedWork?: RelatedWork;
};

export type ResumeEntry = {
  organization: string;
  location?: string;
  role: string;
  roleHref?: string;
  period?: string;
  bullets: ResumeBullet[];
};

type ResumeData = {
  name: string;
  contact: Array<{
    label: string;
    href?: string;
  }>;
  experience: ResumeEntry[];
  projects: ResumeEntry[];
  education: {
    school: string;
    degree: string;
    honors: string;
  };
  skills: Array<{
    label: string;
    value: string;
  }>;
  howIWork?: RelatedWork;
};

export const resumeData: ResumeData = generatedResumeData;
