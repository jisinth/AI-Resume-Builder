import type { Resume } from '@ai-resume-builder/types';
import type { ResumeFormValues } from '@ai-resume-builder/utils';

export function resumeToFormValues(resume: Resume): ResumeFormValues {
  return {
    title: resume.title,
    templateSlug: resume.templateSlug,
    personalInfo: resume.personalInfo,
    experience: resume.experience,
    education: resume.education,
    projects: resume.projects,
    skills: resume.skills,
    achievements: resume.achievements,
    certificates: resume.certificates,
  };
}
