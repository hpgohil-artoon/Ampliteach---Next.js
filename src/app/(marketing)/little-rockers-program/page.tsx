import { buildMetadata } from "@/lib/seo";
import { TRANSFORM_CTA } from "@/content/home";
import { CtaBanner } from "@/components/common";
import { LittleRockersHero, ProgramDescription } from "@/features/little-rockers/sections";

export const metadata = buildMetadata({
  title: "Little Rockers Program",
  description:
    "An award-winning early-years music program that teaches rhythm and timing through percussion — and gives your school a natural pathway into private lessons.",
  path: "/little-rockers-program",
});

export default function LittleRockersPage() {
  return (
    <>
      <LittleRockersHero />
      <ProgramDescription />
      <CtaBanner {...TRANSFORM_CTA} />
    </>
  );
}
