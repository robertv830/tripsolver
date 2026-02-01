// components/DestinationCard.js
"use client";

import { useState } from "react";
import RecommendationModal from "@/components/RecommendationModal";

function buildDrivingDirectionsUrl(originZip, destinationName) {
const origin = originZip ? String(originZip).trim() : "";
const dest = destinationName ? String(destinationName).trim() : "";

if (!origin) {
return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
dest
)}&travelmode=driving`;
}

return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
origin
)}&destination=${encodeURIComponent(dest)}&travelmode=driving`;
}

function buildFlightsUrl(destinationName) {
const dest = destinationName ? String(destinationName).trim() : "";
return `https://www.google.com/travel/flights?q=${encodeURIComponent(dest)}`;
}

function buildHotelsUrl(destinationName) {
const dest = destinationName ? String(destinationName).trim() : "";
return `https://www.google.com/travel/hotels?q=${encodeURIComponent(dest)}`;
}

export default function DestinationCard({ destination, originZip }) {
const [open, setOpen] = useState(false);

if (!destination) return null;

const name = destination?.name || "Destination";
const summary = destination?.summary || destination?.description || "";
const image = destination?.image || "";
const isCruise = !!destination?.isCruise;

const reasons = Array.isArray(destination?.reasons) ? destination.reasons : [];
const whyText = reasons.length ? reasons.slice(0, 3).join(" • ") : "";

const directionsUrl =
destination?.mapsUrl || buildDrivingDirectionsUrl(originZip, name);

const flightsUrl = destination?.flightsUrl || buildFlightsUrl(name);
const hotelsUrl = destination?.hotelsUrl || buildHotelsUrl(name);

return (
<>
<div
style={{
background: "#fff",
borderRadius: 14,
boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
overflow: "hidden",
display: "flex",
flexDirection: "column",
}}
>
{/* Image */}
<div
style={{
width: "100%",
aspectRatio: "4 / 5",
background: "#f3f4f6",
}}
>
{image ? (
<img
src={image}
alt={name}
style={{
width: "100%",
height: "100%",
objectFit: "cover",
display: "block",
}}
loading="lazy"
/>
) : (
<div
style={{
height: "100%",
display: "flex",
alignItems: "center",
justifyContent: "center",
color: "#6b7280",
fontWeight: 700,
padding: 16,
textAlign: "center",
}}
>
{name}
</div>
)}
</div>

{/* Content */}
<div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
<div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
<h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{name}</h3>

{isCruise ? (
<span
style={{
fontSize: 12,
fontWeight: 700,
background: "#111827",
color: "white",
padding: "4px 8px",
borderRadius: 999,
height: "fit-content",
}}
>
Cruise
</span>
) : null}
</div>

{summary ? (
<p style={{ margin: 0, color: "#374151", lineHeight: 1.35 }}>{summary}</p>
) : null}

{/* WHY THIS MATCH */}
{whyText ? (
<div style={{ fontSize: 13, color: "#374151" }}>
<span style={{ fontWeight: 800 }}>Why this match:</span>{" "}
<span style={{ opacity: 0.9 }}>{whyText}</span>
</div>
) : null}

{/* Buttons */}
<div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
<a
href={directionsUrl}
target="_blank"
rel="noreferrer"
style={{
fontSize: 13,
padding: "6px 10px",
borderRadius: 10,
border: "1px solid #d1d5db",
textDecoration: "none",
color: "#111827",
background: "#f9fafb",
}}
>
Driving Directions
</a>

<a
href={flightsUrl}
target="_blank"
rel="noreferrer"
style={{
fontSize: 13,
padding: "6px 10px",
borderRadius: 10,
border: "1px solid #d1d5db",
textDecoration: "none",
color: "#111827",
background: "#f9fafb",
}}
>
Flights
</a>

<a
href={hotelsUrl}
target="_blank"
rel="noreferrer"
style={{
fontSize: 13,
padding: "6px 10px",
borderRadius: 10,
border: "1px solid #d1d5db",
textDecoration: "none",
color: "#111827",
background: "#f9fafb",
}}
>
Hotels
</a>

<button
onClick={() => setOpen(true)}
style={{
marginLeft: "auto",
background: "#2563eb",
color: "#fff",
border: "none",
padding: "8px 12px",
borderRadius: 10,
cursor: "pointer",
fontWeight: 700,
}}
>
Plan Trip
</button>
</div>
</div>
</div>

{open ? (
<RecommendationModal destination={destination} onClose={() => setOpen(false)} />
) : null}
</>
);
}
