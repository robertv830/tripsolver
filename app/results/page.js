// app/results/page.js
"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VacationTypePicker from "./VacationTypePicker";

/* ---------------- affiliate links ---------------- */

const EXPEDIA_AFFILIATE = "https://expedia.com/affiliate/L5a0NGb";
const VIATOR_AFFILIATE = "https://www.viator.com/?pid=P00276898&mcid=42383&medium=link";
const GETYOURGUIDE_AFFILIATE = "https://www.getyourguide.com?partner_id=H15MS0N&utm_medium=online_publisher";

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
return d.toLocaleDateString(undefined, {
month: "short",
day: "numeric",
year: "numeric",
});
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

function buildRentalCarsUrl(destinationName) {
const dest = destinationName ? String(destinationName).trim() : "";
return `https://www.google.com/travel/cars?q=${encodeURIComponent(dest)}`;
}

function buildExpediaAffiliateUrl(kind, destinationName) {
const dest = String(destinationName || "").trim();
const q = encodeURIComponent(dest);

if (kind === "flights") return `${EXPEDIA_AFFILIATE}?q=${q}&type=flights`;
if (kind === "hotels") return `${EXPEDIA_AFFILIATE}?q=${q}&type=hotels`;
if (kind === "cars") return `${EXPEDIA_AFFILIATE}?q=${q}&type=cars`;
if (kind === "cruise") return `${EXPEDIA_AFFILIATE}?q=${q}&type=cruise`;

return EXPEDIA_AFFILIATE;
}

function buildViatorDestinationUrl(destinationName) {
const dest = encodeURIComponent(String(destinationName || "").trim());
return `${VIATOR_AFFILIATE}&q=${dest}`;
}

function buildGetYourGuideDestinationUrl(destinationName) {
const dest = encodeURIComponent(String(destinationName || "").trim());
return `${GETYOURGUIDE_AFFILIATE}&q=${dest}`;
}

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
const tags = Array.isArray(destination?.tags)
? destination.tags
: Array.isArray(destination?.tags?.types)
? destination.tags.types
: [];
const tagStr = tags.join(" ").toLowerCase();

if (tagStr.includes("cruise")) return `${name} cruise ship`;
if (tagStr.includes("beach")) return `${name} beach`;
if (tagStr.includes("mountain")) return `${name} mountains`;
if (tagStr.includes("theme")) return `${name} theme park`;
if (tagStr.includes("culture")) return `${name} city`;
if (tagStr.includes("outdoors")) return `${name} hiking`;

return `${name} travel`;
}

function getDestinationImageSrc(destination) {
if (destination?.imageUrl) return destination.imageUrl;

const name = destination?.name || "travel";
const keyword = destination?.isCruise ? "cruise ship ocean" : guessImageKeyword(destination);
return buildUnsplashUrl(keyword) + `&sig=${hashStringToNumber(name)}`;
}

/* ---------------- itinerary storage ---------------- */

