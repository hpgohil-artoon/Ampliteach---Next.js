import { Fragment } from "react";
import type { TextRun } from "@/types";

/**
 * Renders a paragraph's runs, bolding the ones marked.
 *
 * The one place a `TextRun[]` becomes elements, so the markup a bold phrase
 * produces is decided once rather than per section. Emits nothing but text and
 * `<b>`, so the caller owns the wrapping element and all of its styling.
 *
 * Runs are keyed by index deliberately: the list is fixed for a given block and
 * never reordered or filtered, so the index *is* the stable identity.
 */
export function RichText({ runs }: { runs: TextRun[] }) {
  return (
    <>
      {runs.map((run, index) => (
        <Fragment key={index}>
          {run.bold ? <b className="font-bold">{run.text}</b> : run.text}
          {run.breakAfter ? <br /> : null}
        </Fragment>
      ))}
    </>
  );
}
