// app/results/page.js
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* ---------------- helpers ---------------- */

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

function fmtDateISO(dateStr) {
const s = String(dateStr || "").trim();
if (!s) return "";
try {
const d = new Date(s);
if (Number.isNaN(d.getTime())) return s;
return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
} catch {
return s;
}
}

function buildDrivingDirectionsUrl(originZip, destinationName) {
const origin = originZip ? String(originZip).trim() : "";
const dest = destinationName ? String(destinationName).trim() : "";
if (!origin) {
return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=driving`;
}
return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(
dest
)}&travelmode=driving`;
}

function buildMapsSearchUrl(destinationName) {
const dest = destinationName ? String(destinationName).trim() : "";
return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest)}`;
}

function buildFlightsUrl(destinationName) {
const dest = destinationName ? String(destinationName).trim() : "";
return `https://www.google.com/travel/flights?q=${encodeURIComponent(dest)}`;
}

function buildHotelsUrl(destinationName) {
const dest = destinationName ? String(destinationName).trim() : "";
return `https://www.google.com/travel/hotels?q=${encodeURIComponent(dest)}`;
}

/**
* Unsplash “source” endpoint: no API key needed.
* It can occasionally fail — we fall back to picsum in onError.
*/
function buildUnsplashUrl(keyword) {
const q = String(keyword || "travel").trim();
return `https://source.unsplash.com/featured/800x450/?${encodeURIComponent(q)}`;
}

function buildPicsumUrl(seed) {
const s = Number(seed) || 1;
return `https://picsum.photos/seed/${s}/800/450`;
}

function hashStringToNumber(str) {
const s = String(str || "");
let h = 0;
for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
return h || 1;
}

function guessImageKeyword(destination) {
const name = destination?.name || "";
const tags = Array.isArray(destination?.tags) ? destination.tags : [];
const tagStr = tags.join(" ").toLowerCase();

if (tagStr.includes("beach")) return `${name} beach`;
if (tagStr.includes("mountain")) return `${name} mountains`;
if (tagStr.includes("theme")) return `${name} theme park`;
if (tagStr.includes("culture")) return `${name} city`;
if (tagStr.includes("outdoors")) return `${name} hiking`;

return `${name} travel`;
}

function getDestinationImageSrc(destination) {
const name = destination?.name || "travel";
const keyword = guessImageKeyword(destination);
return buildUnsplashUrl(keyword) + `&sig=${hashStringToNumber(name)}`;
}

function loadItineraryFromStorage() {
return safeJsonParse(localStorage.getItem("itinerary"), []);
}

function saveItineraryToStorage(items) {
localStorage.setItem("itinerary", JSON.stringify(items || []));
}

