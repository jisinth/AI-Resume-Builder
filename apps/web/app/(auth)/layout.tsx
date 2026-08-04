import Link from 'next/link';
import { Logo } from '@/components/shared/logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/30 flex min-h-screen flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 flex items-center gap-2 text-lg font-semibold">
        <Logo />
        AI Resume Builder
      </Link>
      {children}
    </div>
  );
}
