'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ResumeFormValues } from '@ai-resume-builder/utils';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function AchievementsSection() {
  const { control, register } = useFormContext<ResumeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'achievements' });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <p className="font-medium">Achievement #{index + 1}</p>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Title</Label>
              <Input {...register(`achievements.${index}.title`)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Input {...register(`achievements.${index}.description`)} />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...register(`achievements.${index}.date`)} />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ title: '', description: '', date: '', order: fields.length })}
      >
        <Plus className="mr-2 h-4 w-4" /> Add achievement
      </Button>
    </div>
  );
}