function groupItinerary(items) {
const grouped = { activity: [], restaurant: [], coupon: [] };
for (const it of items || []) {
const type = it?.type;
if (type === "activity") grouped.activity.push(it);
else if (type === "restaurant") grouped.restaurant.push(it);
else grouped.coupon.push(it); // includes custom ideas
}
return grouped;
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

function itineraryToShareText(items) {
const list = Array.isArray(items) ? items : [];
if (!list.length) return "My TripSolver itinerary is empty.";

const lines = ["My TripSolver itinerary:", ""];
for (const it of list) {
const label = it?.name || it?.title || "Item";
const link = buildPlaceLink(it);
const type = (it?.type || "item").toUpperCase();
lines.push(`- [${type}] ${label}`);
if (link && link !== "#") lines.push(` ${link}`);
}
return lines.join("\n");
}

function buildEmailPreview({ tier, tripDates, destinationName, items }) {
const t = normalizeTier(tier);

const start = tripDates?.startDate ? fmtDateISO(tripDates.startDate) : "";
const end = tripDates?.endDate ? fmtDateISO(tripDates.endDate) : "";
const when = start && end ? `${start} – ${end}` : start ? start : "";

const subject =
t === "pro"
? `TripSolver Pro: ${destinationName || "Your trip"} prep checklist`
: `TripSolver: Your itinerary`;

const bullets = [];
if (t === "pro") {
bullets.push("✅ Passport/ID check (if needed)");
bullets.push("✅ Hotel booked + confirmation saved");
bullets.push("✅ Transportation (flight/drive) confirmed");
bullets.push("✅ Weather-based packing reminder (sample)");
bullets.push("✅ Build a day-by-day plan (Pro feature preview)");
} else if (t === "plus") {
bullets.push("✅ Saved itinerary items");
bullets.push("✅ Share with friends/family (preview)");
} else {
bullets.push("✅ Upgrade to Plus to save itineraries");
}

const shareText = itineraryToShareText(items);

const body = [
`Hi!`,
``,
`Here’s your TripSolver ${t.toUpperCase()} preview.`,
when ? `Trip dates: ${when}` : ``,
destinationName ? `Destination focus: ${destinationName}` : ``,
``,
`Prep checklist:`,
...bullets.map((b) => `- ${b}`),
``,
`Itinerary:`,
shareText,
``,
`— TripSolver`,
]
.filter(Boolean)
.join("\n");

return { subject, body };
}

function buildProSampleTimeline(items, destinationName, startDate) {
const list = Array.isArray(items) ? items : [];
const picks = list.slice(0, 6);

const getLabel = (it) => it?.name || it?.title || "Plan item";

const fallback = [
{ label: "Breakfast near hotel", link: buildMapsSearchUrl(`${destinationName} breakfast`) },
{ label: "Top activity", link: buildMapsSearchUrl(`${destinationName} top things to do`) },
{ label: "Lunch spot", link: buildMapsSearchUrl(`${destinationName} lunch`) },
{ label: "Second activity", link: buildMapsSearchUrl(`${destinationName} attractions`) },
{ label: "Dinner reservation", link: buildMapsSearchUrl(`${destinationName} dinner`) },
{ label: "Back to hotel", link: buildHotelsUrl(destinationName) },
];

const mapped = picks.map((it) => ({
label: getLabel(it),
link: buildPlaceLink(it),
}));

const finalItems = mapped.length >= 3 ? mapped : fallback;
const dayLabel = startDate ? fmtDateISO(startDate) : "Trip Day 1 (sample)";

const times = ["8:00 AM", "9:30 AM", "12:00 PM", "2:00 PM", "6:30 PM", "9:00 PM"];

return {
title: `Sample AI-built itinerary (${dayLabel})`,
rows: times.map((t, idx) => ({
time: t,
...finalItems[idx % finalItems.length],
})),
note: "Preview only — Pro will later auto-optimize by distance, hours, and preferences.",
};
}

/* ---------------- components ---------------- */

function DestinationCard({ destination, originZip, onPlanTrip }) {
const name = destination?.name || "Destination";
const distance = destination?.distance;

const imgSrc = useMemo(() => getDestinationImageSrc(destination), [destination]);

return (
<div
style={{
border: "1px solid #d1d5db",
borderRadius: 12,
background: "white",
overflow: "hidden",
display: "flex",
flexDirection: "column",
}}
>
{/* Banner image */}
<div style={{ width: "100%", height: 150, background: "#f3f4f6" }}>
<img
src={imgSrc}
alt={name}
loading="lazy"
style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
onError={(e) => {
e.currentTarget.src = buildPicsumUrl(hashStringToNumber(name) + 17);
}}
/>
</div>

<div style={{ padding: 16 }}>
<div style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>{name}</div>

{destination?.summary ? (
<div style={{ color: "#374151", marginBottom: 8 }}>{destination.summary}</div>
) : null}

{distance != null ? (
<div style={{ color: "#6b7280", fontWeight: 800, marginBottom: 8 }}>
📏 About {distance} mi {originZip ? `from ${originZip}` : ""}
</div>
) : null}

{Array.isArray(destination?.whyMatched) && destination.whyMatched.length ? (
<div style={{ marginBottom: 10 }}>
<div style={{ fontWeight: 900, marginBottom: 6 }}>Why this matched</div>
<ul style={{ margin: 0, paddingLeft: 18, color: "#374151" }}>
{destination.whyMatched.slice(0, 4).map((w, i) => (
<li key={i}>{w}</li>
))}
</ul>
</div>
) : null}

<div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
<a href={buildDrivingDirectionsUrl(originZip, name)} target="_blank" rel="noreferrer" style={{ fontWeight: 800 }}>
📍 Directions
</a>
<a href={buildFlightsUrl(name)} target="_blank" rel="noreferrer" style={{ fontWeight: 800 }}>
Flights
</a>
<a href={buildHotelsUrl(name)} target="_blank" rel="noreferrer" style={{ fontWeight: 800 }}>
Hotels
</a>
<a href={buildMapsSearchUrl(name)} target="_blank" rel="noreferrer" style={{ fontWeight: 800 }}>
Map
</a>
</div>

<button
onClick={() => onPlanTrip(destination)}
style={{
marginTop: 12,
background: "#1d4ed8",
color: "white",
border: "none",
borderRadius: 10,
padding: "10px 14px",
fontWeight: 900,
cursor: "pointer",
width: "100%",
}}
>
Plan Trip
</button>
</div>
</div>
);
}

function ItineraryPanel({
tier,
items,
onClear,
onRemoveOne,
onCopyShare,
onEmail,
tripDates,
onTripDatesChange,
destinationNameForPro,
}) {
const grouped = useMemo(() => groupItinerary(items), [items]);
const total = (items || []).length;

const t = normalizeTier(tier);
const canUse = tierAllowsItinerary(tier);
const isPro = t === "pro";

return (
<div
style={{
maxWidth: 1100,
margin: "0 auto 16px auto",
border: "1px solid #e5e7eb",
borderRadius: 12,
background: "white",
padding: 14,
}}
>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
<div style={{ fontWeight: 900, fontSize: 16 }}>🧳 Your Itinerary</div>

<div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
<div style={{ color: "#6b7280", fontWeight: 900 }}>{total} item(s)</div>

<button
onClick={onCopyShare}
style={{
border: "1px solid #d1d5db",
background: "white",
borderRadius: 10,
padding: "8px 10px",
cursor: "pointer",
fontWeight: 900,
}}
title="Copies your itinerary text to clipboard"
>
Copy Share Text
</button>

<button
onClick={onEmail}
style={{
border: "1px solid #d1d5db",
background: "white",
borderRadius: 10,
padding: "8px 10px",
cursor: "pointer",
fontWeight: 900,
}}
title="Shows an email preview (copy/paste)"
>
Email Preview
</button>

<button
onClick={onClear}
style={{
border: "1px solid #d1d5db",
background: "white",
borderRadius: 10,
padding: "8px 10px",
cursor: "pointer",
fontWeight: 900,
}}
title="Clears your itinerary"
>
Clear
</button>
</div>
</div>
{!canUse ? (
<div style={{ marginTop: 10, color: "#374151" }}>
You’re in <b>Free</b> mode. Upgrade to <b>Plus</b> to save and view an itinerary.
</div>
) : total === 0 ? (
<div style={{ marginTop: 10, color: "#374151" }}>
Select a few items in “Plan Trip”, then click <b>Add Selected to Itinerary</b>.
</div>
) : (
<>
<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
gap: 12,
marginTop: 12,
}}
>
{[
{ title: "⭐ Activities", key: "activity" },
{ title: "🍽️ Restaurants", key: "restaurant" },
{ title: "➕ Custom / Deals", key: "coupon" },
].map((sec) => (
<div key={sec.key} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
<div style={{ fontWeight: 900, marginBottom: 8 }}>
{sec.title} ({grouped[sec.key].length})
</div>

{grouped[sec.key].length === 0 ? (
<div style={{ color: "#6b7280" }}>None yet.</div>
) : (
grouped[sec.key].slice(0, 12).map((it, idx) => {
const label = it?.name || it?.title || "Item";
const link = buildPlaceLink(it);
return (
<div
key={`${sec.key}-${it?.placeId || it?.place_id || it?.url || label}-${idx}`}
style={{
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: 10,
padding: "6px 0",
borderTop: idx === 0 ? "none" : "1px solid #f3f4f6",
}}
>
<a
href={link}
target="_blank"
rel="noreferrer"
style={{
fontWeight: 900,
color: "#1d4ed8",
textDecoration: "none",
overflow: "hidden",
textOverflow: "ellipsis",
whiteSpace: "nowrap",
flex: 1,
minWidth: 0,
}}
title={label}
>
{label}
</a>

<button
onClick={() => onRemoveOne(it)}
style={{
border: "1px solid #e5e7eb",
background: "white",
borderRadius: 10,
padding: "6px 10px",
cursor: "pointer",
fontWeight: 900,
flexShrink: 0,
}}
title="Remove"
>
✕
</button>
</div>
);
})
)}
</div>
))}
</div>
</>
)}

{isPro ? (
<div style={{ marginTop: 14, borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
<div style={{ fontWeight: 900, marginBottom: 6 }}>📅 Pro: Trip dates + reminders (preview)</div>

<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
<div style={{ display: "grid", gap: 6 }}>
<div style={{ fontWeight: 900 }}>Start</div>
<input
type="date"
value={tripDates?.startDate || ""}
onChange={(e) => onTripDatesChange({ ...tripDates, startDate: e.target.value })}
style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "8px 10px" }}
/>
</div>

<div style={{ display: "grid", gap: 6 }}>
<div style={{ fontWeight: 900 }}>End</div>
<input
type="date"
value={tripDates?.endDate || ""}
onChange={(e) => onTripDatesChange({ ...tripDates, endDate: e.target.value })}
style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "8px 10px" }}
/>
</div>

<div style={{ alignSelf: "end", color: "#6b7280", fontWeight: 800 }}>
(This is a preview — real emails come later. Will be able to share iteniary with others)
</div>
</div>

<div style={{ marginTop: 10, border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fafafa" }}>
<div style={{ fontWeight: 900, marginBottom: 6 }}>📧 Example email preview</div>
<div style={{ color: "#374151" }}>
Subject: <b>2 months from your vacation — prep list</b>
</div>
<ul style={{ marginTop: 8, color: "#374151" }}>
<li>Passport/ID check</li>
<li>Hotel booked?</li>
<li>Weather-based packing (sample)</li>
<li>Build a day-by-day plan (Pro)</li>
</ul>
</div>

<div style={{ marginTop: 12 }}>
{(() => {
const tl = buildProSampleTimeline(items, destinationNameForPro, tripDates?.startDate);
return (
<div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fafafa" }}>
<div style={{ fontWeight: 900, marginBottom: 8 }}>🧠 {tl.title}</div>

{tl.rows.map((r, idx) => (
<div
key={idx}
style={{
display: "grid",
gridTemplateColumns: "90px 1fr",
gap: 10,
padding: "6px 0",
borderTop: idx === 0 ? "none" : "1px solid #e5e7eb",
alignItems: "center",
}}
>
<div style={{ fontWeight: 900, color: "#111827" }}>{r.time}</div>
<a href={r.link} target="_blank" rel="noreferrer" style={{ fontWeight: 900, color: "#1d4ed8" }}>
{r.label}
</a>
</div>
))}

<div style={{ marginTop: 10, color: "#6b7280", fontSize: 13, fontWeight: 800 }}>{tl.note}</div>
</div>
);
})()}
</div>
</div>
) : null}
</div>
);
}

