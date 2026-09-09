import { cn } from "@/lib/utils";

/**
 * The decorative particle shapes that appear behind several sections on the
 * current site. Purely decorative, so aria-hidden and never focusable.
 */
export function ParticleDecor({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <span className="absolute -top-16 -left-16 size-56 rounded-full bg-current/5 blur-2xl" />
      <span className="absolute top-1/3 -right-24 size-72 rounded-full bg-current/5 blur-3xl" />
      <span className="absolute -bottom-20 left-1/3 size-64 rounded-full bg-current/5 blur-3xl" />
    </div>
  );
}
