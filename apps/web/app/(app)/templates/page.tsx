'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ResumeTemplateSlug } from '@ai-resume-builder/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTemplates } from '@/hooks/use-templates';
import { useCreateResume } from '@/hooks/use-resumes';
import { useAuthStore } from '@/lib/auth-store';
import { ApiError } from '@/lib/api-client';

export default function TemplatesPage() {
  const router = useRouter();
  const { data: templates, isLoading } = useTemplates();
  const createResume = useCreateResume();
  const user = useAuthStore((state) => state.user);

  async function handleUseTemplate(slug: string) {
    if (!user) return;
    try {
      const resume = await createResume.mutateAsync({
        title: 'Untitled resume',
        templateSlug: slug as ResumeTemplateSlug,
        personalInfo: { fullName: user.name, email: user.email },
        experience: [],
        education: [],
        projects: [],
        skills: [],
        achievements: [],
        certificates: [],
      });
      router.push(`/resumes/${resume.id}/edit`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to create resume');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
        <p className="text-muted-foreground">
          Pick a layout. You can change it anytime from the builder.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))
          : (templates ?? []).map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted text-muted-foreground flex h-32 items-center justify-center rounded-md text-xs">
                    Preview
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleUseTemplate(template.slug)}>
                    Use this template
                  </Button>
                </CardFooter>
              </Card>
            ))}
      </div>
    </div>
  );
}
