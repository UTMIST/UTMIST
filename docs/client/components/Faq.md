# Homepage FAQ

Both homepage layouts read `features/public-site/data/home-faq.ts`, whose entries
contain a `question` and `answer`.

The legacy `components/faq.tsx` uses React state to show one answer at a time and
styles from `styles/faq.css`. Its plus icon rotates when expanded.

The redesigned page uses native `details`/`summary` elements. Each question is
independently expandable with pointer or keyboard input and works without
JavaScript. Its scroll entrance uses the homepage motion controller. Keep the
question inside `summary` and decorative plus icons hidden from assistive
technology; do not replace the native disclosure with a click-only container.

Update the shared data to change wording. Content and presentation do not need
unit-test assertions; verify disclosure behavior when changing the controls.
