import type {
  Resume as PrismaResume,
  PersonalInfo as PrismaPersonalInfo,
  Experience as PrismaExperience,
  Education as PrismaEducation,
  Project as PrismaProject,
  Skill as PrismaSkill,
  Achievement as PrismaAchievement,
  Certificate as PrismaCertificate,
} from '@prisma/client';
import type { Resume } from '@ai-resume-builder/types';

type ResumeWithRelations = PrismaResume & {
  personalInfo: PrismaPersonalInfo | null;
  experience: PrismaExperience[];
  education: PrismaEducation[];
  projects: PrismaProject[];
  skills: PrismaSkill[];
  achievements: PrismaAchievement[];
  certificates: PrismaCertificate[];
};

export function toResumeDto(resume: ResumeWithRelations): Resume {
  return {
    id: resume.id,
    userId: resume.userId,
    title: resume.title,
    templateSlug: resume.templateSlug.replace('_', '-') as Resume['templateSlug'],
    personalInfo: resume.personalInfo
      ? {
          fullName: resume.personalInfo.fullName,
          headline: resume.personalInfo.headline,
          email: resume.personalInfo.email,
          phone: resume.personalInfo.phone,
          location: resume.personalInfo.location,
          website: resume.personalInfo.website,
          linkedin: resume.personalInfo.linkedin,
          github: resume.personalInfo.github,
          summary: resume.personalInfo.summary,
        }
      : {
          fullName: '',
          headline: null,
          email: '',
          phone: null,
          location: null,
          website: null,
          linkedin: null,
          github: null,
          summary: null,
        },
    experience: sortByOrder(resume.experience).map((item) => ({
      id: item.id,
      company: item.company,
      title: item.title,
      location: item.location,
      startDate: item.startDate.toISOString(),
      endDate: item.endDate?.toISOString() ?? null,
      isCurrent: item.isCurrent,
      bullets: item.bullets,
      order: item.order,
    })),
    education: sortByOrder(resume.education).map((item) => ({
      id: item.id,
      institution: item.institution,
      degree: item.degree,
      fieldOfStudy: item.fieldOfStudy,
      startDate: item.startDate.toISOString(),
      endDate: item.endDate?.toISOString() ?? null,
      gpa: item.gpa,
      order: item.order,
    })),
    projects: sortByOrder(resume.projects).map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      technologies: item.technologies,
      url: item.url,
      bullets: item.bullets,
      order: item.order,
    })),
    skills: sortByOrder(resume.skills).map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      level: item.level as Resume['skills'][number]['level'],
      order: item.order,
    })),
    achievements: sortByOrder(resume.achievements).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      date: item.date?.toISOString() ?? null,
      order: item.order,
    })),
    certificates: sortByOrder(resume.certificates).map((item) => ({
      id: item.id,
      name: item.name,
      issuer: item.issuer,
      issueDate: item.issueDate?.toISOString() ?? null,
      expiryDate: item.expiryDate?.toISOString() ?? null,
      credentialUrl: item.credentialUrl,
      order: item.order,
    })),
    atsScore: resume.atsScore,
    isPrimary: resume.isPrimary,
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
  };
}

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

/** Flattens a resume into plain text for AI prompts and keyword analysis. */
export function resumeToPlainText(resume: Resume): string {
  const sections: string[] = [];

  sections.push(resume.personalInfo.fullName, resume.personalInfo.email);
  if (resume.personalInfo.headline) sections.push(resume.personalInfo.headline);
  if (resume.personalInfo.summary) sections.push(resume.personalInfo.summary);

  for (const item of resume.experience) {
    sections.push(`${item.title} at ${item.company}`);
    sections.push(...item.bullets);
  }

  for (const item of resume.projects) {
    sections.push(item.name, item.description, item.technologies.join(', '));
    sections.push(...item.bullets);
  }

  for (const item of resume.education) {
    sections.push(
      `${item.degree}${item.fieldOfStudy ? ` in ${item.fieldOfStudy}` : ''} — ${item.institution}`,
    );
  }

  sections.push(resume.skills.map((skill) => skill.name).join(', '));

  for (const item of resume.achievements) {
    sections.push(item.title, item.description ?? '');
  }

  for (const item of resume.certificates) {
    sections.push(`${item.name} — ${item.issuer}`);
  }

  return sections.filter(Boolean).join('\n');
}
