import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Cta() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="from-brand-600 to-brand-700 mx-auto max-w-4xl rounded-2xl bg-gradient-to-br px-8 py-16 text-center text-white">
        <h2 className="text-3xl font-bold sm:text-4xl">Ready to build a resume that works?</h2>
        <p className="text-brand-100 mx-auto mt-4 max-w-xl">
          Free, open source, and self-hostable. No credit card required.
        </p>
        <Button size="lg" variant="secondary" className="mt-8" asChild>
          <Link href="/register">Create your resume</Link>
        </Button>
      </div>
    </section>
  );
}
