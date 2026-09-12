## 📊 AdminPageClient & Umami API Route Documentation

### 📁 Location

- **Path**: `app/(frontend)/admin/page.tsx`
- **API Route**: `app/(frontend)/api/umami/overview/route.ts`
- **Dependencies**:

  - Fetches analytics from [Umami Cloud](https://umami.is/)
  - Uses `fetch()` to call Umami's `/v1/websites` and `/v1/websites/:id/stats`
  - Requires `.env.local` setup with:

    ```env
    UMAMI_API_ENDPOINT=https://api.umami.is/v1
    UMAMI_API_KEY=[Our Umami Cloud API]
    ```

---

### 🧩 Component: `AdminPageClient()`

#### ✅ Purpose:

Renders a basic analytics dashboard with data fetched from Umami Cloud:

- Total visits
- Unique visitors
- Bounce rate
- Average time on site

---

### 📌 Client UI Sections:

#### `1. Loading & Error State`

```tsx
if (error) return <p>Error: {error}</p>;
if (!ov) return <p>Loading metrics…</p>;
```

- Shows appropriate messages if fetch fails or is in progress.

#### `2. Stats Cards`

```tsx
<MetricCard title="Total Site Visits" value={ov.totalVisits.toLocaleString()} />
<MetricCard title="Unique Visitors" value={ov.uniques.toLocaleString()} />
<MetricCard title="Bounce Rate" value={`${(ov.bounceRate * 100).toFixed(1)}%`} />
<MetricCard title="Avg. Time on Page" value={`${(ov.avgTime / 1000).toFixed(1)}s`} />
```

- Tailwind-styled stat cards arranged in a responsive grid layout.

---

### 🔌 Server-side API Route: `GET /api/umami/overview`

#### ✅ Purpose:

Fetches analytics data from Umami Cloud and returns simplified stats for the frontend.

#### 🧱 Key Sections:

##### `1. Fetch website list`

```ts
const sitesRes = await fetch(`${UMAMI_API_ENDPOINT}/websites`, ...);
const siteId = sites.data[0].id;
```

- Retrieves the website ID for the first tracked site.

##### `2. Calculate date range`

```ts
const now = Date.now();
const startAt = now - 30 * 24 * 60 * 60 * 1000;
```

- Gets timestamps for the last 30 days in **milliseconds** (required by v1 API).

##### `3. Fetch stats`

```ts
const statsRes = await fetch(`${UMAMI_API_ENDPOINT}/websites/${siteId}/stats?startAt=${startAt}&endAt=${now}&unit=day&timezone=UTC`, ...);
```

- Uses the v1 API with API key header (`x-umami-api-key`).

##### `4. Return summarized values`

```ts
return NextResponse.json({
  totalVisits: stats.pageviews.value,
  uniques: stats.visitors.value,
  bounceRate: stats.visits.value ? stats.bounces.value / stats.visits.value : 0,
  avgTime: stats.visits.value ? stats.totaltime.value / stats.visits.value : 0,
});
```

---

### 📘 Related Helpers

- `MetricCard()`: Reusable stat card component for each dashboard value.
- Environment variables must be present and loaded before calling the API route.

---

### ⚠️ Gotchas

- `NextResponse.error()` throws `Invalid status code: 0` → Use `new NextResponse("message", { status: 500 })` instead.
- Make sure to use `v1` API with API Key — not the session-based `/api/me/websites` endpoint.
- All timestamps must be in **milliseconds**, not ISO strings.

---

### ✅ Example curl commands

**List websites**:

```bash
curl "https://api.umami.is/v1/websites" \
  -H "Accept: application/json" \
  -H "x-umami-api-key: YOUR_API_KEY"
```

**Fetch stats**:

```bash
curl "https://api.umami.is/v1/websites/WEBSITE_ID/stats?startAt=START_MS&endAt=END_MS&unit=day&timezone=UTC" \
  -H "Accept: application/json" \
  -H "x-umami-api-key: YOUR_API_KEY"
```
