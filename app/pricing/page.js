// app/pricing/page.js
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
const router = useRouter();

const tiers = useMemo(
() => [
{
id: "free",
name: "Free",
price: "$0",
blurb: "Try it and tell us what you think.",
bullets: [
"Quiz + destination matches",
"Plan Trip: activities & restaurants",
"Deals section (basic links)",
],
cta: "Start Free",
},
{
id: "plus",
name: "Plus",
price: "$4.99/mo",
blurb: "More options and better personalization.",
bullets: [
"Everything in Free",
"More destinations per result",
"Better matching (stronger weighting + fewer “meh” picks)",
"Save favorites",
],
cta: "Choose Plus",
},
{
id: "pro",
name: "Pro",
price: "$9.99/mo",
blurb: "Full itinerary workflow (future tier).",
bullets: [
"Everything in Plus",
"Build + save an itinerary in-app",
"Trip date + reminders (email notifications)",
"Affiliate deal bundles (future enhancement)",
],
cta: "Choose Pro",
},
],
[]
);

const [selectedTier, setSelectedTier] = useState(null);
const [email, setEmail] = useState("");
const [name, setName] = useState("");
const [error, setError] = useState("");

function openSignup(tierId) {
setSelectedTier(tierId);
setError("");
}

function closeSignup() {
setSelectedTier(null);
setError("");
}

function simulateSignup() {
setError("");

const tier = String(selectedTier || "").trim();
if (!tier) return;

// minimal validation (simulation only)
const e = String(email || "").trim();
if (e && !e.includes("@")) {
setError("Please enter a valid email (or leave it blank).");
return;
}

const payload = {
tier,
email: e,
name: String(name || "").trim(),
createdAt: new Date().toISOString(),
};

// ✅ 1) Store the selection object (you already had this)
localStorage.setItem("pricingSelection", JSON.stringify(payload));
sessionStorage.setItem("pricingSelection", JSON.stringify(payload));

// ✅ 2) Store the tier as a simple key that the app can read everywhere
localStorage.setItem("selectedTier", tier);
sessionStorage.setItem("selectedTier", tier);

// move them into quiz flow
router.push("/quiz");
}

return (
<div style={{ padding: 40, maxWidth: 1100, margin: "0 auto" }}>
<div style={{ textAlign: "center", marginBottom: 20 }}>
<h1 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>Pricing</h1>
<div style={{ color: "#374151", marginTop: 8 }}>
This page simulates signup. No real billing yet.
</div>
</div>

<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
gap: 16,
}}
>
{tiers.map((t) => (
<div
key={t.id}
style={{
border: "1px solid #e5e7eb",
borderRadius: 14,
padding: 18,
background: "white",
}}
>
<div style={{ fontSize: 20, fontWeight: 900 }}>{t.name}</div>
<div style={{ fontSize: 28, fontWeight: 900, marginTop: 6 }}>
{t.price}
</div>
<div style={{ color: "#374151", marginTop: 8 }}>{t.blurb}</div>

<ul style={{ marginTop: 12, color: "#111827", paddingLeft: 18 }}>
{t.bullets.map((b, idx) => (
<li key={idx} style={{ marginBottom: 6 }}>
{b}
</li>
))}
</ul>

<button
onClick={() => openSignup(t.id)}
style={{
marginTop: 10,
width: "100%",
background: "#111827",
color: "white",
border: "none",
borderRadius: 12,
padding: "12px 14px",
fontWeight: 900,
cursor: "pointer",
}}
>
{t.cta}
</button>
</div>
))}
</div>

<div style={{ textAlign: "center", marginTop: 22 }}>
<button
onClick={() => router.push("/")}
style={{
background: "white",
border: "1px solid #d1d5db",
borderRadius: 12,
padding: "10px 14px",
fontWeight: 900,
cursor: "pointer",
}}
>
Back to Home
</button>
</div>

{/* Modal */}
{selectedTier ? (
<div style={backdropStyle} onClick={closeSignup}>
<div style={modalStyle} onClick={(e) => e.stopPropagation()}>
<div style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>
Simulate Signup
</div>

<div style={{ color: "#374151", marginBottom: 14 }}>
Selected tier: <b>{selectedTier}</b>
</div>

<label style={labelStyle}>Name (optional)</label>
<input
value={name}
onChange={(e) => setName(e.target.value)}
placeholder="Your name"
style={inputStyle}
/>

<label style={labelStyle}>Email (optional)</label>
<input
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="you@example.com"
style={inputStyle}
/>

{error ? (
<div style={{ color: "crimson", fontWeight: 800, marginTop: 10 }}>
{error}
</div>
) : null}

<div
style={{
display: "flex",
gap: 10,
justifyContent: "flex-end",
marginTop: 16,
}}
>
<button onClick={closeSignup} style={secondaryBtn}>
Cancel
</button>
<button onClick={simulateSignup} style={primaryBtn}>
Continue to Quiz
</button>
</div>
</div>
</div>
) : null}
</div>
);
}

const backdropStyle = {
position: "fixed",
inset: 0,
background: "rgba(0,0,0,0.25)",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: 20,
zIndex: 9999,
};

const modalStyle = {
width: "min(520px, 96vw)",
background: "white",
borderRadius: 14,
border: "1px solid #e5e7eb",
padding: 18,
};

const labelStyle = {
display: "block",
fontWeight: 900,
marginTop: 10,
marginBottom: 6,
};

const inputStyle = {
width: "100%",
border: "1px solid #d1d5db",
borderRadius: 10,
padding: "10px 12px",
};

const primaryBtn = {
background: "#111827",
color: "white",
border: "none",
borderRadius: 12,
padding: "10px 14px",
fontWeight: 900,
cursor: "pointer",
};

const secondaryBtn = {
background: "white",
color: "#111827",
border: "1px solid #d1d5db",
borderRadius: 12,
padding: "10px 14px",
fontWeight: 900,
cursor: "pointer",
};
