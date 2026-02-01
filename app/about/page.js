// app/about/page.js
"use client";

import React from "react";
import Link from "next/link";

export default function AboutPage() {
return (
<div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
<div style={{ marginBottom: 18 }}>
<Link href="/" style={{ fontWeight: 800, textDecoration: "none" }}>
← Back to Home
</Link>
</div>

<h1 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 10px 0" }}>
About TripSolver
</h1>

<p style={{ color: "#374151", fontSize: 16, lineHeight: 1.6 }}>
TripSolver helps you find trip ideas faster using a quick quiz and a curated destination catalog.
After you get results, you can “Plan Trip” to see activities, restaurants, and deals for that destination.
</p>

<h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 24 }}>
What TripSolver does
</h2>
<ul style={{ color: "#374151", lineHeight: 1.7 }}>
<li>Recommends destinations based on your quiz answers (distance, preferences, and budget range).</li>
<li>Shows a “Why this matched” explanation on each card.</li>
<li>Lets you open maps, flights, hotels, and driving directions in a new tab.</li>
<li>Provides activities, restaurants, and deals inside the trip planner modal.</li>
</ul>

<h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 24 }}>
Affiliate disclosure
</h2>
<p style={{ color: "#374151", fontSize: 16, lineHeight: 1.6 }}>
Some links on TripSolver may be affiliate links. This means we may earn a commission if you click a link
and make a purchase, at no extra cost to you. These commissions help support and improve the project.
</p>

<h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 24 }}>
Contact
</h2>
<p style={{ color: "#374151", fontSize: 16, lineHeight: 1.6 }}>
For questions, feedback, or partnership inquiries, please use the feedback form linked in the app
or email us once a contact email is published on the site.
</p>

<div
style={{
marginTop: 30,
borderTop: "1px solid #e5e7eb",
paddingTop: 16,
color: "#6b7280",
fontSize: 13,
display: "flex",
gap: 16,
flexWrap: "wrap",
}}
>
<Link href="/privacy" style={{ textDecoration: "none" }}>
Privacy Policy
</Link>
<Link href="/quiz" style={{ textDecoration: "none" }}>
Take the Quiz
</Link>
<Link href="/pricing" style={{ textDecoration: "none" }}>
Pricing
</Link>
</div>
</div>
);
}
