'use client';

import { useFormContext } from 'react-hook-form';
import type { ResumeFormValues } from '@ai-resume-builder/utils';
import { ResumeTemplateSlug } from '@ai-resume-builder/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTemplates } from '@/hooks/use-templates';

export function TemplatePicker() {
  const { watch, setValue } = useFormContext<ResumeFormValues>();
  const { data: templates } = useTemplates();
  const current = watch('templateSlug');

  return (
    <Select
      value={current}
      onValueChange={(value) =>
        setValue('templateSlug', value as ResumeTemplateSlug, { shouldDirty: true })
      }
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Template" />
      </SelectTrigger>
      <SelectContent>
        {(templates ?? []).map((template) => (
          <SelectItem key={template.slug} value={template.slug}>
            {template.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
