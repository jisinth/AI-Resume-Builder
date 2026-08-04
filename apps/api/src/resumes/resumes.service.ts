import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { DashboardStats } from '@ai-resume-builder/types';
import { PrismaService } from '../prisma/prisma.service';
import { toResumeDto } from './resume.mapper';
import type { CreateResumeDto } from './dto/create-resume.dto';
import type { UpdateResumeDto } from './dto/update-resume.dto';

const RESUME_INCLUDE = {
  personalInfo: true,
  experience: true,
  education: true,
  projects: true,
  skills: true,
  achievements: true,
  certificates: true,
} as const;

@Injectable()
export class ResumesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const resumes = await this.prisma.resume.findMany({
      where: { userId },
      include: RESUME_INCLUDE,
      orderBy: { updatedAt: 'desc' },
    });
    return resumes.map(toResumeDto);
  }

  async get(userId: string, resumeId: string) {
    const resume = await this.findOwnedOrThrow(userId, resumeId);
    return toResumeDto(resume);
  }

  async create(userId: string, dto: CreateResumeDto) {
    const templateSlug = toPrismaTemplateSlug(dto.templateSlug ?? 'modern');

    const resume = await this.prisma.resume.create({
      data: {
        userId,
        title: dto.title,
        templateSlug,
        personalInfo: { create: toPersonalInfoCreate(dto.personalInfo) },
        experience: { create: (dto.experience ?? []).map(toExperienceCreate) },
        education: { create: (dto.education ?? []).map(toEducationCreate) },
        projects: { create: (dto.projects ?? []).map(toProjectCreate) },
        skills: { create: (dto.skills ?? []).map(toSkillCreate) },
        achievements: { create: (dto.achievements ?? []).map(toAchievementCreate) },
        certificates: { create: (dto.certificates ?? []).map(toCertificateCreate) },
      },
      include: RESUME_INCLUDE,
    });

    return toResumeDto(resume);
  }

  async update(userId: string, resumeId: string, dto: UpdateResumeDto) {
    await this.findOwnedOrThrow(userId, resumeId);

    const resume = await this.prisma.$transaction(async (tx) => {
      if (dto.experience) {
        await tx.experience.deleteMany({ where: { resumeId } });
      }
      if (dto.education) {
        await tx.education.deleteMany({ where: { resumeId } });
      }
      if (dto.projects) {
        await tx.project.deleteMany({ where: { resumeId } });
      }
      if (dto.skills) {
        await tx.skill.deleteMany({ where: { resumeId } });
      }
      if (dto.achievements) {
        await tx.achievement.deleteMany({ where: { resumeId } });
      }
      if (dto.certificates) {
        await tx.certificate.deleteMany({ where: { resumeId } });
      }

      return tx.resume.update({
        where: { id: resumeId },
        data: {
          ...(dto.title ? { title: dto.title } : {}),
          ...(dto.templateSlug ? { templateSlug: toPrismaTemplateSlug(dto.templateSlug) } : {}),
          ...(dto.personalInfo
            ? {
                personalInfo: {
                  upsert: {
                    create: toPersonalInfoCreate(dto.personalInfo),
                    update: toPersonalInfoCreate(dto.personalInfo),
                  },
                },
              }
            : {}),
          ...(dto.experience
            ? { experience: { create: dto.experience.map(toExperienceCreate) } }
            : {}),
          ...(dto.education ? { education: { create: dto.education.map(toEducationCreate) } } : {}),
          ...(dto.projects ? { projects: { create: dto.projects.map(toProjectCreate) } } : {}),
          ...(dto.skills ? { skills: { create: dto.skills.map(toSkillCreate) } } : {}),
          ...(dto.achievements
            ? { achievements: { create: dto.achievements.map(toAchievementCreate) } }
            : {}),
          ...(dto.certificates
            ? { certificates: { create: dto.certificates.map(toCertificateCreate) } }
            : {}),
        },
        include: RESUME_INCLUDE,
      });
    });

    return toResumeDto(resume);
  }

  async remove(userId: string, resumeId: string): Promise<void> {
    await this.findOwnedOrThrow(userId, resumeId);
    await this.prisma.resume.delete({ where: { id: resumeId } });
  }

  async duplicate(userId: string, resumeId: string) {
    const original = await this.findOwnedOrThrow(userId, resumeId);

    const resume = await this.prisma.resume.create({
      data: {
        userId,
        title: `${original.title} (Copy)`,
        templateSlug: original.templateSlug,
        personalInfo: original.personalInfo
          ? { create: stripRelationKeys(original.personalInfo) }
          : undefined,
        experience: { create: original.experience.map(stripRelationKeys) },
        education: { create: original.education.map(stripRelationKeys) },
        projects: { create: original.projects.map(stripRelationKeys) },
        skills: { create: original.skills.map(stripRelationKeys) },
        achievements: { create: original.achievements.map(stripRelationKeys) },
        certificates: { create: original.certificates.map(stripRelationKeys) },
      },
      include: RESUME_INCLUDE,
    });

    return toResumeDto(resume);
  }

  async updateAtsScore(resumeId: string, score: number): Promise<void> {
    await this.prisma.resume.update({ where: { id: resumeId }, data: { atsScore: score } });
  }

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const [resumes, applicationStats] = await Promise.all([
      this.prisma.resume.findMany({
        where: { userId },
        include: RESUME_INCLUDE,
      }),
      this.prisma.application.groupBy({
        by: ['status'],
        where: { userId },
        _count: true,
      }),
    ]);

    const scoredResumes = resumes.filter((resume) => resume.atsScore != null);
    const averageAtsScore =
      scoredResumes.length === 0
        ? null
        : Math.round(
            scoredResumes.reduce((sum, resume) => sum + (resume.atsScore ?? 0), 0) /
              scoredResumes.length,
          );

    const totalApplications = applicationStats.reduce((sum, group) => sum + group._count, 0);
    const interviewCount =
      applicationStats.find((group) => group.status === 'INTERVIEW')?._count ?? 0;

    const mostRecent = resumes[0];
    const profileCompletion = mostRecent ? computeProfileCompletion(mostRecent) : 0;

    return {
      totalResumes: resumes.length,
      totalApplications,
      averageAtsScore,
      interviewCount,
      profileCompletion,
    };
  }

  private async findOwnedOrThrow(userId: string, resumeId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
      include: RESUME_INCLUDE,
    });
    if (!resume) throw new NotFoundException('Resume not found');
    if (resume.userId !== userId) throw new ForbiddenException('You do not own this resume');
    return resume;
  }
}