function canUseDOMStorage() {
return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function loadItineraryFromStorage() {
if (!canUseDOMStorage()) return [];
return safeJsonParse(localStorage.getItem("itinerary"), []);
}

function saveItineraryToStorage(items) {
if (!canUseDOMStorage()) return;
localStorage.setItem("itinerary", JSON.stringify(items || []));
}

function loadItineraryMeta() {
if (!canUseDOMStorage()) {
return { destinationName: "", createdAt: null, name: "" };
}
return safeJsonParse(localStorage.getItem("itineraryMeta"), {
destinationName: "",
createdAt: null,
name: "",
});
}

function saveItineraryMeta(meta) {
if (!canUseDOMStorage()) return;
localStorage.setItem("itineraryMeta", JSON.stringify(meta || {}));
}

function loadItineraryHistory() {
if (!canUseDOMStorage()) return [];
return safeJsonParse(localStorage.getItem("itineraryHistory"), []);
}

function saveItineraryHistory(list) {
if (!canUseDOMStorage()) return;
localStorage.setItem(
"itineraryHistory",
JSON.stringify(Array.isArray(list) ? list : [])
);
}

function archiveCurrentItinerary({ reason = "Saved", forceName } = {}) {
const items = loadItineraryFromStorage();
if (!Array.isArray(items) || items.length === 0) return;

const meta = loadItineraryMeta();
const history = loadItineraryHistory();

const createdAt = meta?.createdAt || new Date().toISOString();
const dest = meta?.destinationName || items?.[0]?.destinationName || "Unknown";

const name =
String(forceName || meta?.name || "").trim() ||
`${reason}: ${dest} (${new Date(createdAt).toLocaleDateString()})`;

const entry = {
id: `it_${Date.now()}`,
name,
destinationName: dest,
createdAt,
items,
};

saveItineraryHistory([entry, ...history].slice(0, 25));
}

function startNewItinerary({ destinationName = "", archive = true } = {}) {
if (archive) archiveCurrentItinerary({ reason: "Saved" });
saveItineraryToStorage([]);
saveItineraryMeta({
destinationName: destinationName || "",
createdAt: new Date().toISOString(),
name: "",
});
}

function groupItinerary(items) {
const grouped = { activity: [], restaurant: [], coupon: [] };
for (const it of items || []) {
const type = it?.type;
if (type === "activity") grouped.activity.push(it);
else if (type === "restaurant") grouped.restaurant.push(it);
else grouped.coupon.push(it);
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
bullets.push("✅ Passport/ID check");
bullets.push("✅ Hotel confirmation saved");
bullets.push("✅ Transportation booked");
bullets.push("✅ Packing reminders");
bullets.push("✅ Day-by-day trip plan");
} else if (t === "plus") {
bullets.push("✅ Saved itinerary items");
bullets.push("✅ Share with friends/family");
} else {
bullets.push("✅ Upgrade to Plus to save itineraries");
}

const shareText = itineraryToShareText(items);

const body = [
`Hi!`,
``,
`Here’s your TripSolver ${t.toUpperCase()} itinerary.`,
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
const dayLabel = startDate ? fmtDateISO(startDate) : "Day 1";

const times = ["8:00 AM", "9:30 AM", "12:00 PM", "2:00 PM", "6:30 PM", "9:00 PM"];

return {
title: `Suggested itinerary (${dayLabel})`,
rows: times.map((t, idx) => ({
time: t,
...finalItems[idx % finalItems.length],
})),
note: "TripSolver organizes your day around your saved items.",
};
}

function cardActionButtonStyle(dark = false) {
return {
display: "inline-flex",
alignItems: "center",
justifyContent: "center",
border: dark ? "1px solid #111827" : "1px solid #d1d5db",
background: dark ? "#111827" : "white",
color: dark ? "white" : "#111827",
borderRadius: 10,
padding: "8px 10px",
fontWeight: 900,
textDecoration: "none",
fontSize: 13,
minHeight: 38,
cursor: "pointer",
};
}

function normalizeVacationChoice(value) {
return String(value || "").toLowerCase().trim();
}

function getDestinationTagTypes(destination) {
return Array.isArray(destination?.tags?.types)
? destination.tags.types
: Array.isArray(destination?.tags)
? destination.tags
: [];
}

function getTypeWeight(destination, vacationType) {
if (!vacationType || vacationType === "any") return 0;

const wRaw = destination?.vacationTypeWeights?.[vacationType];
if (typeof wRaw === "number") return Math.max(0, Math.min(1, wRaw));

const tags = getDestinationTagTypes(destination).map((t) => normalizeVacationChoice(t));
const wanted = normalizeVacationChoice(vacationType);

const synonyms = {
theme: ["theme", "theme park", "theme parks"],
beach: ["beach", "beaches"],
outdoors: ["outdoors", "outdoor", "nature"],
culture: ["culture", "history", "city"],
history: ["history", "culture"],
adventure: ["adventure"],
family: ["family", "family friendly"],
relaxing: ["relaxing", "relaxed"],
themed: ["themed", "themed town", "themed towns"],
};

const values = synonyms[wanted] || [wanted];
return values.some((v) => tags.includes(v)) ? 0.8 : 0;
}

function destinationMatchesVacationType(destination, vacationType) {
return getTypeWeight(destination, vacationType) > 0.45;
}
/* ---------------- components ---------------- */

function CruiseCard({ cruise, onClick }) {
const imgSrc = useMemo(() => {
if (cruise?.imageUrl) return cruise.imageUrl;
return buildUnsplashUrl(cruise?.imageKeyword || "cruise ship ocean deck") + `&sig=${hashStringToNumber(cruise?.title || "cruise")}`;
}, [cruise]);

return (
<div
style={{
border: "2px solid #111827",
borderRadius: 12,
background: "white",
overflow: "hidden",
display: "flex",
flexDirection: "column",
minHeight: 100,
}}
>
<div style={{ width: "100%", height: 170, background: "#f3f4f6" }}>
<img
src={imgSrc}
alt={cruise?.imageAlt || cruise?.title || "Cruise"}
loading="lazy"
style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
onError={(e) => {
e.currentTarget.src = buildPicsumUrl(hashStringToNumber(cruise?.title || "cruise") + 101);
}}
/>
</div>

<div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
<div style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>
🚢 {cruise?.title || cruise?.name || "Cruise Pick"}
</div>

{cruise?.subtitle ? (
<div style={{ color: "#374151", marginBottom: 8, fontWeight: 700 }}>
{cruise.subtitle}
</div>
) : null}

{cruise?.summary ? <div style={{ color: "#374151", marginBottom: 8 }}>{cruise.summary}</div> : null}

{Array.isArray(cruise?.bullets) && cruise.bullets.length ? (
<ul style={{ margin: "0 0 12px 0", paddingLeft: 18, color: "#374151" }}>
{cruise.bullets.slice(0, 4).map((b, i) => (
<li key={i} style={{ marginBottom: 3 }}>
{b}
</li>
))}
</ul>
) : null}

{cruise?.imagePhotographer ? (
<div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>
Photo by{" "}
{cruise?.imagePhotographerUrl ? (
<a
href={cruise.imagePhotographerUrl}
target="_blank"
rel="noreferrer"
style={{ color: "#6b7280" }}
>
{cruise.imagePhotographer}
</a>
) : (
cruise.imagePhotographer
)}{" "}
on Unsplash
</div>
) : null}

<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: "auto" }}>
<a
href={buildExpediaAffiliateUrl("cruise", cruise?.title || cruise?.name || "cruise")}
target="_blank"
rel="noreferrer"
style={cardActionButtonStyle(true)}
>
Cruise Deals
</a>
<a
href={VIATOR_AFFILIATE}
target="_blank"
rel="noreferrer"
style={cardActionButtonStyle(false)}
>
Excursions
</a>
</div>

<button
onClick={onClick}
style={{
marginTop: 10,
background: "#111827",
color: "white",
border: "none",
borderRadius: 10,
padding: "11px 14px",
fontWeight: 900,
cursor: "pointer",
width: "100%",
}}
title="Opens cruise ideas in a new tab"
>
Explore Cruise Option
</button>
</div>
</div>
);
}

