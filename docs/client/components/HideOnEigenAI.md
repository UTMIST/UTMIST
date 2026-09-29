# HideOnEigenAI

`HideOnEigenAI` is a small client-side route guard for shared site chrome. It
returns `null` on `/eigenai` and nested EigenAI routes, and otherwise renders
its children unchanged.

The frontend layout uses it around the standard navbar and footer because
`/eigenai` supplies its chrome through the server-side page selector. The
redesign renders its own navigation and footer. When the flag is off (including
missing configuration or provider failures), the selector renders the standard
navbar and footer around the legacy page. Keep those controls in the legacy
branch: this wrapper hides only the layout's copies and does not evaluate the
feature flag.
