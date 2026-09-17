import { Fragment } from "react";
import Link from "next/link";
import type { TextRun } from "@/types";

/**
 * Renders a paragraph's runs, applying the emphasis each one carries.
 *
 * The one place a `TextRun[]` becomes elements, so the markup a bold phrase
 * produces is decided once rather than per section. Emits nothing but text,
 * `<b>`, `<i>` and links, so the caller owns the wrapping element and all of
 * its styling.
 *
 * A linked run is painted `text-primary`, matching the live theme, which styles
 * an inline link in the brand red. That is why a run carries `href` and not a
 * colour: colour is a consequence of the role, and a CMS editor never picks one.
 *
 * Runs are keyed by index deliberately: the list is fixed for a given block and
 * never reordered or filtered, so the index *is* the stable identity.
 */
export function RichText({ runs }: { runs: TextRun[] }) {
  return (
    <>
      {runs.map((run, index) => {
        let content = <>{run.text}</>;
        if (run.bold) content = <b className="font-bold">{content}</b>;
        if (run.italic) content = <i className="italic">{content}</i>;
        if (run.href) {
          content = (
            <Link href={run.href} className="text-primary">
              {content}
            </Link>
          );
        }

        return (
          <Fragment key={index}>
            {content}
            {run.breakAfter ? <br /> : null}
          </Fragment>
        );
      })}
    </>
  );
}