function DestinationCard({ destination, originZip, onPlanTrip }) {
const name = destination?.name || "Destination";
const distance = destination?.distance ?? destination?.distanceMiles ?? destination?.distance_miles;
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
minHeight: 100,
}}
>
<div style={{ width: "100%", height: 170, background: "#f3f4f6" }}>
<img
src={imgSrc}
alt={destination?.imageAlt || name}
loading="lazy"
style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
onError={(e) => {
e.currentTarget.src = buildPicsumUrl(hashStringToNumber(name) + 17);
}}
/>
</div>

<div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
<div style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>{name}</div>

{destination?.summary ? (
<div style={{ color: "#374151", marginBottom: 8 }}>{destination.summary}</div>
) : null}

{destination?.imagePhotographer ? (
<div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
Photo by{" "}
{destination?.imagePhotographerUrl ? (
<a
href={destination.imagePhotographerUrl}
target="_blank"
rel="noreferrer"
style={{ color: "#6b7280" }}
>
{destination.imagePhotographer}
</a>
) : (
destination.imagePhotographer
)}{" "}
on Unsplash
</div>
) : null}

{distance != null ? (
<div style={{ color: "#6b7280", fontWeight: 800, marginBottom: 8 }}>
📏 About {distance} mi {originZip ? `from ${originZip}` : ""}
</div>
) : null}

{Array.isArray(destination?.whyMatched) && destination.whyMatched.length ? (
<div style={{ marginBottom: 12 }}>
<div style={{ fontWeight: 900, marginBottom: 6 }}>Why this matched</div>
<ul style={{ margin: 0, paddingLeft: 18, color: "#374151" }}>
{destination.whyMatched.slice(0, 4).map((w, i) => (
<li key={i}>{w}</li>
))}
</ul>
</div>
) : null}

