// app/privacy/page.js
"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPage() {
return (
<div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
<div style={{ marginBottom: 18 }}>
<Link href="/" style={{ fontWeight: 800, textDecoration: "none" }}>
← Back to Home
</Link>
</div>

<h1 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 10px 0" }}>
Privacy Policy
</h1>

<p style={{ color: "#6b7280", marginTop: 0 }}>
Effective date: {new Date().toLocaleDateString()}
</p>

<p style={{ color: "#374151", fontSize: 16, lineHeight: 1.6 }}>
This Privacy Policy explains how TripSolver collects, uses, and shares information when you use our website
and app experience.
</p>

<h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 24 }}>
Information we collect
</h2>

<h3 style={{ fontSize: 18, fontWeight: 900, marginTop: 14 }}>
1) Quiz information you enter
</h3>
<p style={{ color: "#374151", lineHeight: 1.6 }}>
When you take the quiz, we may store answers (such as ZIP code, budget range, distance preference, and travel
preferences) in your browser storage (localStorage/sessionStorage) to generate and display your results.
</p>

<h3 style={{ fontSize: 18, fontWeight: 900, marginTop: 14 }}>
2) Usage data
</h3>
<p style={{ color: "#374151", lineHeight: 1.6 }}>
We may collect basic usage information (for example: pages visited or clicks) to improve the product.
During early testing, we may rely on simple analytics tools or none at all.
</p>

<h3 style={{ fontSize: 18, fontWeight: 900, marginTop: 14 }}>
3) Third-party services
</h3>
<p style={{ color: "#374151", lineHeight: 1.6 }}>
TripSolver uses third-party services for travel planning links and place suggestions (for example: Google Maps
and Google Places). When you click those links, you may be taken to third-party websites that have their own
privacy policies.
</p>

<h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 24 }}>
How we use information
</h2>
<ul style={{ color: "#374151", lineHeight: 1.7 }}>
<li>To generate destination recommendations based on your quiz answers.</li>
<li>To display activities, restaurants, and deals for a selected destination.</li>
<li>To improve the accuracy and usefulness of the recommendations.</li>
<li>To support affiliates and monetization (see disclosure below).</li>
</ul>

<h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 24 }}>
Affiliate disclosure
</h2>
<p style={{ color: "#374151", lineHeight: 1.6 }}>
TripSolver may include affiliate links. If you click an affiliate link and make a purchase, we may earn a
commission at no extra cost to you. Affiliate partners may use cookies or similar technologies to track
referrals.
</p>

<h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 24 }}>
Data retention
</h2>
<p style={{ color: "#374151", lineHeight: 1.6 }}>
Quiz answers are typically stored in your browser storage to keep the experience working smoothly.
You can clear your browser storage at any time to remove this information.
</p>

<h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 24 }}>
Your choices
</h2>
<ul style={{ color: "#374151", lineHeight: 1.7 }}>
<li>You can stop using TripSolver at any time.</li>
<li>You can clear browser storage (localStorage/sessionStorage) to remove saved quiz data.</li>
<li>You can avoid clicking third-party links if you prefer not to use external services.</li>
</ul>

<h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 24 }}>
Contact
</h2>
<p style={{ color: "#374151", lineHeight: 1.6 }}>
For privacy questions, please use the feedback form linked in the app.
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
<Link href="/about" style={{ textDecoration: "none" }}>
About
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