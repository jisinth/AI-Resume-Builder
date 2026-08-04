'use client';

import { useFormContext } from 'react-hook-form';
import type { ResumeFormValues } from '@ai-resume-builder/utils';
import { AiTaskType } from '@ai-resume-builder/types';
import { Plus, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRewrite } from '@/hooks/use-ai';

interface BulletListEditorProps {
  basePath: `experience.${number}.bullets` | `projects.${number}.bullets`;
  jobTitle?: string;
}

export function BulletListEditor({ basePath, jobTitle }: BulletListEditorProps) {
  const { watch, setValue } = useFormContext<ResumeFormValues>();
  const bullets: string[] = watch(basePath) ?? [];
  const rewrite = useRewrite();

  function updateBullet(index: number, value: string) {
    const next = [...bullets];
    next[index] = value;
    setValue(basePath, next, { shouldDirty: true });
  }

  function addBullet() {
    setValue(basePath, [...bullets, ''], { shouldDirty: true });
  }

  function removeBullet(index: number) {
    setValue(
      basePath,
      bullets.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
  }

  async function handleRewrite(index: number) {
    const text = bullets[index];
    if (!text?.trim()) {
      toast.error('Write something first, then ask AI to improve it.');
      return;
    }
    try {
      const result = await rewrite.mutateAsync({
        task: AiTaskType.REWRITE_BULLET,
        text,
        context: { jobTitle },
      });
      updateBullet(index, result.rewritten);
      toast.success('Bullet rewritten', {
        description: result.changes[0],
      });
    } catch {
      toast.error('AI rewrite failed. Try again.');
    }
  }

  return (
    <div className="space-y-2">
      {bullets.map((bullet, index) => (
        <div key={index} className="flex items-start gap-2">
          <Textarea
            rows={2}
            value={bullet}
            onChange={(event) => updateBullet(index, event.target.value)}
            placeholder="Led the migration of..., cutting latency by 40%"
            className="flex-1"
          />
          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              title="Rewrite with AI"
              onClick={() => handleRewrite(index)}
              disabled={rewrite.isPending}
            >
              <Sparkles className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Remove bullet"
              onClick={() => removeBullet(index)}
            >
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addBullet}>
        <Plus className="mr-1 h-4 w-4" /> Add bullet
      </Button>
    </div>
  );
}