<div
style={{
display: "grid",
gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
gap: 8,
marginTop: "auto",
}}
>
<a
href={buildExpediaAffiliateUrl("flights", name)}
target="_blank"
rel="noreferrer"
style={cardActionButtonStyle(false)}
>
Flights
</a>
<a
href={buildExpediaAffiliateUrl("hotels", name)}
target="_blank"
rel="noreferrer"
style={cardActionButtonStyle(false)}
>
Hotels
</a>
<a
href={buildExpediaAffiliateUrl("cars", name)}
target="_blank"
rel="noreferrer"
style={cardActionButtonStyle(false)}
>
Rental Cars
</a>
<a
href={buildMapsSearchUrl(name)}
target="_blank"
rel="noreferrer"
style={cardActionButtonStyle(false)}
>
Map
</a>
</div>

<button
onClick={() => onPlanTrip(destination)}
style={{
marginTop: 10,
background: "#1d4ed8",
color: "white",
border: "none",
borderRadius: 10,
padding: "11px 14px",
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
pulse,
itineraryMeta,
onStartNewItineraryClick,
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
boxShadow: pulse ? "0 0 0 4px rgba(29,78,216,0.20)" : "none",
transition: "box-shadow 250ms ease",
}}
>
<div
style={{
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: 12,
flexWrap: "wrap",
}}
>
<div style={{ fontWeight: 900, fontSize: 16 }}>🧳 Your Itinerary</div>

<div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
<div style={{ color: "#6b7280", fontWeight: 900 }}>{total} item(s)</div>

{itineraryMeta?.destinationName ? (
<div
style={{
color: "#111827",
fontWeight: 900,
background: "#eef2ff",
padding: "6px 10px",
borderRadius: 999,
}}
>
Active: {itineraryMeta.destinationName}
</div>
) : null}

<button onClick={onStartNewItineraryClick} style={cardActionButtonStyle(false)}>
Start New Itinerary
</button>

<button onClick={onCopyShare} style={cardActionButtonStyle(false)}>
Copy Share Text
</button>

<button onClick={onEmail} style={cardActionButtonStyle(false)}>
Email Preview
</button>

<button onClick={onClear} style={cardActionButtonStyle(false)}>
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
)}

{isPro ? (
<div style={{ marginTop: 14, borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
<div style={{ fontWeight: 900, marginBottom: 6 }}>📅 Trip dates + reminders</div>

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

<div style={{ marginTop: 10, color: "#6b7280", fontSize: 13, fontWeight: 800 }}>
{tl.note}
</div>
</div>
);
})()}
</div>
</div>
) : null}
</div>
);
}
/* ---------------- PlanTripModal ---------------- */

