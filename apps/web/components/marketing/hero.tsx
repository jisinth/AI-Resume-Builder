'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/shared/badge';

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <Badge tone="brand">
            <Sparkles className="mr-1 inline h-3 w-3" /> Free & open source
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-4xl font-bold tracking-tight sm:text-6xl"
        >
          Build resumes that get you{' '}
          <span className="from-brand-600 to-brand-400 bg-gradient-to-r bg-clip-text text-transparent">
            past the bots
          </span>
          .
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg"
        >
          AI-powered resume builder with real ATS scoring, keyword matching, and rewrite
          suggestions. Self-hostable, open source, and built for engineers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" asChild>
            <Link href="/register">
              Start building free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="https://github.com/jisinth/AI-Resume-Builder" target="_blank" rel="noreferrer">
              Star on GitHub
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
