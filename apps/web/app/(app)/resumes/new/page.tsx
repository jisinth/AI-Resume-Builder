'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ResumeTemplateSlug } from '@ai-resume-builder/types';
import { useCreateResume } from '@/hooks/use-resumes';
import { useAuthStore } from '@/lib/auth-store';
import { ApiError } from '@/lib/api-client';

export default function NewResumePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const createResume = useCreateResume();
  const hasCreated = useRef(false);

  useEffect(() => {
    if (hasCreated.current || !user) return;
    hasCreated.current = true;

    createResume
      .mutateAsync({
        title: 'Untitled resume',
        templateSlug: ResumeTemplateSlug.MODERN,
        personalInfo: { fullName: user.name, email: user.email },
        experience: [],
        education: [],
        projects: [],
        skills: [],
        achievements: [],
        certificates: [],
      })
      .then((resume) => router.replace(`/resumes/${resume.id}/edit`))
      .catch((error) => {
        toast.error(error instanceof ApiError ? error.message : 'Failed to create resume');
        router.replace('/dashboard');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="text-muted-foreground flex h-64 items-center justify-center">
      Creating your resume...
    </div>
  );
}
