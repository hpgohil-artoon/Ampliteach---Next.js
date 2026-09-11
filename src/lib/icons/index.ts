import type { ComponentType, SVGProps } from "react";
import {
  Award,
  BookOpen,
  CalendarRange,
  CreditCard,
  GraduationCap,
  Mail,
  MessageSquare,
  Rocket,
  Settings2,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { IconName } from "@/types";
import {
  BezierCurveIcon,
  CalendarAltIcon,
  CertificateIcon,
  ChartBarIcon,
  ChartLineIcon,
  CommentsIcon,
  EditIcon,
  EnvelopeIcon,
  FileInvoiceIcon,
  FilePowerpointIcon,
  HandshakeIcon,
  SchoolIcon,
} from "./glyphs";

/** Anything renderable as an icon: a lucide component or one of our own SVGs. */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Icon name → component.
 *
 * Content — committed or from the CMS — names an icon; only this file turns
 * that name into something React can render. Adding an icon means adding it to
 * `IconName` in src/types/common.ts and here, and the compiler enforces that
 * the two stay in step.
 *
 * The first twelve are the live home page's, as real Font Awesome outlines —
 * see ./glyphs.tsx for why they are not lucide lookalikes. The rest are lucide
 * placeholders on pages not yet rebuilt against the live site, and will be
 * replaced by their live counterparts as each page is done.
 */
export const ICONS: Record<IconName, IconComponent> = {
  "bezier-curve": BezierCurveIcon,
  "calendar-alt": CalendarAltIcon,
  certificate: CertificateIcon,
  "chart-bar": ChartBarIcon,
  "chart-line": ChartLineIcon,
  comments: CommentsIcon,
  edit: EditIcon,
  envelope: EnvelopeIcon,
  "file-invoice": FileInvoiceIcon,
  "file-powerpoint": FilePowerpointIcon,
  handshake: HandshakeIcon,
  school: SchoolIcon,

  award: Award,
  "book-open": BookOpen,
  "calendar-range": CalendarRange,
  "credit-card": CreditCard,
  "graduation-cap": GraduationCap,
  mail: Mail,
  "message-square": MessageSquare,
  rocket: Rocket,
  settings: Settings2,
  sparkles: Sparkles,
  "trending-up": TrendingUp,
  wallet: Wallet,
};

/** Every valid name, for the zod schema that validates CMS payloads. */
export const ICON_NAMES = Object.keys(ICONS) as [IconName, ...IconName[]];