function PlanTripModal({
destination,
originZip,
tier,
onClose,
onItineraryChanged,
onAfterSave,
}) {
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [activities, setActivities] = useState([]);
const [restaurants, setRestaurants] = useState([]);
const [coupons, setCoupons] = useState([]);
const [checked, setChecked] = useState({});
const [toast, setToast] = useState("");

const [customIdeas, setCustomIdeas] = useState([]);
const [customTitle, setCustomTitle] = useState("");
const [customLink, setCustomLink] = useState("");

const destinationName = destination?.name || "";

async function loadIdeas() {
setLoading(true);
setError("");
setToast("");

try {
const res = await fetch("/api/places", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ destinationName }),
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

function toggle(key) {
setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
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

setCustomIdeas((prev) => [item, ...prev].slice(0, 12));
const k = `u:${item.url || item.title}`;
setChecked((prev) => ({ ...prev, [k]: true }));

setCustomTitle("");
setCustomLink("");
setToast("Added. Check it and click 'Add Selected to Itinerary'.");
}

function collectSelectedItems() {
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
for (const u of customIdeas) {
const k = `u:${u.url || u.title}`;
if (checked[k]) selected.push({ type: "coupon", ...u });
}

return selected;
}

function addSelectedToItinerary() {
setToast("");

if (!tierAllowsItinerary(tier)) {
setToast("Upgrade to Plus to save itineraries.");
return;
}

const selected = collectSelectedItems();
if (selected.length === 0) {
setToast("Select at least 1 item first.");
return;
}

const existing = loadItineraryFromStorage();
const keyOf = (it) => `${it.type}:${it.placeId || it.place_id || it.url || it.title || it.name || ""}`;
const seen = new Set(existing.map(keyOf));
const merged = [...existing];

for (const it of selected) {
const withMeta = { ...it, destinationName: destinationName || it?.destinationName || "" };
const k = keyOf(withMeta);
if (!seen.has(k)) {
seen.add(k);
merged.push(withMeta);
}
}

const meta = loadItineraryMeta();
if (!meta?.destinationName) {
saveItineraryMeta({
destinationName,
createdAt: new Date().toISOString(),
name: "",
});
}

saveItineraryToStorage(merged);
if (typeof onItineraryChanged === "function") onItineraryChanged(merged);
if (typeof onAfterSave === "function") onAfterSave();
if (typeof onClose === "function") onClose();
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
width: "min(980px, 96vw)",
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

<div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
<a href={buildMapsSearchUrl(destinationName)} target="_blank" rel="noreferrer" style={cardActionButtonStyle(false)}>
Map
</a>
<a href={buildExpediaAffiliateUrl("flights", destinationName)} target="_blank" rel="noreferrer" style={cardActionButtonStyle(false)}>
Flights
</a>
<a href={buildExpediaAffiliateUrl("hotels", destinationName)} target="_blank" rel="noreferrer" style={cardActionButtonStyle(false)}>
Hotels
</a>
<a href={buildExpediaAffiliateUrl("cars", destinationName)} target="_blank" rel="noreferrer" style={cardActionButtonStyle(false)}>
Rental Cars
</a>
<a href={buildViatorDestinationUrl(destinationName)} target="_blank" rel="noreferrer" style={cardActionButtonStyle(false)}>
Viator
</a>
<a href={buildGetYourGuideDestinationUrl(destinationName)} target="_blank" rel="noreferrer" style={cardActionButtonStyle(false)}>
GetYourGuide
</a>
</div>

{error ? <div style={{ color: "crimson", fontWeight: 900, marginBottom: 10 }}>{error}</div> : null}
{toast ? <div style={{ color: "#111827", fontWeight: 900, marginBottom: 10 }}>{toast}</div> : null}

<div
style={{
border: "1px solid #e5e7eb",
borderRadius: 12,
padding: 12,
background: "#fafafa",
marginBottom: 14,
}}
>
<div style={{ fontSize: 18, fontWeight: 900 }}>➕ Add your own idea</div>
<div style={{ color: "#6b7280", fontWeight: 800, marginTop: 4 }}>
Add an activity or restaurant idea with an optional link.
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
style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 10, padding: "6px 0" }}
>
<input type="checkbox" checked={!!checked[key]} onChange={() => toggle(key)} style={{ marginTop: 4 }} />
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

<div style={{ marginTop: 14 }}>
<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
<div style={{ fontSize: 18, fontWeight: 900 }}>⭐ Activities</div>
{loading ? <div style={{ color: "#6b7280" }}>Loading…</div> : null}
</div>

{activities.length === 0 && !loading ? (
<div style={{ color: "#374151", marginTop: 6 }}>No activities returned.</div>
) : null}

{activities.map((a) => {
const placeId = a.placeId || a.place_id || "";
const key = `a:${placeId || a.name}`;
const url = buildPlaceLink(a);

return (
<label key={key} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 10, padding: "6px 0" }}>
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

<div style={{ marginTop: 18 }}>
<div style={{ fontSize: 18, fontWeight: 900 }}>🍽️ Restaurants</div>

{restaurants.length === 0 && !loading ? (
<div style={{ color: "#374151", marginTop: 6 }}>No restaurants returned.</div>
) : null}

{restaurants.map((r) => {
const placeId = r.placeId || r.place_id || "";
const key = `r:${placeId || r.name}`;
const url = buildPlaceLink(r);

return (
<label key={key} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 10, padding: "6px 0" }}>
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

<div style={{ marginTop: 18 }}>
<div style={{ fontSize: 18, fontWeight: 900 }}>🏷️ Deals</div>

{coupons.length === 0 && !loading ? (
<div style={{ color: "#374151", marginTop: 6 }}>No deals returned yet.</div>
) : null}

{coupons.map((c, idx) => {
const key = `c:${c.url || c.title || idx}`;
const link = c.url || buildMapsSearchUrl(c.title || destinationName);

return (
<label key={key} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 10, padding: "6px 0" }}>
<input type="checkbox" checked={!!checked[key]} onChange={() => toggle(key)} style={{ marginTop: 4 }} />
<div>
<a href={link} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}>
{c.title || "Deal"}
</a>
{c.source ? <div style={{ color: "#6b7280", fontWeight: 800 }}>Source: {c.source}</div> : null}
</div>
</label>
);
})}
</div>

<div style={{ display: "flex", gap: 10, justifyContent: "space-between", marginTop: 18, flexWrap: "wrap" }}>
<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
<a href={buildViatorDestinationUrl(destinationName)} target="_blank" rel="noreferrer" style={cardActionButtonStyle(false)}>
Tours on Viator
</a>
<a href={buildGetYourGuideDestinationUrl(destinationName)} target="_blank" rel="noreferrer" style={cardActionButtonStyle(false)}>
Tours on GetYourGuide
</a>
</div>

<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
<button onClick={onClose} style={cardActionButtonStyle(false)}>
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
<button onClick={onClose} style={cardActionButtonStyle(false)}>
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
<a href={mailtoHref} style={cardActionButtonStyle(true)}>
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
style={cardActionButtonStyle(false)}
>
Copy Email Text
</button>
</div>
</div>
</div>
);
}

