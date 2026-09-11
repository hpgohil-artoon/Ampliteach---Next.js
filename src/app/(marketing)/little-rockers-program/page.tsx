import { LittleRockersPage } from "@/features/little-rockers";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Little Rockers Program",
  description:
    "An award-winning early-years music program that teaches rhythm and timing through percussion — and gives your school a natural pathway into private lessons.",
  path: "/little-rockers-program",
});

export default function Page() {
  return <LittleRockersPage />;
}
