'use client';

import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useResume } from '@/hooks/use-resumes';
import { ResumeBuilder } from '@/components/resume/resume-builder';

export default function EditResumePage() {
  const { id } = useParams<{ id: string }>();
  const { data: resume, isLoading, isError } = useResume(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !resume) {
    return <p className="text-muted-foreground">Resume not found.</p>;
  }

  return <ResumeBuilder resume={resume} />;
}
