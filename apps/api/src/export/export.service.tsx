import { Injectable } from '@nestjs/common';
import { renderToBuffer } from '@react-pdf/renderer';
import { ResumesService } from '../resumes/resumes.service';
import { ResumeDocument } from './templates/resume-document';

@Injectable()
export class ExportService {
  constructor(private readonly resumesService: ResumesService) {}

  async exportPdf(userId: string, resumeId: string): Promise<{ buffer: Buffer; filename: string }> {
    const resume = await this.resumesService.get(userId, resumeId);
    const buffer = await renderToBuffer(<ResumeDocument resume={resume} />);
    const filename = `${slugifyFilename(resume.title || resume.personalInfo.fullName)}.pdf`;
    return { buffer, filename };
  }
}

function slugifyFilename(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'resume'
  );
}