function ResultsPageContent() {
const router = useRouter();
const searchParams = useSearchParams();

const [recommendations, setRecommendations] = useState([]);
const [originZip, setOriginZip] = useState("");
const [activeDestination, setActiveDestination] = useState(null);

const [tier, setTier] = useState("free");
const [itineraryItems, setItineraryItems] = useState([]);
const [itineraryMeta, setItineraryMeta] = useState({
destinationName: "",
createdAt: null,
name: "",
});
const [itineraryPulse, setItineraryPulse] = useState(false);

const [tripDates, setTripDates] = useState({ startDate: "", endDate: "" });

const [emailModalOpen, setEmailModalOpen] = useState(false);
const [emailPreview, setEmailPreview] = useState({ subject: "", body: "" });

const [resultsPage, setResultsPage] = useState(0);

const feedbackFormUrl =
"https://docs.google.com/forms/d/e/1FAIpQLSe2x3uZGyIgFS2S_p9Zgr2cqZgzuz18XVbEisolcKcCgxZMZQ/viewform?usp=header";

const quizAnswers = useMemo(() => {
if (typeof window === "undefined") return {};
const candidates = ["answers", "quizAnswers", "tripsolver_answers", "quizState"];
for (const k of candidates) {
const v = safeJsonParse(sessionStorage.getItem(k), null);
if (v && typeof v === "object") return v;
}
return {};
}, []);

useEffect(() => {
const recs = safeJsonParse(sessionStorage.getItem("recommendations"), []);
const oz = safeJsonParse(sessionStorage.getItem("originZip"), "");

setRecommendations(Array.isArray(recs) ? recs : []);
setOriginZip(typeof oz === "string" ? oz : "");

const ps =
safeJsonParse(sessionStorage.getItem("pricingSelection"), null) ||
safeJsonParse(localStorage.getItem("pricingSelection"), null);

setTier(normalizeTier(ps?.tier));

setItineraryItems(loadItineraryFromStorage());
const meta = loadItineraryMeta();
setItineraryMeta(meta);

if (!meta?.createdAt) {
saveItineraryMeta({
destinationName: meta?.destinationName || "",
createdAt: new Date().toISOString(),
name: "",
});
setItineraryMeta(loadItineraryMeta());
}
}, []);

const hasRecs = recommendations && recommendations.length > 0;

const destinationNameForPro = useMemo(() => {
const first = recommendations?.[0]?.name || "";
return first;
}, [recommendations]);

const vacationTypes = useMemo(() => {
const raw = searchParams?.get("vacationType") || "any";
const parts = String(raw)
.split(",")
.map((s) => s.trim())
.filter(Boolean);
const cleaned = parts.length ? parts : ["any"];
return cleaned.slice(0, 2);
}, [searchParams]);

useEffect(() => {
setResultsPage(0);
}, [vacationTypes.join("|")]);

const nonCruiseRecommendations = useMemo(() => {
const list = Array.isArray(recommendations) ? recommendations : [];
return list.filter((d) => !d?.isCruise && !normalizeVacationChoice(d?.name).includes("cruise"));
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
destinationName: itineraryMeta?.destinationName || destinationNameForPro,
items: itineraryItems,
});
setEmailPreview(preview);
setEmailModalOpen(true);
}

function scrollToItineraryAndPulse() {
setTimeout(() => {
const el = document.getElementById("itinerary-panel");
if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });

setItineraryPulse(true);
setTimeout(() => setItineraryPulse(false), 1600);
}, 50);
}

