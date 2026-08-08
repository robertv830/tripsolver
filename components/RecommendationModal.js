// components/RecommendationModal.js
"use client";

import { useEffect, useMemo, useState } from "react";

function safeJsonParse(str, fallback) {
try {
if (!str) return fallback;
return JSON.parse(str);
} catch {
return fallback;
}
}

function normalizeTier(tier) {
const t = String(tier || "").toLowerCase().trim();
if (t === "pro") return "pro";
if (t === "plus") return "plus";
return "free";
}

function tierAllowsItinerary(tier) {
const t = normalizeTier(tier);
return t === "plus" || t === "pro";
}

function loadItineraryFromStorage() {
return safeJsonParse(localStorage.getItem("itinerary"), []);
}

function saveItineraryToStorage(items) {
localStorage.setItem("itinerary", JSON.stringify(items || []));
}

function buildPlaceLink(item) {
if (item?.mapsUrl) return item.mapsUrl;
if (item?.url) return item.url;

const placeId = item?.placeId || item?.place_id;
if (placeId) {
return `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}`;
}

const name = item?.name || item?.title || "";
if (name) {
return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
}
return "#";
}

function scrollToItineraryPanel() {
const el = document.getElementById("itinerary-panel");
if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function RecommendationModal({
destination,
onClose,
tier = "free",
originZip = "",
onItineraryChanged,
}) {
const destName = useMemo(() => destination?.name || "", [destination]);

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [toast, setToast] = useState("");

const [activities, setActivities] = useState([]);
const [restaurants, setRestaurants] = useState([]);
const [coupons, setCoupons] = useState([]);

const [checked, setChecked] = useState({});

async function load() {
setLoading(true);
setError("");
setToast("");
setChecked({});
setActivities([]);
setRestaurants([]);
setCoupons([]);

try {
if (!destName) {
setError("Destination name missing.");
setLoading(false);
return;
}

// ✅ Correct payload for your current /api/places route
const res = await fetch("/api/places", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
destinationName: destName,
destination: {
name: destName,
lat: destination?.lat ?? null,
lon: destination?.lon ?? null,
country: destination?.country ?? null,
},
lat: destination?.lat ?? null,
lon: destination?.lon ?? null,
country: destination?.country ?? null,
}),
});

const data = await res.json().catch(() => ({}));
if (!res.ok) {
setError(data?.error || `Places API failed (${res.status}).`);
setLoading(false);
return;
}

setActivities(Array.isArray(data?.activities) ? data.activities : []);
setRestaurants(Array.isArray(data?.restaurants) ? data.restaurants : []);
setCoupons(Array.isArray(data?.coupons) ? data.coupons : []);

setLoading(false);
} catch (e) {
setError(e?.message || "Failed to load places.");
setLoading(false);
}
}

