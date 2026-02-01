// initial commit
// app/page.js
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
const router = useRouter();

return (
<div
style={{
padding: 40,
maxWidth: 980,
margin: "0 auto",
minHeight: "100vh",
display: "flex",
flexDirection: "column",
}}
>
{/* Main content */}
<div style={{ flex: 1 }}>
<div style={{ textAlign: "center", marginBottom: 28 }}>
<h1 style={{ fontSize: 44, fontWeight: 900, margin: 0 }}>
TripSolver
</h1>
<div style={{ marginTop: 10, color: "#374151", fontSize: 18 }}>
Take a quick quiz. Get destination matches + activities + restaurants + deals.
</div>
</div>

<div
style={{
display: "flex",
gap: 12,
justifyContent: "center",
flexWrap: "wrap",
marginBottom: 26,
}}
>
<button
onClick={() => router.push("/quiz")}
style={{
background: "#111827",
color: "white",
border: "none",
borderRadius: 12,
padding: "12px 18px",
cursor: "pointer",
fontWeight: 900,
fontSize: 16,
}}
>
Start the Quiz
</button>

<button
onClick={() => router.push("/pricing")}
style={{
background: "white",
color: "#111827",
border: "1px solid #d1d5db",
borderRadius: 12,
padding: "12px 18px",
cursor: "pointer",
fontWeight: 900,
fontSize: 16,
}}
>
View Pricing
</button>

<button
onClick={() => router.push("/company")}
style={{
background: "white",
color: "#1d4ed8",
border: "1px solid #1d4ed8",
borderRadius: 12,
padding: "12px 18px",
cursor: "pointer",
fontWeight: 900,
fontSize: 16,
}}
>
For Teams
</button>
</div>

<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
gap: 14,
marginTop: 10,
}}
>
<div style={cardStyle}>
<div style={cardTitle}>✅ Quick quiz</div>
<div style={cardText}>
2–3 minutes. Picks destinations based on your preferences.
</div>
</div>

<div style={cardStyle}>
<div style={cardTitle}>🗺️ Plan Trip details</div>
<div style={cardText}>
Activities, restaurants, and deals inside each destination card.
</div>
</div>

<div style={cardStyle}>
<div style={cardTitle}>💡 Built for feedback</div>
<div style={cardText}>
Try it, then fill out the feedback form on the results page.
</div>
</div>
</div>
</div>

{/* Footer */}
<footer
style={{
marginTop: 40,
paddingTop: 16,
borderTop: "1px solid #e5e7eb",
display: "flex",
justifyContent: "center",
gap: 20,
fontSize: 14,
color: "#6b7280",
flexWrap: "wrap",
}}
>
<Link href="/about" style={{ textDecoration: "none", color: "inherit" }}>
About
</Link>
<Link href="/privacy" style={{ textDecoration: "none", color: "inherit" }}>
Privacy Policy
</Link>
<Link href="/pricing" style={{ textDecoration: "none", color: "inherit" }}>
Pricing
</Link>
</footer>
</div>
);
}

const cardStyle = {
border: "1px solid #e5e7eb",
borderRadius: 14,
padding: 16,
background: "white",
};

const cardTitle = {
fontWeight: 900,
marginBottom: 6,
};

const cardText = {
color: "#374151",
};
