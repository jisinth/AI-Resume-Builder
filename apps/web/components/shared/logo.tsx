export interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 28, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role="img"
      aria-label="AI Resume Builder"
    >
      <rect width="32" height="32" rx="8" fill="#4f46e5" />
      <path
        d="M9 22V10h6.5a3.5 3.5 0 0 1 0 7H11v5H9Zm2-7h4.5a1.5 1.5 0 0 0 0-3H11v3Z"
        fill="white"
      />
      <path
        d="M20 10h3l3 12h-2.1l-.6-2.6h-3.6L19.1 22H17l3-12Zm.2 7.6h2.6L21.5 12l-1.3 5.6Z"
        fill="white"
      />
    </svg>
  );
}
