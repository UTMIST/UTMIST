# HideOnEigenAI

`HideOnEigenAI` is a small client-side route guard for shared site chrome. It
returns `null` on `/eigenai` and nested EigenAI routes, and otherwise renders
its children unchanged.

The frontend layout uses it around the standard navbar, footer, and floating
theme toggle because the EigenAI experience supplies its own chrome. This is
route-based rather than feature-flag-based, so both the legacy and redesigned
EigenAI pages behave consistently.
