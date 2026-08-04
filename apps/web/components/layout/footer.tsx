import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
        <p>&copy; {new Date().getFullYear()} AI Resume Builder. MIT Licensed.</p>
        <div className="flex gap-6">
          <a href="https://github.com/jisinth/AI-Resume-Builder" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <Link href="/templates">Templates</Link>
          <a
            href="https://github.com/jisinth/AI-Resume-Builder/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer"
          >
            Contribute
          </a>
        </div>
      </div>
    </footer>
  );
}
