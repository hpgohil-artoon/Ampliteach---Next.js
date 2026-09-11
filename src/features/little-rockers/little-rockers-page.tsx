import { TRANSFORM_CTA } from "@/content/shared";
import { CtaBanner } from "@/components/common";
import { LittleRockersHero, ProgramDescription } from "./sections";

/** The Little Rockers Program outline. One name per file in `./sections`. */
export function LittleRockersPage() {
  return (
    <>
      <LittleRockersHero />
      <ProgramDescription />
      <CtaBanner {...TRANSFORM_CTA} />
    </>
  );
}
