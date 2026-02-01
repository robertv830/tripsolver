// components/RecommendationModal.js
"use client";

import { useEffect, useMemo, useState } from "react";

export default function RecommendationModal({ destination, onClose }) {
const destName = useMemo(() => destination?.name || "", [destination]);

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [activities, setActivities] = useState([]);
const [restaurants, setRestaurants] = useState([]);

async function load() {
setLoading(true);
setError("");
setActivities([]);
setRestaurants([]);

try {
if (!destName) {
setError("Destination name missing.");
setLoading(false);
return;
}

const res = await fetch("/api/places", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ destination: destName }),
});

const data = await res.json().catch(() => ({}));

if (!res.ok) {
setError(data?.error || `Places API failed (${res.status}).`);
setLoading(false);
return;
}

// Accept both shapes:
// { activities, restaurants } OR { items } (older)
setActivities(Array.isArray(data.activities) ? data.activities : []);
setRestaurants(Array.isArray(data.restaurants) ? data.restaurants : []);

setLoading(false);
} catch (e) {
setError(e?.message || "Failed to load places.");
setLoading(false);
}
}

useEffect(() => {
load();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [destName]);

if (!destination) return null;

return (
<div
style={{
position: "fixed",
inset: 0,
background: "rgba(0,0,0,0.45)",
zIndex: 9999,
display: "flex",
justifyContent: "center",
alignItems: "flex-start",
paddingTop: 40,
paddingLeft: 16,
paddingRight: 16,
}}
onClick={onClose}
>
<div
style={{
width: "min(900px, 96vw)",
background: "#fff",
borderRadius: 14,
boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
padding: 18,
maxHeight: "85vh",
overflowY: "auto",
}}
onClick={(e) => e.stopPropagation()}
>
<div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
<div>
<div style={{ fontSize: 22, fontWeight: 900 }}>Plan Your Trip: {destName}</div>
<div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>Links open in a new tab.</div>
</div>

<button
onClick={onClose}
style={{
border: "none",
background: "transparent",
fontSize: 26,
cursor: "pointer",
lineHeight: 1,
}}
aria-label="Close"
>
×
</button>
</div>

{loading ? <p style={{ marginTop: 14 }}>Loading ideas…</p> : null}
{error ? <p style={{ marginTop: 14, color: "crimson", fontWeight: 800 }}>{error}</p> : null}

<div style={{ marginTop: 16 }}>
<Section title="⭐ Activities" items={activities} emptyText="No activities returned." />
<div style={{ height: 12 }} />
<Section title="🍽 Restaurants" items={restaurants} emptyText="No restaurants returned." />
<div style={{ height: 12 }} />
<div style={{ fontWeight: 900, marginTop: 8 }}>💸 Coupons & Deals</div>
<div style={{ opacity: 0.75, marginTop: 4 }}>
Not wired yet (we’ll add this next).
</div>
</div>

<div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
<button
onClick={load}
style={{
border: "1px solid #111",
background: "#111",
color: "white",
padding: "10px 12px",
borderRadius: 10,
cursor: "pointer",
fontWeight: 900,
}}
>
Reload Ideas
</button>
</div>
</div>
</div>
);
}

function Section({ title, items, emptyText }) {
return (
<div>
<div style={{ fontWeight: 900, marginBottom: 6 }}>{title}</div>
{!items || items.length === 0 ? (
<div style={{ opacity: 0.75 }}>{emptyText}</div>
) : (
<ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
{items.map((p, idx) => {
const url = p.websiteUri || p.googleMapsUri || p.url || "";
const address = p.formattedAddress || p.address || p.description || "";
const name = p.name || "Place";

return (
<li
key={`${name}-${idx}`}
style={{
padding: "8px 0",
borderBottom: "1px solid rgba(0,0,0,0.08)",
}}
>
{url ? (
<a href={url} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}>
{name}
</a>
) : (
<div style={{ fontWeight: 900 }}>{name}</div>
)}
{address ? <div style={{ opacity: 0.8, marginTop: 2 }}>{address}</div> : null}
</li>
);
})}
</ul>
)}
</div>
);
}
