// The fountain-pen nib from the Lady Prowess logo, used as the editing cursor.
export default function PenNib({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 18 26" className={className} aria-hidden="true">
    <path d="M9 25 C 3 17, 1 11, 4 4 L 9 1 L 14 4 C 17 11, 15 17, 9 25 Z" fill="rgb(var(--primary))" />
    <circle cx="9" cy="9" r="1.8" fill="rgb(var(--surface))" />
    <path d="M9 10.8 L 9 22" stroke="rgb(var(--surface))" strokeWidth="1" />
  </svg>
}
