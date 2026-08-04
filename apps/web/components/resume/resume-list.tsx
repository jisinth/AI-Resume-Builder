'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Resume } from '@ai-resume-builder/types';
import { Copy, Download, FileText, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/shared/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteResume, useDuplicateResume } from '@/hooks/use-resumes';
import { apiFetch } from '@/lib/api-client';

export function ResumeList({ resumes }: { resumes: Resume[] }) {
  const deleteResume = useDeleteResume();
  const duplicateResume = useDuplicateResume();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  async function handleExport(resume: Resume) {
    try {
      const blob = await apiFetch<Blob>(`/resumes/${resume.id}/export/pdf`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resume.title}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to export PDF');
    }
  }

  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
        <FileText className="text-muted-foreground mb-3 h-10 w-10" />
        <p className="font-medium">No resumes yet</p>
        <p className="text-muted-foreground mb-4 text-sm">
          Create your first resume to get started.
        </p>
        <Button asChild>
          <Link href="/resumes/new">Create resume</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{resume.title}</p>
                {resume.atsScore != null ? (
                  <Badge
                    tone={
                      resume.atsScore >= 80
                        ? 'success'
                        : resume.atsScore >= 60
                          ? 'warning'
                          : 'danger'
                    }
                  >
                    ATS {resume.atsScore}%
                  </Badge>
                ) : null}
              </div>
              <p className="text-muted-foreground text-sm">
                Updated {new Date(resume.updatedAt).toLocaleDateString()} · {resume.templateSlug}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" asChild aria-label="Edit resume">
                <Link href={`/resumes/${resume.id}/edit`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Duplicate resume"
                onClick={() => duplicateResume.mutate(resume.id)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Export PDF"
                onClick={() => handleExport(resume)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete resume"
                onClick={() => setPendingDeleteId(resume.id)}
              >
                <Trash2 className="text-destructive h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete resume</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this resume.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (pendingDeleteId) deleteResume.mutate(pendingDeleteId);
                setPendingDeleteId(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
