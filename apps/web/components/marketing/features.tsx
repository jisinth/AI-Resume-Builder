'use client';

import { motion } from 'framer-motion';
import { FileText, Gauge, Layers, Mail, Sparkles, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FEATURES = [
  {
    icon: Wand2,
    title: 'AI resume writing',
    description: 'Rewrite bullets with stronger action verbs, ATS keywords, and quantified impact.',
  },
  {
    icon: Gauge,
    title: 'ATS score & keyword match',
    description:
      'Paste a job description and get an instant score breakdown with missing keywords.',
  },
  {
    icon: Sparkles,
    title: 'AI suggestions',
    description:
      'Catch weak verbs, missing metrics, and overly long bullets before a recruiter does.',
  },
  {
    icon: Layers,
    title: 'Multiple resumes',
    description: 'Save, duplicate, and manage as many resumes as you need for different roles.',
  },
  {
    icon: FileText,
    title: 'ATS-friendly templates',
    description: 'Modern, Minimal, Corporate, and ATS-Friendly layouts that parse cleanly.',
  },
  {
    icon: Mail,
    title: 'Bring your own AI key',
    description:
      'Use the built-in engine for free, or plug in OpenAI, Anthropic, Gemini, or DeepSeek.',
  },
];

export function Features() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to land the role
          </h2>
          <p className="text-muted-foreground mt-4">
            Built for engineers, PMs, and job seekers who want a resume that actually gets read.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
