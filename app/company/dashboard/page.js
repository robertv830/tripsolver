// app/company/dashboard/page.js
"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function CompanyDashboardPage() {
const router = useRouter();

// Mock data (demo only)
const metrics = [
{ label: "Employees Active (30d)", value: "128" },
{ label: "Quizzes Completed", value: "312" },
{ label: "Trips Planned", value: "86" },
{ label: "Deals Clicked", value: "241" },
];

const topDestinations = [
{ name: "Orlando, FL", count: 42 },
{ name: "San Diego, CA", count: 31 },
{ name: "New York City, NY", count: 28 },
{ name: "Cancún, Mexico", count: 19 },
{ name: "Paris, France", count: 17 },
];

const topInterests = [
{ label: "Relaxing / Beach", pct: 36 },
{ label: "Food / Culture", pct: 24 },
{ label: "Outdoors / Hiking", pct: 21 },
{ label: "Theme Parks / Family", pct: 19 },
];

const mix = [
{ label: "Domestic (US)", pct: 72 },
{ label: "International", pct: 28 },
];

return (
<div style={{ padding: 40, maxWidth: 1100, margin: "0 auto" }}>
<div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
<div>
<h1 style={{ fontSize: 34, fontWeight: 900, margin: 0 }}>
Company Dashboard (Demo)
</h1>
<div style={{ marginTop: 8, color: "#374151" }}>
This is mock data for pitching. Later we’ll wire real analytics.
</div>
</div>

<div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
<button onClick={() => router.push("/company")} style={btnSecondary}>
Back to Teams Page
</button>
<button onClick={() => router.push("/")} style={btnSecondary}>
Home
</button>
</div>
</div>

{/* Metrics */}
<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
gap: 14,
marginTop: 18,
}}
>
{metrics.map((m) => (
<div key={m.label} style={card}>
<div style={{ color: "#6b7280", fontWeight: 800 }}>{m.label}</div>
<div style={{ fontSize: 34, fontWeight: 900, marginTop: 8 }}>{m.value}</div>
</div>
))}
</div>

{/* Two column section */}
<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
gap: 14,
marginTop: 14,
}}
>
<div style={card}>
<div style={cardTitle}>Top Destinations</div>
<div style={{ color: "#6b7280", fontSize: 13, marginBottom: 10 }}>
(Helps HR see where employees want to go)
</div>
{topDestinations.map((d) => (
<RowBar key={d.name} label={d.name} value={d.count} max={topDestinations[0].count} />
))}
</div>

<div style={card}>
<div style={cardTitle}>Top Interests</div>
<div style={{ color: "#6b7280", fontSize: 13, marginBottom: 10 }}>
(Shows what “kind” of vacations employees want)
</div>
{topInterests.map((x) => (
<RowBar key={x.label} label={x.label} value={`${x.pct}%`} pct={x.pct} />
))}
</div>
</div>

{/* Domestic vs Intl */}
<div style={{ ...card, marginTop: 14 }}>
<div style={cardTitle}>Domestic vs International Mix</div>
<div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
{mix.map((x) => (
<div
key={x.label}
style={{
border: "1px solid #e5e7eb",
borderRadius: 12,
padding: 14,
minWidth: 220,
flex: "1 1 220px",
}}
>
<div style={{ fontWeight: 900 }}>{x.label}</div>
<div style={{ marginTop: 6, color: "#374151" }}>
{x.pct}%
</div>
<div
style={{
marginTop: 10,
height: 10,
background: "#f3f4f6",
borderRadius: 999,
overflow: "hidden",
}}
>
<div
style={{
width: `${x.pct}%`,
height: "100%",
background: "#111827",
}}
/>
</div>
</div>
))}
</div>

<div style={{ marginTop: 12, color: "#374151", lineHeight: 1.6 }}>
<b>Story for employers:</b> usage spikes around stressful periods—employees often plan
trips when they feel burnout. Discounts and “low-friction planning” makes this perk sticky.
</div>
</div>

{/* Next steps */}
<div style={{ ...card, marginTop: 14 }}>
<div style={cardTitle}>Next step when you’re ready (real version)</div>
<ul style={{ margin: 0, paddingLeft: 18, color: "#374151", lineHeight: 1.6 }}>
<li>Track events: quiz completed, destination clicked, deal clicked, itinerary saved</li>
<li>Store analytics (e.g., Postgres + simple admin dashboard)</li>
<li>Add employee accounts (or anonymous cohort mode for privacy)</li>
<li>Optional: SSO + HRIS integrations later</li>
</ul>
</div>
</div>
);
}

function RowBar({ label, value, max, pct }) {
const computedPct =
typeof pct === "number"
? pct
: typeof value === "number" && typeof max === "number"
? Math.round((value / max) * 100)
: 0;

return (
<div style={{ marginBottom: 10 }}>
<div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
<div style={{ fontWeight: 800, color: "#111827" }}>{label}</div>
<div style={{ color: "#6b7280", fontWeight: 800 }}>{value}</div>
</div>
<div
style={{
marginTop: 6,
height: 10,
background: "#f3f4f6",
borderRadius: 999,
overflow: "hidden",
}}
>
<div
style={{
width: `${Math.max(0, Math.min(100, computedPct))}%`,
height: "100%",
background: "#111827",
}}
/>
</div>
</div>
);
}

const card = {
border: "1px solid #e5e7eb",
borderRadius: 14,
padding: 16,
background: "white",
};

const cardTitle = {
fontWeight: 900,
marginBottom: 6,
fontSize: 16,
};

const btnSecondary = {
background: "white",
color: "#111827",
border: "1px solid #d1d5db",
borderRadius: 12,
padding: "10px 14px",
cursor: "pointer",
fontWeight: 900,
};