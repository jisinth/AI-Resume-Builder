import { describe, expect, it } from 'vitest';
import { ResumeTemplateSlug } from '@ai-resume-builder/types';
import type { Resume } from '@ai-resume-builder/types';
import { resumeToFormValues } from './resume-form';

const baseResume: Resume = {
  id: 'resume-1',
  userId: 'user-1',
  title: 'My Resume',
  templateSlug: ResumeTemplateSlug.MINIMAL,
  personalInfo: {
    fullName: 'Jane Doe',
    headline: null,
    email: 'jane@example.com',
    phone: null,
    location: null,
    website: null,
    linkedin: null,
    github: null,
    summary: null,
  },
  experience: [],
  education: [],
  projects: [],
  skills: [],
  achievements: [],
  certificates: [],
  atsScore: 72,
  isPrimary: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z',
};

describe('resumeToFormValues', () => {
  it('maps a Resume to form-compatible values', () => {
    const values = resumeToFormValues(baseResume);
    expect(values.title).toBe('My Resume');
    expect(values.templateSlug).toBe(ResumeTemplateSlug.MINIMAL);
    expect(values.personalInfo.fullName).toBe('Jane Doe');
  });

  it('does not leak read-only fields like id or atsScore into form values', () => {
    const values = resumeToFormValues(baseResume) as Record<string, unknown>;
    expect(values.id).toBeUndefined();
    expect(values.atsScore).toBeUndefined();
  });
});
