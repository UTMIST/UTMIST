# HideOnEigenAI

`HideOnEigenAI` is a small client-side route guard for shared site chrome. It
returns `null` on `/eigenai` and nested EigenAI routes, and otherwise renders
its children unchanged.

The frontend layout uses it around the standard navbar and footer because
`/eigenai` always supplies its own navigation and footer. This wrapper does not
evaluate feature flags.
