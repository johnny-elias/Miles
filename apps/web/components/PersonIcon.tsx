export default function PersonIcon({ className = "w-4 h-4 mr-2" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" />
    </svg>
  );
} 