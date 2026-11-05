# Home impact tiles

`client/src/features/public-site/components/home-impact-tiles.tsx` is a server
component rendered inside the white About content, directly above the purple mission band. It
receives `HomeImpactContent` from the page's existing content reader; it does
not fetch data or maintain client state.

The compact `home-card-heading` title and 16px introduction are centered above
the dashboard. There is no separate projects CTA here: each known metric links
to its destination, and Who We Are owns the introductory projects action.
A white dashboard frame groups the statistics, with a slim
decorative icon rail and a Community impact title bar. The
rail is hidden from assistive technology and on phones; it is illustration,
not additional navigation. “All time” describes the cumulative data rather than
acting as a filter. The frame, rail and title bar use the sponsor tiles' white
surface and indigo borders. A very light accent tint behind the cards separates
the dashboard content from its white frame.

The dashboard is centered at a maximum width of 896px, with a 48px title bar and
a 56px decorative rail. Cards use 12 / 16px padding, 14px medium-weight labels
and 30 / 36px numbers. A small icon/arrow row sits above each number; the label
appears once underneath it. Each link's accessible name starts with the visible
number and title for voice navigation, followed by the full source description.
The frame extends 32px beyond an overflow crop flush with the purple mission
band's top edge. There is no gap between that crop and the purple background,
so the band visually cuts off the dashboard. Only extra frame padding is clipped:
every statistic, link and focus outline stays above the cutoff, with 24px of
clearance below the cards. The mission supplies its own internal top padding.
The panel height follows its content. Individual white tiles use three columns
from 768px upward and two on smaller screens,
using the shared flat `CardLink` with rounded corners, fine borders and accent
hover/focus fill. The
frame uses the light section palette; numbers, icons and keyboard focus use
indigo on the white surface.

Known statistic descriptions map to titles, icons and destinations documented
in [Home](../pages/Home.md). Each linked tile is one keyboard focus target.
Mapping follows descriptions rather than positions so CMS reordering preserves
the correct destinations. Unknown descriptions render their supplied number and
description as an unlinked tile.

`home-scroll-effects` supplies entrance motion. The flat cards use shared focus
outlines and hover tokens, respecting reduced motion. Behaviour tests in
`client/tests/unit/home-impact-tiles.test.tsx` cover reordered CMS values,
unknown statistics and visible labels in accessible names; layout and colour
are checked in the browser.

The [desktop transition](../assets/home-redesign/purple-cleanup/dashboard-to-mission-desktop.png)
and [mobile transition](../assets/home-redesign/purple-cleanup/dashboard-to-mission-mobile.png)
show the dashboard crop meeting the purple mission band without a gap.