function PlanTripModal({ destination, originZip, tier, onClose, onItineraryChanged }) {
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [activities, setActivities] = useState([]);
const [restaurants, setRestaurants] = useState([]);
const [coupons, setCoupons] = useState([]);
const [checked, setChecked] = useState({});
const [toast, setToast] = useState("");

// Custom ideas at TOP (user enters + can checkbox/select)
const [customIdeas, setCustomIdeas] = useState([]);
const [customTitle, setCustomTitle] = useState("");
const [customLink, setCustomLink] = useState("");

const destinationName = destination?.name || "";

const drivingUrl = useMemo(() => buildDrivingDirectionsUrl(originZip, destinationName), [originZip, destinationName]);
const mapUrl = useMemo(() => buildMapsSearchUrl(destinationName), [destinationName]);
const flightsUrl = useMemo(() => buildFlightsUrl(destinationName), [destinationName]);
const hotelsUrl = useMemo(() => buildHotelsUrl(destinationName), [destinationName]);

async function loadIdeas() {
setLoading(true);
setError("");
setToast("");

try {
const res = await fetch("/api/places", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
destinationName,
destination: {
name: destinationName,
lat: destination?.lat ?? null,
lon: destination?.lon ?? null,
country: destination?.country ?? null,
},
lat: destination?.lat ?? null,
lon: destination?.lon ?? null,
country: destination?.country ?? null,
}),
});