function toPrismaTemplateSlug(slug: string) {
  return slug.replace('-', '_') as 'modern' | 'minimal' | 'corporate' | 'ats_friendly';
}

function toPersonalInfoCreate(info: CreateResumeDto['personalInfo']) {
  return {
    fullName: info.fullName,
    headline: info.headline ?? null,
    email: info.email,
    phone: info.phone ?? null,
    location: info.location ?? null,
    website: info.website || null,
    linkedin: info.linkedin || null,
    github: info.github || null,
    summary: info.summary ?? null,
  };
}

function toExperienceCreate(item: NonNullable<CreateResumeDto['experience']>[number]) {
  return {
    company: item.company,
    title: item.title,
    location: item.location ?? null,
    startDate: new Date(item.startDate),
    endDate: item.endDate ? new Date(item.endDate) : null,
    isCurrent: item.isCurrent ?? false,
    bullets: item.bullets ?? [],
    order: item.order ?? 0,
  };
}

function toEducationCreate(item: NonNullable<CreateResumeDto['education']>[number]) {
  return {
    institution: item.institution,
    degree: item.degree,
    fieldOfStudy: item.fieldOfStudy ?? null,
    startDate: new Date(item.startDate),
    endDate: item.endDate ? new Date(item.endDate) : null,
    gpa: item.gpa ?? null,
    order: item.order ?? 0,
  };
}

function toProjectCreate(item: NonNullable<CreateResumeDto['projects']>[number]) {
  return {
    name: item.name,
    description: item.description ?? '',
    technologies: item.technologies ?? [],
    url: item.url || null,
    bullets: item.bullets ?? [],
    order: item.order ?? 0,
  };
}

function toSkillCreate(item: NonNullable<CreateResumeDto['skills']>[number]) {
  return {
    name: item.name,
    category: item.category ?? null,
    level: item.level ?? null,
    order: item.order ?? 0,
  };
}

function toAchievementCreate(item: NonNullable<CreateResumeDto['achievements']>[number]) {
  return {
    title: item.title,
    description: item.description ?? null,
    date: item.date ? new Date(item.date) : null,
    order: item.order ?? 0,
  };
}

function toCertificateCreate(item: NonNullable<CreateResumeDto['certificates']>[number]) {
  return {
    name: item.name,
    issuer: item.issuer,
    issueDate: item.issueDate ? new Date(item.issueDate) : null,
    expiryDate: item.expiryDate ? new Date(item.expiryDate) : null,
    credentialUrl: item.credentialUrl || null,
    order: item.order ?? 0,
  };
}

function stripRelationKeys<T extends { id: string; resumeId?: string }>(
  item: T,
): Omit<T, 'id' | 'resumeId'> {
  const { id: _id, resumeId: _resumeId, ...rest } = item;
  return rest;
}

function computeProfileCompletion(resume: {
  personalInfo: { fullName: string; summary: string | null } | null;
  experience: unknown[];
  education: unknown[];
  skills: unknown[];
}): number {
  const checks = [
    Boolean(resume.personalInfo?.fullName),
    Boolean(resume.personalInfo?.summary),
    resume.experience.length > 0,
    resume.education.length > 0,
    resume.skills.length > 0,
  ];
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}