useEffect(() => {
if (!destName) return;
load();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [destName]);

if (!destination) return null;

function toggle(key) {
setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
}

function addSelectedToItinerary() {
setToast("");

if (!tierAllowsItinerary(tier)) {
setToast("Upgrade to Plus to save an itinerary.");
return;
}

const selected = [];

for (const a of activities) {
const k = `a:${a.placeId || a.place_id || a.name}`;
if (checked[k]) selected.push({ type: "activity", ...a });
}

for (const r of restaurants) {
const k = `r:${r.placeId || r.place_id || r.name}`;
if (checked[k]) selected.push({ type: "restaurant", ...r });
}

for (const c of coupons) {
const k = `c:${c.url || c.title || c.name}`;
if (checked[k]) selected.push({ type: "coupon", ...c });
}

if (selected.length === 0) {
setToast("Select at least 1 item first.");
return;
}

const existing = loadItineraryFromStorage();
const keyOf = (it) =>
`${it.type}:${it.placeId || it.place_id || it.url || it.title || it.name || ""}`;

const seen = new Set(existing.map(keyOf));
const merged = [...existing];

for (const it of selected) {
const k = keyOf(it);
if (!seen.has(k)) {
seen.add(k);
merged.push(it);
}
}

saveItineraryToStorage(merged);
if (typeof onItineraryChanged === "function") onItineraryChanged(merged);

setToast(`Saved ${selected.length} item(s) to your itinerary.`);

// ✅ Make it feel like it worked: close modal + jump to itinerary panel
setTimeout(() => {
onClose?.();
setTimeout(scrollToItineraryPanel, 50);
}, 250);
}

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
<div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
Links open in a new tab. {originZip ? `Origin: ${originZip}` : ""}
</div>
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

{toast ? (
<div
style={{
marginTop: 12,
background: "#eef2ff",
borderRadius: 12,
padding: 10,
fontWeight: 900,
}}
>
{toast}
</div>
) : null}

<div style={{ marginTop: 16 }}>
<Section title="⭐ Activities" items={activities} emptyText="No activities returned." prefix="a" checked={checked} onToggle={toggle} />
<div style={{ height: 12 }} />
<Section title="🍽 Restaurants" items={restaurants} emptyText="No restaurants returned." prefix="r" checked={checked} onToggle={toggle} />
<div style={{ height: 12 }} />
<Section title="💸 Coupons & Deals" items={coupons} emptyText="No deals returned." prefix="c" checked={checked} onToggle={toggle} isCoupon />
</div>

<div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16, flexWrap: "wrap" }}>
<button
onClick={load}
style={{
border: "1px solid #111",
background: "white",
padding: "10px 12px",
borderRadius: 10,
cursor: "pointer",
fontWeight: 900,
}}
>
Reload Ideas
</button>

<button
onClick={addSelectedToItinerary}
style={{
border: "1px solid #1d4ed8",
background: "#1d4ed8",
color: "white",
padding: "10px 12px",
borderRadius: 10,
cursor: "pointer",
fontWeight: 900,
}}
>
Add Selected to Itinerary
</button>
</div>
</div>
</div>
);
}

function Section({ title, items, emptyText, prefix, checked, onToggle, isCoupon = false }) {
return (
<div>
<div style={{ fontWeight: 900, marginBottom: 6 }}>{title}</div>

{!items || items.length === 0 ? (
<div style={{ opacity: 0.75 }}>{emptyText}</div>
) : (
<div style={{ display: "grid", gap: 8 }}>
{items.map((p, idx) => {
const name = p?.name || p?.title || "Item";
const link = buildPlaceLink(p);

const keyBase =
prefix === "a" || prefix === "r"
? `${prefix}:${p?.placeId || p?.place_id || name}`
: `${prefix}:${p?.url || p?.title || p?.name || idx}`;

const address = p?.address || p?.formattedAddress || p?.description || "";
const rating = p?.rating ?? null;
const source = p?.source || "";

return (
<label
key={`${name}-${idx}`}
style={{
display: "grid",
gridTemplateColumns: "22px 1fr",
gap: 10,
padding: "8px 0",
borderBottom: "1px solid rgba(0,0,0,0.08)",
alignItems: "start",
}}
>
<input
type="checkbox"
checked={!!checked[keyBase]}
onChange={() => onToggle(keyBase)}
style={{ marginTop: 4 }}
/>

<div>
{link && link !== "#" ? (
<a href={link} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}>
{name}
</a>
) : (
<div style={{ fontWeight: 900 }}>{name}</div>
)}

{rating != null ? (
<div style={{ opacity: 0.8, marginTop: 2, fontWeight: 800 }}>⭐ {rating}</div>
) : null}

{address ? <div style={{ opacity: 0.8, marginTop: 2 }}>{address}</div> : null}

{isCoupon && source ? (
<div style={{ opacity: 0.75, marginTop: 2, fontWeight: 800 }}>Source: {source}</div>
) : null}
</div>
</label>
);
})}
</div>
)}
</div>
);
}