if (!res.ok) {
const txt = await res.text();
throw new Error(txt || "Failed to fetch");
}

const data = await res.json();

setActivities(Array.isArray(data?.activities) ? data.activities : []);
setRestaurants(Array.isArray(data?.restaurants) ? data.restaurants : []);
setCoupons(Array.isArray(data?.coupons) ? data.coupons : []);
setChecked({});
} catch (e) {
setError(e?.message || "Failed to fetch");
setActivities([]);
setRestaurants([]);
setCoupons([]);
setChecked({});
} finally {
setLoading(false);
}
}

useEffect(() => {
if (!destinationName) return;
loadIdeas();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [destinationName]);

function toggle(itemKey) {
setChecked((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
}

function normalizeUrlMaybe(url) {
const u = String(url || "").trim();
if (!u) return "";
if (u.startsWith("http://") || u.startsWith("https://")) return u;
return "https://" + u;
}

function addCustomIdeaToList() {
setToast("");

const title = String(customTitle || "").trim();
if (!title) {
setToast("Type an idea first.");
return;
}

const url = normalizeUrlMaybe(customLink);
const item = {
type: "coupon",
title,
url: url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}`,
source: "Custom idea",
};

// Add to local list at top + auto-check it
setCustomIdeas((prev) => [item, ...prev].slice(0, 10));
const k = `u:${item.url || item.title}`;
setChecked((prev) => ({ ...prev, [k]: true }));

setCustomTitle("");
setCustomLink("");
setToast("Added. Check it and click 'Add Selected to Itinerary'.");
}

function addSelectedToItinerary() {
setToast("");

if (!tierAllowsItinerary(tier)) {
setToast("Upgrade to Plus to save itineraries.");
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
const k = `c:${c.url || c.title}`;
if (checked[k]) selected.push({ type: "coupon", ...c });
}

// custom ideas list (at top)
for (const u of customIdeas) {
const k = `u:${u.url || u.title}`;
if (checked[k]) selected.push({ type: "coupon", ...u });
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
}

return (
<div
style={{
position: "fixed",
inset: 0,
background: "rgba(0,0,0,0.25)",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: 20,
zIndex: 9999,
}}
>
<div
style={{
width: "min(920px, 96vw)",
maxHeight: "85vh",
overflow: "auto",
background: "white",
borderRadius: 14,
border: "1px solid #d1d5db",
padding: 18,
position: "relative",
}}
>
<button
onClick={onClose}
style={{
position: "absolute",
top: 12,
right: 12,
border: "1px solid #d1d5db",
background: "white",
borderRadius: 10,
padding: "6px 10px",
cursor: "pointer",
fontWeight: 900,
}}
>
✕
</button>

<div style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
Plan Your Trip: {destinationName || "Destination"}
</div>

<div style={{ marginBottom: 10, color: "#6b7280", fontWeight: 800 }}>
Links open in a new tab.
</div>

<div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 10 }}>
<a href={drivingUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}>
Driving directions (from ZIP)
</a>
<a href={mapUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}>
Open destination map
</a>
<a href={flightsUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}>
Flights
</a>
<a href={hotelsUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}>
Hotels
</a>
</div>

{error ? <div style={{ color: "crimson", fontWeight: 900, marginBottom: 10 }}>{error}</div> : null}

{/* ✅ Custom idea box AT TOP */}
<div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fafafa" }}>
<div style={{ fontSize: 18, fontWeight: 900 }}>➕ Add your own idea</div>
<div style={{ color: "#6b7280", fontWeight: 800, marginTop: 4 }}>
Not seeing what you want? Add an activity/restaurant idea (optional link). Then check it and save.
</div>

<div
style={{
display: "grid",
gridTemplateColumns: "1fr 1fr auto",
gap: 10,
marginTop: 10,
alignItems: "end",
}}
>
<div>
<label style={{ display: "block", fontWeight: 900, marginBottom: 6 }}>Idea</label>
<input
value={customTitle}
onChange={(e) => setCustomTitle(e.target.value)}
placeholder='e.g., "Broadway show" or "Pizza tour"'
style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 12px" }}
/>
</div>

<div>
<label style={{ display: "block", fontWeight: 900, marginBottom: 6 }}>Link (optional)</label>
<input
value={customLink}
onChange={(e) => setCustomLink(e.target.value)}
placeholder='e.g., "https://example.com"'
style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 12px" }}
/>
</div>

<button
onClick={addCustomIdeaToList}
style={{
background: "#111827",
color: "white",
border: "none",
borderRadius: 10,
padding: "10px 14px",
cursor: "pointer",
fontWeight: 900,
height: 42,
}}
title="Adds your idea to the list (check it to save)"
>
Add
</button>
</div>

{customIdeas.length ? (
<div style={{ marginTop: 10 }}>
<div style={{ fontWeight: 900, marginBottom: 6 }}>Your ideas</div>
{customIdeas.map((u, idx) => {
const key = `u:${u.url || u.title}`;
return (
<label
key={`${key}-${idx}`}
style={{
display: "grid",
gridTemplateColumns: "22px 1fr",
gap: 10,
padding: "6px 0",
alignItems: "start",
}}
>
<input
type="checkbox"
checked={!!checked[key]}
onChange={() => toggle(key)}
style={{ marginTop: 4 }}
/>
<div>
<a href={u.url} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}>
{u.title}
</a>
<div style={{ color: "#6b7280", fontWeight: 800 }}>Custom idea</div>
</div>
</label>
);
})}
</div>
) : null}
</div>

{toast ? (
<div style={{ marginTop: 10, color: "#111827", fontWeight: 900, background: "#eef2ff", padding: 10, borderRadius: 10 }}>
{toast}
</div>
) : null}

{/* Activities */}
<div style={{ marginTop: 14 }}>
<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
<div style={{ fontSize: 18, fontWeight: 900 }}>⭐ Activities</div>
{loading ? <div style={{ color: "#6b7280" }}>Loading…</div> : null}
</div>

{activities.length === 0 && !loading ? <div style={{ color: "#374151", marginTop: 6 }}>No activities returned.</div> : null}

{activities.map((a) => {
const placeId = a.placeId || a.place_id || "";
const key = `a:${placeId || a.name}`;
const url =
a.mapsUrl ||
a.url ||
(placeId
? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}`
: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.name || "")}`);

return (
<label
key={key}
style={{
display: "grid",
gridTemplateColumns: "22px 1fr",
gap: 10,
padding: "6px 0",
alignItems: "start",
}}
>
<input type="checkbox" checked={!!checked[key]} onChange={() => toggle(key)} style={{ marginTop: 4 }} />
<div>
<a href={url} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}>
{a.name || "Activity"}
</a>
{a.rating != null ? <div style={{ color: "#6b7280", fontWeight: 800 }}>⭐ {a.rating}</div> : null}
{a.address ? <div style={{ color: "#374151" }}>{a.address}</div> : null}
</div>
</label>
);
})}
</div>

{/* Restaurants */}
<div style={{ marginTop: 18 }}>
<div style={{ fontSize: 18, fontWeight: 900 }}>🍽️ Restaurants</div>

{restaurants.length === 0 && !loading ? <div style={{ color: "#374151", marginTop: 6 }}>No restaurants returned.</div> : null}

{restaurants.map((r) => {
const placeId = r.placeId || r.place_id || "";
const key = `r:${placeId || r.name}`;
const url =
r.mapsUrl ||
r.url ||
(placeId
? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}`
: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name || "")}`);

return (
<label
key={key}
style={{
display: "grid",
gridTemplateColumns: "22px 1fr",
gap: 10,
padding: "6px 0",
alignItems: "start",
}}
>
<input type="checkbox" checked={!!checked[key]} onChange={() => toggle(key)} style={{ marginTop: 4 }} />
<div>
<a href={url} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}>
{r.name || "Restaurant"}
</a>
{r.rating != null ? <div style={{ color: "#6b7280", fontWeight: 800 }}>⭐ {r.rating}</div> : null}
{r.address ? <div style={{ color: "#374151" }}>{r.address}</div> : null}
</div>
</label>
);
})}
</div>

{/* Coupons */}
<div style={{ marginTop: 18 }}>
<div style={{ fontSize: 18, fontWeight: 900 }}>🏷️ Coupons & Deals</div>

{coupons.length === 0 && !loading ? (
<div style={{ color: "#374151", marginTop: 6 }}>No deals returned yet. (We’ll wire this up later.)</div>
) : null}

{coupons.map((c, idx) => {
const key = `c:${c.url || c.title || idx}`;
return (
<label
key={key}
style={{
display: "grid",
gridTemplateColumns: "22px 1fr",
gap: 10,
padding: "6px 0",
alignItems: "start",
}}
>
<input type="checkbox" checked={!!checked[key]} onChange={() => toggle(key)} style={{ marginTop: 4 }} />
<div>
<a href={c.url} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}>
{c.title || "Deal"}
</a>
{c.source ? <div style={{ color: "#6b7280", fontWeight: 800 }}>Source: {c.source}</div> : null}
</div>
</label>
);
})}
</div>

{/* Footer buttons */}
<div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18, flexWrap: "wrap" }}>
<button
onClick={onClose}
style={{
border: "1px solid #d1d5db",
background: "white",
borderRadius: 10,
padding: "10px 14px",
cursor: "pointer",
fontWeight: 900,
}}
>
Close
</button>

<button
onClick={addSelectedToItinerary}
style={{
background: "#1d4ed8",
color: "white",
border: "none",
borderRadius: 10,
padding: "10px 14px",
cursor: "pointer",
fontWeight: 900,
}}
>
Add Selected to Itinerary
</button>

<button
onClick={loadIdeas}
disabled={loading}
style={{
background: loading ? "#9ca3af" : "#111827",
color: "white",
border: "none",
borderRadius: 10,
padding: "10px 14px",
cursor: loading ? "not-allowed" : "pointer",
fontWeight: 900,
}}
>
Reload ideas
</button>
</div>
</div>
</div>
);
}
function EmailPreviewModal({ open, onClose, subject, body }) {
if (!open) return null;

const mailtoHref = `mailto:?subject=${encodeURIComponent(subject || "")}&body=${encodeURIComponent(body || "")}`;

return (
<div
style={{
position: "fixed",
inset: 0,
background: "rgba(0,0,0,0.25)",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: 20,
zIndex: 9999,
}}
onClick={onClose}
>
<div
style={{
width: "min(900px, 96vw)",
background: "white",
borderRadius: 14,
border: "1px solid #d1d5db",
padding: 18,
}}
onClick={(e) => e.stopPropagation()}
>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
<div style={{ fontSize: 20, fontWeight: 900 }}>Email preview</div>
<button
onClick={onClose}
style={{
border: "1px solid #d1d5db",
background: "white",
borderRadius: 10,
padding: "6px 10px",
cursor: "pointer",
fontWeight: 900,
}}
>
✕
</button>
</div>

<div style={{ marginTop: 10 }}>
<div style={{ fontWeight: 900, marginBottom: 6 }}>Subject</div>
<input
value={subject || ""}
readOnly
style={{
width: "100%",
border: "1px solid #d1d5db",
borderRadius: 10,
padding: "10px 12px",
background: "#f9fafb",
fontWeight: 800,
}}
/>
</div>

<div style={{ marginTop: 12 }}>
<div style={{ fontWeight: 900, marginBottom: 6 }}>Body (copy/paste)</div>
<textarea
value={body || ""}
readOnly
rows={14}
style={{
width: "100%",
border: "1px solid #d1d5db",
borderRadius: 10,
padding: "10px 12px",
background: "#f9fafb",
fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
fontSize: 13,
}}
/>
</div>

<div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12, flexWrap: "wrap" }}>
<a
href={mailtoHref}
style={{
display: "inline-block",
background: "#111827",
color: "white",
borderRadius: 10,
padding: "10px 14px",
fontWeight: 900,
textDecoration: "none",
}}
>
Open in Email App
</a>

<button
onClick={async () => {
try {
await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
alert("Copied email preview to clipboard.");
} catch {
alert("Could not copy. You can manually select + copy the text.");
}
}}
style={{
border: "1px solid #d1d5db",
background: "white",
borderRadius: 10,
padding: "10px 14px",
cursor: "pointer",
fontWeight: 900,
}}
>
Copy Email Text
</button>
</div>
</div>
</div>
);
}

export default function ResultsPage() {
const router = useRouter();

const [recommendations, setRecommendations] = useState([]);
const [originZip, setOriginZip] = useState("");
const [suggestions, setSuggestions] = useState([]);

const [activeDestination, setActiveDestination] = useState(null);

// pricing selection -> tier
const [tier, setTier] = useState("free");

// itinerary state (to render panel live)
const [itineraryItems, setItineraryItems] = useState([]);

// pro dates
const [tripDates, setTripDates] = useState({ startDate: "", endDate: "" });

// email preview modal
const [emailModalOpen, setEmailModalOpen] = useState(false);
const [emailPreview, setEmailPreview] = useState({ subject: "", body: "" });

// Your Google Form responder link
const feedbackFormUrl =
"https://docs.google.com/forms/d/e/1FAIpQLSe2x3uZGyIgFS2S_p9Zgr2cqZgzuz18XVbEisolcKcCgxZMZQ/viewform?usp=header";

useEffect(() => {
const recs = safeJsonParse(sessionStorage.getItem("recommendations"), []);
const oz = safeJsonParse(sessionStorage.getItem("originZip"), "");
const sug = safeJsonParse(sessionStorage.getItem("suggestions"), []);

setRecommendations(Array.isArray(recs) ? recs : []);
setOriginZip(typeof oz === "string" ? oz : "");
setSuggestions(Array.isArray(sug) ? sug : []);

// tier from pricingSelection (stored from pricing page)
const ps =
safeJsonParse(sessionStorage.getItem("pricingSelection"), null) ||
safeJsonParse(localStorage.getItem("pricingSelection"), null);

setTier(normalizeTier(ps?.tier));

// itinerary from localStorage
setItineraryItems(loadItineraryFromStorage());
}, []);

const hasRecs = recommendations && recommendations.length > 0;

const destinationNameForPro = useMemo(() => {
const first = recommendations?.[0]?.name || "";
return first;
}, [recommendations]);

function removeOneItem(it) {
const keyOf = (x) => `${x.type}:${x.placeId || x.place_id || x.url || x.title || x.name || ""}`;
const target = keyOf(it);

const existing = loadItineraryFromStorage();
const next = existing.filter((x) => keyOf(x) !== target);

saveItineraryToStorage(next);
setItineraryItems(next);
}

function clearItinerary() {
saveItineraryToStorage([]);
setItineraryItems([]);
}

async function copyShare() {
const text = itineraryToShareText(itineraryItems);
try {
await navigator.clipboard.writeText(text);
alert("Copied itinerary text to clipboard.");
} catch {
alert("Could not copy. You can select and copy manually from Email Preview.");
}
}

function openEmailPreview() {
const preview = buildEmailPreview({
tier,
tripDates,
destinationName: destinationNameForPro,
items: itineraryItems,
});
setEmailPreview(preview);
setEmailModalOpen(true);
}

return (
<div style={{ padding: 40 }}>
<div style={{ textAlign: "center", marginBottom: 18 }}>
<h1 style={{ fontSize: 34, fontWeight: 900, margin: 0 }}>Your Personalized Vacation Results ✨</h1>

<div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
<div
style={{
display: "inline-block",
padding: "8px 12px",
borderRadius: 999,
background: "#e5e7eb",
fontWeight: 900,
}}
>
Mode: {normalizeTier(tier).toUpperCase()}
</div>

<a
href={feedbackFormUrl}
target="_blank"
rel="noreferrer"
style={{
display: "inline-block",
background: "#111827",
color: "white",
padding: "10px 14px",
borderRadius: 10,
fontWeight: 900,
textDecoration: "none",
}}
>
Give Feedback (2 minutes)
</a>

<button
onClick={() => router.push("/quiz")}
style={{
background: "white",
border: "1px solid #d1d5db",
borderRadius: 10,
padding: "10px 14px",
fontWeight: 900,
cursor: "pointer",
}}
>
Retake Quiz
</button>

<button
onClick={() => router.push("/")}
style={{
background: "white",
border: "1px solid #d1d5db",
borderRadius: 10,
padding: "10px 14px",
fontWeight: 900,
cursor: "pointer",
}}
>
Back to Home
</button>
</div>
</div>

{/* Itinerary panel */}
<ItineraryPanel
tier={tier}
items={itineraryItems}
onClear={clearItinerary}
onRemoveOne={removeOneItem}
onCopyShare={copyShare}
onEmail={openEmailPreview}
tripDates={tripDates}
onTripDatesChange={setTripDates}
destinationNameForPro={destinationNameForPro}
/>

{!hasRecs ? (
<div
style={{
maxWidth: 720,
margin: "0 auto",
background: "#fff",
border: "1px solid #d1d5db",
borderRadius: 12,
padding: 16,
}}
>
<div style={{ fontWeight: 900, marginBottom: 8 }}>No recommendations found in sessionStorage.</div>
<div style={{ color: "#374151", marginBottom: 14 }}>Go back to the quiz and generate results again.</div>
<button
onClick={() => router.push("/quiz")}
style={{
background: "#1d4ed8",
color: "white",
border: "none",
borderRadius: 10,
padding: "10px 14px",
fontWeight: 900,
cursor: "pointer",
}}
>
Back to Quiz
</button>
</div>
) : (
<>
{suggestions?.length ? (
<div
style={{
maxWidth: 980,
margin: "0 auto 16px auto",
border: "1px solid #e5e7eb",
background: "#fff7ed",
borderRadius: 12,
padding: 12,
}}
>
<div style={{ fontWeight: 900, marginBottom: 6 }}>Not seeing a perfect match?</div>
{suggestions.slice(0, 3).map((s, idx) => (
<div key={idx} style={{ color: "#374151" }}>
{s?.message || ""}
</div>
))}
<div style={{ color: "#6b7280", marginTop: 8, fontSize: 13 }}>(Next step: we’ll wire re-run matching.)</div>
</div>
) : null}

<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
gap: 16,
maxWidth: 1100,
margin: "0 auto",
}}
>
{recommendations.map((d, idx) => (
<DestinationCard
key={`${d?.name || "dest"}-${idx}`}
destination={d}
originZip={originZip}
onPlanTrip={(dest) => setActiveDestination(dest)}
/>
))}
</div>
</>
)}

{activeDestination ? (
<PlanTripModal
destination={activeDestination}
originZip={originZip}
tier={tier}
onClose={() => setActiveDestination(null)}
onItineraryChanged={(merged) => setItineraryItems(Array.isArray(merged) ? merged : loadItineraryFromStorage())}
/>
) : null}

<EmailPreviewModal open={emailModalOpen} onClose={() => setEmailModalOpen(false)} subject={emailPreview.subject} body={emailPreview.body} />
</div>
);
}
