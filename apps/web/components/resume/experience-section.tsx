'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ResumeFormValues } from '@ai-resume-builder/utils';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BulletListEditor } from './bullet-list-editor';

export function ExperienceSection() {
  const { control, register, watch } = useFormContext<ResumeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'experience' });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <p className="font-medium">Experience #{index + 1}</p>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Job title</Label>
                <Input {...register(`experience.${index}.title`)} />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input {...register(`experience.${index}.company`)} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input {...register(`experience.${index}.location`)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Start date</Label>
                  <Input type="date" {...register(`experience.${index}.startDate`)} />
                </div>
                <div className="space-y-2">
                  <Label>End date</Label>
                  <Input
                    type="date"
                    disabled={watch(`experience.${index}.isCurrent`)}
                    {...register(`experience.${index}.endDate`)}
                  />
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register(`experience.${index}.isCurrent`)} />I currently
              work here
            </label>
            <div className="space-y-2">
              <Label>What did you do?</Label>
              <BulletListEditor
                basePath={`experience.${index}.bullets`}
                jobTitle={watch(`experience.${index}.title`)}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            company: '',
            title: '',
            location: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            bullets: [],
            order: fields.length,
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" /> Add experience
      </Button>
    </div>
  );
}
