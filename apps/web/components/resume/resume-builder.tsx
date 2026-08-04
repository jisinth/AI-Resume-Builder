'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeSchema, type ResumeFormValues } from '@ai-resume-builder/utils';
import type { Resume } from '@ai-resume-builder/types';
import { Download, Loader2, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeleteResume, useUpdateResume } from '@/hooks/use-resumes';
import { resumeToFormValues } from '@/lib/resume-form';
import { apiFetch } from '@/lib/api-client';
import { TemplatePicker } from './template-picker';
import { PersonalInfoSection } from './personal-info-section';
import { ExperienceSection } from './experience-section';
import { EducationSection } from './education-section';
import { ProjectsSection } from './projects-section';
import { SkillsSection } from './skills-section';
import { AchievementsSection } from './achievements-section';
import { CertificatesSection } from './certificates-section';
import { AiSuggestionsPanel } from './ai-suggestions-panel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AUTOSAVE_DELAY_MS = 1500;

export function ResumeBuilder({ resume }: { resume: Resume }) {
  const router = useRouter();
  const updateResume = useUpdateResume(resume.id);
  const deleteResume = useDeleteResume();
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(false);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resumeToFormValues(resume),
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (!isMountedRef.current) {
        isMountedRef.current = true;
        return;
      }
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateResume.mutate(values as ResumeFormValues, {
          onSuccess: () => setLastSavedAt(new Date()),
        });
      }, AUTOSAVE_DELAY_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch]);

  async function handleManualSave() {
    const values = form.getValues();
    try {
      await updateResume.mutateAsync(values);
      setLastSavedAt(new Date());
      toast.success('Resume saved');
    } catch {
      toast.error('Failed to save resume');
    }
  }

  async function handleExport() {
    try {
      const blob = await apiFetch<Blob>(`/resumes/${resume.id}/export/pdf`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${form.getValues('title') || 'resume'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to export PDF');
    }
  }

  async function handleDelete() {
    await deleteResume.mutateAsync(resume.id);
    router.push('/dashboard');
  }

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Input
            className="max-w-sm text-lg font-semibold"
            {...form.register('title')}
            placeholder="Resume title"
          />
          <div className="flex items-center gap-2">
            <TemplatePicker />
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            <Button onClick={handleManualSave} disabled={updateResume.isPending}>
              {updateResume.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </div>
        </div>

        {lastSavedAt ? (
          <p className="text-muted-foreground text-xs">
            Autosaved at {lastSavedAt.toLocaleTimeString()}
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Tabs defaultValue="personal">
            <TabsList>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <PersonalInfoSection />
            </TabsContent>
            <TabsContent value="experience">
              <ExperienceSection />
            </TabsContent>
            <TabsContent value="education">
              <EducationSection />
            </TabsContent>
            <TabsContent value="projects">
              <ProjectsSection />
            </TabsContent>
            <TabsContent value="skills">
              <SkillsSection />
            </TabsContent>
            <TabsContent value="achievements">
              <AchievementsSection />
            </TabsContent>
            <TabsContent value="certificates">
              <CertificatesSection />
            </TabsContent>
          </Tabs>

          <AiSuggestionsPanel resumeId={resume.id} />
        </div>
      </div>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this resume?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
