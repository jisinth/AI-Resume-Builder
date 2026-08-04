'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ResumeFormValues } from '@ai-resume-builder/utils';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function EducationSection() {
  const { control, register } = useFormContext<ResumeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'education' });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <p className="font-medium">Education #{index + 1}</p>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Institution</Label>
              <Input {...register(`education.${index}.institution`)} />
            </div>
            <div className="space-y-2">
              <Label>Degree</Label>
              <Input {...register(`education.${index}.degree`)} />
            </div>
            <div className="space-y-2">
              <Label>Field of study</Label>
              <Input {...register(`education.${index}.fieldOfStudy`)} />
            </div>
            <div className="space-y-2">
              <Label>GPA</Label>
              <Input {...register(`education.${index}.gpa`)} />
            </div>
            <div className="space-y-2">
              <Label>Start date</Label>
              <Input type="date" {...register(`education.${index}.startDate`)} />
            </div>
            <div className="space-y-2">
              <Label>End date</Label>
              <Input type="date" {...register(`education.${index}.endDate`)} />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            institution: '',
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            gpa: '',
            order: fields.length,
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" /> Add education
      </Button>
    </div>
  );
}
