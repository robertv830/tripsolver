// app/company/page.js
"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function CompanyLandingPage() {
const router = useRouter();

return (
<div style={{ padding: 40, maxWidth: 1050, margin: "0 auto" }}>
{/* Header */}
<div style={{ textAlign: "center", marginBottom: 26 }}>
<h1 style={{ fontSize: 44, fontWeight: 900, margin: 0 }}>
TripSolver for Teams
</h1>
<div style={{ marginTop: 10, color: "#374151", fontSize: 18 }}>
A travel inspiration + perks platform employees actually use.
</div>

<div
style={{
marginTop: 16,
display: "flex",
gap: 10,
justifyContent: "center",
flexWrap: "wrap",
}}
>
<button
onClick={() => router.push("/company/dashboard")}
style={btnPrimary}
>
View Demo Dashboard
</button>

<button
onClick={() => router.push("/")}
style={btnSecondary}
>
Back to Home
</button>
</div>
</div>

{/* Value props */}
<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
gap: 14,
marginBottom: 18,
}}
>
<div style={card}>
<div style={cardTitle}>What employees get</div>
<ul style={ul}>
<li>Fast quiz → destination matches</li>
<li>Activities + restaurants inside each card</li>
<li>Coupons & deals (Groupon / Viator / etc.)</li>
<li>Save an itinerary (MVP is local; later can be account-based)</li>
</ul>
</div>

<div style={card}>
<div style={cardTitle}>What companies get</div>
<ul style={ul}>
<li>Dashboard: usage + interest trends</li>
<li>Popular destinations, themes, and deal clicks</li>
<li>Employee wellness perk (encourages real time-off planning)</li>
<li>Optional company perks expansion later (phone plans, etc.)</li>
</ul>
</div>

<div style={card}>
<div style={cardTitle}>Why it works</div>
<ul style={ul}>
<li>Low effort: 2–3 minute quiz</li>
<li>High value: it feels like a personal travel concierge</li>
<li>“Perks” are tangible: discounts people can use immediately</li>
<li>Feedback loop: you’ll learn what employees want next</li>
</ul>
</div>
</div>

{/* How it works */}
<div style={{ ...card, marginBottom: 18 }}>
<div style={cardTitle}>How it works (simple rollout)</div>
<div style={{ color: "#374151", lineHeight: 1.6 }}>
<ol style={{ paddingLeft: 18, margin: 0 }}>
<li>Company shares a link (or we embed it in a benefits portal)</li>
<li>Employees take the quiz and get destination cards</li>
<li>Employees click activities/restaurants/deals and plan trips</li>
<li>Company views aggregate dashboard trends (no sensitive data)</li>
</ol>
</div>
</div>

{/* Pricing */}
<div style={{ ...card, marginBottom: 18 }}>
<div style={cardTitle}>Pricing (placeholder for demos)</div>
<div style={{ color: "#374151", lineHeight: 1.6 }}>
Keep it simple early:
<ul style={{ ...ul, marginTop: 10 }}>
<li>
<b>Starter:</b> $2–$3 / employee / month (annual billing)
</li>
<li>
Includes employee access + coupons/deals + company dashboard
</li>
<li>
Later add: SSO, HRIS integrations, custom perks marketplace
</li>
</ul>
</div>
</div>

{/* CTA */}
<div
style={{
...card,
background: "#111827",
color: "white",
border: "1px solid #111827",
}}
>
<div style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>
Want early access for your company?
</div>

<div style={{ color: "#e5e7eb", lineHeight: 1.6 }}>
For now, this is a demo flow. When you’re ready, we’ll plug in:
employee accounts, real dashboard tracking, and company-specific perks.
</div>

<div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
<button
onClick={() => router.push("/company/dashboard")}
style={{ ...btnPrimary, background: "white", color: "#111827" }}
>
See the Dashboard Demo
</button>

<a
href="mailto:hello@tripsolver.co?subject=TripSolver%20for%20Teams%20-%20Early%20Access"
style={{
display: "inline-block",
textDecoration: "none",
fontWeight: 900,
padding: "12px 18px",
borderRadius: 12,
border: "1px solid rgba(255,255,255,0.25)",
color: "white",
}}
>
Request Early Access (Email)
</a>
</div>

<div style={{ marginTop: 10, color: "#9ca3af", fontSize: 13 }}>
(You can swap this email link for a real lead form later.)
</div>
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
marginBottom: 10,
fontSize: 16,
};

const ul = {
margin: 0,
paddingLeft: 18,
color: "#374151",
lineHeight: 1.65,
};

const btnPrimary = {
background: "#111827",
color: "white",
border: "none",
borderRadius: 12,
padding: "12px 18px",
cursor: "pointer",
fontWeight: 900,
fontSize: 16,
};

const btnSecondary = {
background: "white",
color: "#111827",
border: "1px solid #d1d5db",
borderRadius: 12,
padding: "12px 18px",
cursor: "pointer",
fontWeight: 900,
fontSize: 16,
};