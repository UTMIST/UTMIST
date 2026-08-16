<!--
Thanks for contributing! A filled-in description gets your PR reviewed faster.
See CONTRIBUTING.md if this is your first one.
-->

## What changed

<!-- A short summary of the change. -->

## Why

<!-- The problem this solves. If the reasoning is non-obvious, this is the most
     useful part of the PR — the diff already shows what changed. -->

Closes #

## Screenshots

<!-- Required for any visual change. Before/after side by side if you can.
     Include mobile if the layout is responsive. Delete this section if the
     change has no UI. -->

## How to test

<!-- Steps for a reviewer to verify this locally. -->

1.

## Checklist

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes
- [ ] Tests added or updated for this change
- [ ] Any new environment variable is documented in `client/env.example` and added to GitHub Actions secrets + Vercel
- [ ] Any surface exposing applicant data is behind `requireAdmin()` / `getAdminUser()`
- [ ] Docs under `docs/client/` updated for any new page or component

## Notes for reviewers

<!-- Anything worth flagging: a tradeoff you made, something you were unsure
     about, something that deserves a closer look, or a follow-up you plan to do
     separately. Optional. -->