function handleStartNewItinerary({ destinationName = "", archive = true } = {}) {
startNewItinerary({ destinationName, archive });
setItineraryItems(loadItineraryFromStorage());
setItineraryMeta(loadItineraryMeta());
scrollToItineraryAndPulse();
}

function startNewItineraryFromPanel() {
const ok = window.confirm("Save your current itinerary and start a new one?");
if (!ok) return;
handleStartNewItinerary({ destinationName: "", archive: true });
}

function normalizeWeatherAnswer(weather) {
if (!weather) return "any";
const w = String(weather).toLowerCase();
if (w.includes("warm")) return "warm";
if (w.includes("cool")) return "cool";
if (w.includes("cold") || w.includes("snow")) return "cold";
return "any";
}

const cruise = useMemo(() => {
const types = vacationTypes || ["any"];
const weather = normalizeWeatherAnswer(quizAnswers?.weather);
const scope = quizAnswers?.scope || quizAnswers?.travelScope || "us+intl";

let title = "Cruise Option";
let subtitle = "A low-stress way to travel with built-in lodging and food.";
let imageKeyword = "cruise ship ocean deck";
let link = buildExpediaAffiliateUrl("cruise", "cruise");
let bullets = ["Great value for groups", "Easy planning", "Unpack once, see multiple places"];

const has = (t) => types.includes(t);

if (has("beach") && (weather === "warm" || weather === "any")) {
title = "Caribbean Cruise";
subtitle = "Warm weather + beach days with minimal planning.";
imageKeyword = "caribbean cruise ship deck";
link = buildExpediaAffiliateUrl("cruise", "caribbean cruise");
bullets = ["Warm beaches", "Relaxing sea days", "Great for couples or families"];
} else if (has("outdoors") || has("adventure") || weather === "cold" || weather === "cool") {
title = "Alaska Cruise";
subtitle = "Glaciers, wildlife, and big scenery — outdoors made easy.";
imageKeyword = "alaska cruise ship glacier";
link = buildExpediaAffiliateUrl("cruise", "alaska cruise");
bullets = ["Glaciers + wildlife", "Easy access to excursions", "Cool-weather favorite"];
} else if (has("culture") || has("history") || scope === "intl-only") {
title = "Mediterranean Cruise";
subtitle = "History + iconic cities in one trip.";
imageKeyword = "mediterranean cruise ship";
link = buildExpediaAffiliateUrl("cruise", "mediterranean cruise");
bullets = ["Culture + history", "Multiple countries", "Great for international travel"];
} else if (has("theme") || has("family")) {
title = "Family-Friendly Cruise";
subtitle = "Kid-friendly activities, pools, and simple logistics.";
imageKeyword = "family cruise ship deck";
link = buildExpediaAffiliateUrl("cruise", "family cruise");
bullets = ["Family-friendly fun", "Food included", "Easy logistics"];
} else if (has("themed")) {
title = "Northern Europe Cruise";
subtitle = "Storybook ports, charming towns, and seasonal vibes.";
imageKeyword = "northern europe cruise ship";
link = buildExpediaAffiliateUrl("cruise", "northern europe cruise");
bullets = ["Charming ports", "Great scenery", "Perfect for discovery"];
}

return { title, subtitle, bullets, link, imageKeyword, isCruise: true };
}, [vacationTypes, quizAnswers]);

const sortedDestinationPool = useMemo(() => {
const list = Array.isArray(nonCruiseRecommendations) ? nonCruiseRecommendations : [];
if (!list.length) return [];

const selected = vacationTypes.filter((t) => t && t !== "any");
if (!selected.length) return list;

const exactMatches = [];
const fallbackMatches = [];

list.forEach((d, idx) => {
const matchStrengths = selected.map((t) => getTypeWeight(d, t));
const bestWeight = Math.max(...matchStrengths, 0);
const matchCount = matchStrengths.filter((x) => x > 0.45).length;
const score = typeof d?.score === "number" ? d.score : 0;

const item = {
destination: d,
idx,
bestWeight,
matchCount,
score,
};

if (matchCount > 0) exactMatches.push(item);
else fallbackMatches.push(item);
});

exactMatches.sort((a, b) => {
if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
if (b.bestWeight !== a.bestWeight) return b.bestWeight - a.bestWeight;
if (b.score !== a.score) return b.score - a.score;
return a.idx - b.idx;
});

fallbackMatches.sort((a, b) => {
if (b.score !== a.score) return b.score - a.score;
return a.idx - b.idx;
});

return [...exactMatches, ...fallbackMatches].map((x) => x.destination);
}, [nonCruiseRecommendations, vacationTypes]);

