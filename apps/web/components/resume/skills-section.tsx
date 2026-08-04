'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ResumeFormValues } from '@ai-resume-builder/utils';
import { ProficiencyLevel } from '@ai-resume-builder/types';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SkillsSection() {
  const { control, register, watch, setValue } = useFormContext<ResumeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'skills' });

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Input
            placeholder="e.g. TypeScript"
            {...register(`skills.${index}.name`)}
            className="flex-1"
          />
          <Select
            value={watch(`skills.${index}.level`) ?? undefined}
            onValueChange={(value) => setValue(`skills.${index}.level`, value as ProficiencyLevel)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Level (optional)" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ProficiencyLevel).map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
            <Trash2 className="text-destructive h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ name: '', category: null, level: null, order: fields.length })}
      >
        <Plus className="mr-2 h-4 w-4" /> Add skill
      </Button>
    </div>
  );
}
