import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes so later ones win even when they conflict
 * (`px-2` + `px-4` → `px-4`). Every component uses this for its className prop.
 *
 * shadcn/ui components import `cn` from "@/lib/utils", which resolves to this
 * folder's index — keep the export name.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