const RESULTS_PER_PAGE = 5;
const totalPages = Math.max(1, Math.ceil(sortedDestinationPool.length / RESULTS_PER_PAGE));

useEffect(() => {
if (resultsPage > totalPages - 1) {
setResultsPage(Math.max(0, totalPages - 1));
}
}, [resultsPage, totalPages]);

const visibleDestinationCards = useMemo(() => {
const start = resultsPage * RESULTS_PER_PAGE;
return sortedDestinationPool.slice(start, start + RESULTS_PER_PAGE);
}, [sortedDestinationPool, resultsPage]);

const pageStart = sortedDestinationPool.length ? resultsPage * RESULTS_PER_PAGE + 1 : 0;
const pageEnd = Math.min((resultsPage + 1) * RESULTS_PER_PAGE, sortedDestinationPool.length);

return (
<div style={{ padding: 40 }}>
<div style={{ textAlign: "center", marginBottom: 18 }}>
<h1 style={{ fontSize: 34, fontWeight: 900, margin: 0 }}>
Your Personalized Vacation Results ✨
</h1>

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

<div id="itinerary-panel">
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
pulse={itineraryPulse}
itineraryMeta={itineraryMeta}
onStartNewItineraryClick={startNewItineraryFromPanel}
/>
</div>

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
<div style={{ fontWeight: 900, marginBottom: 8 }}>
No recommendations found in sessionStorage.
</div>
<div style={{ color: "#374151", marginBottom: 14 }}>
Go back to the quiz and generate results again.
</div>
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
<div style={{ maxWidth: 1100, margin: "0 auto 14px auto" }}>
<VacationTypePicker />
</div>

<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
gap: 16,
maxWidth: 1100,
margin: "0 auto",
}}
>
<CruiseCard
cruise={cruise}
onClick={() => {
if (cruise?.link) window.open(cruise.link, "_blank", "noreferrer");
}}
/>

{visibleDestinationCards.map((d, idx) => (
<DestinationCard
key={`${d?.name || "dest"}-${resultsPage}-${idx}`}
destination={d}
originZip={originZip}
onPlanTrip={(dest) => setActiveDestination(dest)}
/>
))}
</div>

{sortedDestinationPool.length > RESULTS_PER_PAGE ? (
<div
style={{
maxWidth: 1100,
margin: "16px auto 0 auto",
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: 12,
flexWrap: "wrap",
}}
>
<button
onClick={() => setResultsPage((p) => Math.max(0, p - 1))}
disabled={resultsPage === 0}
style={{
...cardActionButtonStyle(false),
opacity: resultsPage === 0 ? 0.5 : 1,
cursor: resultsPage === 0 ? "not-allowed" : "pointer",
}}
>
◀ Previous
</button>

<div style={{ fontWeight: 900, color: "#374151" }}>
Showing {pageStart}-{pageEnd} of {sortedDestinationPool.length} destinations • Page {resultsPage + 1} of {totalPages}
</div>

<button
onClick={() => setResultsPage((p) => Math.min(totalPages - 1, p + 1))}
disabled={resultsPage >= totalPages - 1}
style={{
...cardActionButtonStyle(false),
opacity: resultsPage >= totalPages - 1 ? 0.5 : 1,
cursor: resultsPage >= totalPages - 1 ? "not-allowed" : "pointer",
}}
>
Next ▶
</button>
</div>
) : null}
</>
)}

{activeDestination ? (
<PlanTripModal
destination={activeDestination}
originZip={originZip}
tier={tier}
onClose={() => setActiveDestination(null)}
onItineraryChanged={(merged) => {
setItineraryItems(Array.isArray(merged) ? merged : loadItineraryFromStorage());
setItineraryMeta(loadItineraryMeta());
}}
onAfterSave={scrollToItineraryAndPulse}
/>
) : null}

<EmailPreviewModal
open={emailModalOpen}
onClose={() => setEmailModalOpen(false)}
subject={emailPreview.subject}
body={emailPreview.body}
/>
</div>
);
}
export default function ResultsPage() {
return (
<Suspense
fallback={
<div
style={{
padding: 40,
textAlign: "center",
fontWeight: 900,
}}
>
Loading your vacation results…
</div>
}
>
<ResultsPageContent />
</Suspense>
);
}

