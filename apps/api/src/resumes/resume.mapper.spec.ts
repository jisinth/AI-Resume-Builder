import type { Resume } from '@ai-resume-builder/types';
import { ResumeTemplateSlug } from '@ai-resume-builder/types';
import { resumeToPlainText } from './resume.mapper';

function buildResume(overrides: Partial<Resume> = {}): Resume {
  return {
    id: 'resume-1',
    userId: 'user-1',
    title: 'Software Engineer Resume',
    templateSlug: ResumeTemplateSlug.MODERN,
    personalInfo: {
      fullName: 'Jane Doe',
      headline: 'Senior Backend Engineer',
      email: 'jane@example.com',
      phone: null,
      location: null,
      website: null,
      linkedin: null,
      github: null,
      summary: 'Backend engineer with 6 years of experience.',
    },
    experience: [],
    education: [],
    projects: [],
    skills: [],
    achievements: [],
    certificates: [],
    atsScore: null,
    isPrimary: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('resumeToPlainText', () => {
  it('includes personal info, experience bullets, and skills', () => {
    const resume = buildResume({
      experience: [
        {
          id: 'exp-1',
          company: 'Acme Corp',
          title: 'Backend Engineer',
          location: null,
          startDate: '2020-01-01',
          endDate: null,
          isCurrent: true,
          bullets: ['Led migration to microservices, cutting latency by 40%'],
          order: 0,
        },
      ],
      skills: [{ id: 'skill-1', name: 'Node.js', category: null, level: null, order: 0 }],
    });

    const text = resumeToPlainText(resume);

    expect(text).toContain('Jane Doe');
    expect(text).toContain('Backend Engineer at Acme Corp');
    expect(text).toContain('Led migration to microservices, cutting latency by 40%');
    expect(text).toContain('Node.js');
  });

  it('does not throw when optional sections are empty', () => {
    const resume = buildResume();
    expect(() => resumeToPlainText(resume)).not.toThrow();
  });
});
