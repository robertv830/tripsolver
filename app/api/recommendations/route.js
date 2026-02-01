// app/api/recommendations/route.js
import { NextResponse } from "next/server";
import { DESTINATIONS } from "@/lib/destinations";

const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY;

// ---------- helpers ----------
function haversineMiles(lat1, lon1, lat2, lon2) {
const toRad = (v) => (v * Math.PI) / 180;
const R = 3958.8;

const dLat = toRad(lat2 - lat1);
const dLon = toRad(lon2 - lon1);

const a =
Math.sin(dLat / 2) ** 2 +
Math.cos(toRad(lat1)) *
Math.cos(toRad(lat2)) *
Math.sin(dLon / 2) ** 2;

return 2 * R * Math.asin(Math.sqrt(a));
}

function budgetTier(budgetNumber) {
const b = Number(budgetNumber);
if (!Number.isFinite(b)) return "medium";
if (b <= 1200) return "low";
if (b <= 3000) return "medium";
return "high";
}

function weatherTier(weatherAnswer) {
const w = String(weatherAnswer || "").toLowerCase();
if (w.includes("warm")) return "warm";
if (w.includes("cool")) return "cool";
if (w.includes("cold")) return "cold";
return "any";
}

// Normalize scope so UI can send different wording without breaking
function normalizeScope(raw) {
const s = String(raw || "").toLowerCase().trim();

if (
[
"us+intl",
"us+international",
"us and international",
"us & international",
"both",
"all",
"us+some intl",
].includes(s)
) {
return "us+intl";
}

if (
[
"intl-only",
"international-only",
"international only",
"intl",
"international",
].includes(s)
) {
return "intl-only";
}

return "us-only";
}

function getDistancePrefs(answers) {
const d = answers?.distance || {};
const miles = Number(d.miles) || null;
const scope = normalizeScope(d.scope || "us-only"); // us-only | us+intl | intl-only
return { miles, scope };
}

async function geocodeZip(zip) {
if (!GOOGLE_KEY) return null;
const z = String(zip || "").trim();
if (!/^\d{5}$/.test(z)) return null;

const url =
`https://maps.googleapis.com/maps/api/geocode/json?address=` +
`${encodeURIComponent(z)}&key=${GOOGLE_KEY}`;

const res = await fetch(url, { cache: "no-store" });
if (!res.ok) return null;

const data = await res.json();
const loc = data?.results?.[0]?.geometry?.location;
if (!loc) return null;

return { lat: loc.lat, lon: loc.lng };
}

// ---------- scoring ----------
function scoreDestination(dest, answers, preferredBudget, preferredWeather) {
let score = 0;

const vacationType = answers?.vacationType;
const pace = answers?.pace;
const weather = answers?.weather;

// Vacation type is strong
if (vacationType && dest.tags?.includes(vacationType)) score += 40;

// Pace & weather are medium
if (pace && dest.tags?.includes(pace)) score += 15;
if (weather && dest.tags?.includes(weather)) score += 15;

// climate normalization (soft)
if (preferredWeather !== "any") {
if (dest.climate === preferredWeather) score += 10;
else if (dest.climate !== "any") score -= 5;
}

// Budget tier (soft)
if (dest.cost === preferredBudget) score += 10;
else if (
(preferredBudget === "medium" &&
(dest.cost === "low" || dest.cost === "high")) ||
(preferredBudget === "low" && dest.cost === "medium") ||
(preferredBudget === "high" && dest.cost === "medium")
) {
score += 3;
} else {
score -= 5;
}

// Cruise handling (mostly handled by static cruise card now, but keep safe)
if (dest.isCruise && vacationType !== "Cruise") score -= 8;
if (dest.isCruise && vacationType === "Cruise") score += 12;

return score;
}

// ---------- suggestions ----------
function buildSuggestions({ resultsCount, usedStretch, answers, miles }) {
const suggestions = [];

if (resultsCount < 5) {
suggestions.push({
type: "info",
message: `We couldn’t find enough strong matches within ${miles || "your"} miles.`,
});
}

if (usedStretch) {
suggestions.push({
type: "info",
message: `We expanded your radius a bit to find better options.`,
});
}

suggestions.push({
type: "action",
message: "Want more options?",
action: "expand-200",
label: "+200 miles",
});

suggestions.push({
type: "action",
message: "",
action: "expand-400",
label: "+400 miles",
});

return suggestions.slice(0, 4);
}

// ---------- STATIC CRUISE (always last) ----------
const CRUISE_DESTINATION = {
name: "Caribbean Cruise",
country: "Multi",
isCruise: true,
lat: null,
lon: null,
cost: "medium",
climate: "warm",
tags: ["Relaxing", "Beach", "All-Inclusive"],
summary:
"A relaxing cruise with multiple destinations, dining, and entertainment onboard.",
whyMatched: [
"Cruises offer great value for the price",
"Multiple destinations with no planning stress",
"Popular choice for relaxing vacations",
],
mapsUrl:
"https://www.google.com/maps/search/?api=1&query=caribbean+cruise",
};

