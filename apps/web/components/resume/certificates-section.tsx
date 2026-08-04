'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ResumeFormValues } from '@ai-resume-builder/utils';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function CertificatesSection() {
  const { control, register } = useFormContext<ResumeFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'certificates' });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <p className="font-medium">Certificate #{index + 1}</p>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register(`certificates.${index}.name`)} />
            </div>
            <div className="space-y-2">
              <Label>Issuer</Label>
              <Input {...register(`certificates.${index}.issuer`)} />
            </div>
            <div className="space-y-2">
              <Label>Issue date</Label>
              <Input type="date" {...register(`certificates.${index}.issueDate`)} />
            </div>
            <div className="space-y-2">
              <Label>Expiry date</Label>
              <Input type="date" {...register(`certificates.${index}.expiryDate`)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Credential URL</Label>
              <Input {...register(`certificates.${index}.credentialUrl`)} />
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
            issuer: '',
            issueDate: '',
            expiryDate: '',
            credentialUrl: '',
            order: fields.length,
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" /> Add certificate
      </Button>
    </div>
  );
}
