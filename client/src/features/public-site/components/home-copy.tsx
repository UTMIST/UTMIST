import { Fragment } from "react";

/** Copy stays plain text; line breaks and optional emphasis use the site's presentation. */
export default function HomeCopy({ text, highlight, accent = false }: {
  text: string;
  highlight?: string;
  accent?: boolean;
}) {
  return text.split("\n").map((line, index) => {
    const start = highlight ? line.indexOf(highlight) : -1;
    return (
      <Fragment key={index}>
        {index > 0 && <><br className="hidden sm:block" />{" "}</>}
        {start < 0 || !highlight ? line : <>
          {line.slice(0, start)}
          <span className={accent ? "home-accent" : "home-selection"}>{highlight}</span>
          {line.slice(start + highlight.length)}
        </>}
      </Fragment>
    );
  });
}
