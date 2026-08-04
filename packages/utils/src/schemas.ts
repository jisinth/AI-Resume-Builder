import { z } from 'zod';
import { ProficiencyLevel, ResumeTemplateSlug } from '@ai-resume-builder/types';

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(120),
  headline: z.string().max(160).nullable().optional(),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().max(30).nullable().optional(),
  location: z.string().max(120).nullable().optional(),
  website: z.string().url('Enter a valid URL').nullable().optional().or(z.literal('')),
  linkedin: z.string().url('Enter a valid URL').nullable().optional().or(z.literal('')),
  github: z.string().url('Enter a valid URL').nullable().optional().or(z.literal('')),
  summary: z.string().max(2000).nullable().optional(),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company is required').max(160),
  title: z.string().min(1, 'Title is required').max(160),
  location: z.string().max(120).nullable().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean().default(false),
  bullets: z.array(z.string().max(400)).default([]),
  order: z.number().int().nonnegative().default(0),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, 'Institution is required').max(160),
  degree: z.string().min(1, 'Degree is required').max(160),
  fieldOfStudy: z.string().max(160).nullable().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable().optional(),
  gpa: z.string().max(20).nullable().optional(),
  order: z.number().int().nonnegative().default(0),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Project name is required').max(160),
  description: z.string().max(1000).default(''),
  technologies: z.array(z.string().max(60)).default([]),
  url: z.string().url('Enter a valid URL').nullable().optional().or(z.literal('')),
  bullets: z.array(z.string().max(400)).default([]),
  order: z.number().int().nonnegative().default(0),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Skill name is required').max(80),
  category: z.string().max(60).nullable().optional(),
  level: z.nativeEnum(ProficiencyLevel).nullable().optional(),
  order: z.number().int().nonnegative().default(0),
});

export const achievementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(160),
  description: z.string().max(500).nullable().optional(),
  date: z.string().nullable().optional(),
  order: z.number().int().nonnegative().default(0),
});

export const certificateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Certificate name is required').max(160),
  issuer: z.string().min(1, 'Issuer is required').max(160),
  issueDate: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(),
  credentialUrl: z.string().url('Enter a valid URL').nullable().optional().or(z.literal('')),
  order: z.number().int().nonnegative().default(0),
});

export const resumeSchema = z.object({
  title: z.string().min(1, 'Resume title is required').max(120),
  templateSlug: z.nativeEnum(ResumeTemplateSlug).default(ResumeTemplateSlug.MODERN),
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  skills: z.array(skillSchema).default([]),
  achievements: z.array(achievementSchema).default([]),
  certificates: z.array(certificateSchema).default([]),
});

export type ResumeFormValues = z.infer<typeof resumeSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(120),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const atsScoreRequestSchema = z.object({
  resumeText: z.string().min(50, 'Resume content is too short to analyze'),
  jobDescription: z.string().min(50, 'Job description is too short to analyze'),
});

export const coverLetterRequestSchema = z.object({
  resumeText: z.string().min(50),
  jobDescription: z.string().min(20),
  jobTitle: z.string().min(1),
  companyName: z.string().min(1),
  tone: z.enum(['professional', 'enthusiastic', 'concise']).optional(),
});