// ---------- handler ----------
export async function POST(req) {
try {
const { answers } = await req.json();
if (!answers) {
return NextResponse.json({ error: "Missing answers" }, { status: 400 });
}

const { miles, scope } = getDistancePrefs(answers);
const preferredBudget = budgetTier(answers?.budget);
const preferredWeather = weatherTier(answers?.weather);

// origin (zip -> lat/lon)
const originZip = answers?.zipCode || "";
const origin = await geocodeZip(originZip);

// catalog split
const allNonCruise = DESTINATIONS.filter((d) => !d.isCruise);

// scope filter
let pool = allNonCruise;
if (scope === "intl-only") {
pool = allNonCruise.filter((d) => d.country && d.country !== "US");
} else if (scope === "us-only") {
pool = allNonCruise.filter((d) => !d.country || d.country === "US");
} else {
// us+intl: keep both
pool = allNonCruise;
}

// distance filter (HARD first) - apply only when we have origin+miles
const maxMiles = Number(miles);
let strict = pool;

if (origin && Number.isFinite(maxMiles)) {
strict = pool.filter((d) => {
// If missing coords, let it pass (don’t accidentally hide it)
if (!Number.isFinite(d.lat) || !Number.isFinite(d.lon)) return true;
const dist = haversineMiles(origin.lat, origin.lon, d.lat, d.lon);
return dist <= maxMiles;
});
}

// candidates start strict
let usedStretch = false;
let candidates = strict;

// If not enough, stretch to 1.25x then 1.5x (applies to ALL scopes)
if (origin && Number.isFinite(maxMiles) && candidates.length < 5) {
const stretch125 = pool.filter((d) => {
if (!Number.isFinite(d.lat) || !Number.isFinite(d.lon)) return true;
const dist = haversineMiles(origin.lat, origin.lon, d.lat, d.lon);
return dist <= maxMiles * 1.25;
});
if (stretch125.length > candidates.length) {
candidates = stretch125;
usedStretch = true;
}
}

if (origin && Number.isFinite(maxMiles) && candidates.length < 5) {
const stretch150 = pool.filter((d) => {
if (!Number.isFinite(d.lat) || !Number.isFinite(d.lon)) return true;
const dist = haversineMiles(origin.lat, origin.lon, d.lat, d.lon);
return dist <= maxMiles * 1.5;
});
if (stretch150.length > candidates.length) {
candidates = stretch150;
usedStretch = true;
}
}

// ✅ IMPORTANT FIX #1:
// If scope is intl-only and distance removed everything, fall back to intl pool anyway
if (scope === "intl-only" && candidates.length === 0) {
candidates = pool; // already intl-only pool
usedStretch = true;
}

// score + sort
const scored = candidates
.map((d) => ({
...d,
_score: scoreDestination(d, answers, preferredBudget, preferredWeather),
}))
.sort((a, b) => b._score - a._score);

let finalList = scored.slice(0, 5);

// ✅ IMPORTANT FIX #2:
// For us+intl: ALWAYS include at least 1 intl, even if outside distance radius
if (scope === "us+intl") {
const hasIntl = finalList.some((d) => d.country && d.country !== "US");

if (!hasIntl) {
const intlPool = allNonCruise.filter(
(d) => d.country && d.country !== "US"
);

const bestIntl = intlPool
.map((d) => ({
...d,
_score: scoreDestination(d, answers, preferredBudget, preferredWeather),
}))
.sort((a, b) => b._score - a._score)[0];

if (bestIntl) {
finalList = [...finalList.slice(0, 4), bestIntl];
usedStretch = true;
}
}
}

// add distance + maps url
const recommendations = finalList.map((d) => {
let distance = null;

if (origin && Number.isFinite(d.lat) && Number.isFinite(d.lon)) {
distance = Math.round(
haversineMiles(origin.lat, origin.lon, d.lat, d.lon)
);
}

const mapsUrl =
d.mapsUrl ||
`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
d.name
)}`;

// Simple whyMatched (keep it light; UI can render it if present)
const whyMatched = [];
if (distance != null && Number.isFinite(maxMiles)) {
if (distance <= maxMiles) {
whyMatched.push(`Within your ${maxMiles} mile radius (${distance} mi).`);
} else {
whyMatched.push(`Outside your ${maxMiles} mile radius (${distance} mi).`);
}
}

if (preferredWeather !== "any" && d.climate) {
if (d.climate === preferredWeather) {
whyMatched.push(`Matches your weather preference: ${preferredWeather}.`);
}
}

if (d.cost) {
if (d.cost === preferredBudget) {
whyMatched.push(`Fits your budget range.`);
} else {
whyMatched.push(`Budget fit is approximate (${preferredBudget} preference).`);
}
}

return {
name: d.name,
country: d.country || "US",
lat: d.lat ?? null,
lon: d.lon ?? null,
summary: d.summary || "",
description: d.summary || "",
tags: d.tags || [],
cost: d.cost || "medium",
climate: d.climate || "any",
distance,
mapsUrl,
whyMatched,
};
});

const suggestions = buildSuggestions({
resultsCount: recommendations.length,
usedStretch,
answers,
miles: maxMiles,
});

// ✅ Always append cruise as last card
const finalRecommendations = [...recommendations, CRUISE_DESTINATION];

return NextResponse.json({
recommendations: finalRecommendations,
originZip,
origin,
suggestions,
scope, // helpful for debugging
});
} catch (e) {
console.error("recommendations route error:", e);
return NextResponse.json(
{ error: "Failed to generate recommendations." },
{ status: 500 }
);
}
}