'use client';

import { useFormContext } from 'react-hook-form';
import type { ResumeFormValues } from '@ai-resume-builder/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function PersonalInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ResumeFormValues>();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" error={errors.personalInfo?.fullName?.message}>
        <Input {...register('personalInfo.fullName')} />
      </Field>
      <Field label="Headline" error={errors.personalInfo?.headline?.message}>
        <Input placeholder="Senior Backend Engineer" {...register('personalInfo.headline')} />
      </Field>
      <Field label="Email" error={errors.personalInfo?.email?.message}>
        <Input type="email" {...register('personalInfo.email')} />
      </Field>
      <Field label="Phone" error={errors.personalInfo?.phone?.message}>
        <Input {...register('personalInfo.phone')} />
      </Field>
      <Field label="Location" error={errors.personalInfo?.location?.message}>
        <Input placeholder="San Francisco, CA" {...register('personalInfo.location')} />
      </Field>
      <Field label="Website" error={errors.personalInfo?.website?.message}>
        <Input placeholder="https://example.com" {...register('personalInfo.website')} />
      </Field>
      <Field label="LinkedIn" error={errors.personalInfo?.linkedin?.message}>
        <Input
          placeholder="https://linkedin.com/in/username"
          {...register('personalInfo.linkedin')}
        />
      </Field>
      <Field label="GitHub" error={errors.personalInfo?.github?.message}>
        <Input placeholder="https://github.com/username" {...register('personalInfo.github')} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Professional summary" error={errors.personalInfo?.summary?.message}>
          <Textarea
            rows={4}
            placeholder="A brief summary of your experience and goals..."
            {...register('personalInfo.summary')}
          />
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  );
}
