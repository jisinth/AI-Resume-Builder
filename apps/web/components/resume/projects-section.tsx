'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ResumeFormValues } from '@ai-resume-builder/utils';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BulletListEditor } from './bullet-list-editor';

export function ProjectsSection() {
  const { control, register, watch, setValue } = useFormContext<ResumeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'projects' });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <p className="font-medium">Project #{index + 1}</p>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Project name</Label>
                <Input {...register(`projects.${index}.name`)} />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  placeholder="https://github.com/you/project"
                  {...register(`projects.${index}.url`)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={2} {...register(`projects.${index}.description`)} />
            </div>
            <div className="space-y-2">
              <Label>Technologies (comma separated)</Label>
              <Input
                defaultValue={watch(`projects.${index}.technologies`)?.join(', ')}
                onChange={(event) =>
                  setValue(
                    `projects.${index}.technologies`,
                    event.target.value
                      .split(',')
                      .map((tech) => tech.trim())
                      .filter(Boolean),
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Highlights</Label>
              <BulletListEditor basePath={`projects.${index}.bullets`} />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            name: '',
            description: '',
            technologies: [],
            url: '',
            bullets: [],
            order: fields.length,
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" /> Add project
      </Button>
    </div>
  );
}
