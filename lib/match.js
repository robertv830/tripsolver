// lib/match.js

function toRad(d) {
return (d * Math.PI) / 180;
}

// Haversine distance in miles
export function milesBetween(aLat, aLng, bLat, bLng) {
const R = 3958.7613; // earth radius miles
const dLat = toRad(bLat - aLat);
const dLng = toRad(bLng - aLng);
const lat1 = toRad(aLat);
const lat2 = toRad(bLat);

const sinDLat = Math.sin(dLat / 2);
const sinDLng = Math.sin(dLng / 2);

const h =
sinDLat * sinDLat +
Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

const c = 2 * Math.asin(Math.sqrt(h));
return R * c;
}

function normalizeWeatherAnswer(weather) {
// Your quiz uses: "Warm & Sunny", "Cool & Mild", "Cold & Snowy", "No Preference"
if (!weather) return "any";
if (weather.toLowerCase().includes("warm")) return "warm";
if (weather.toLowerCase().includes("cool")) return "cool";
if (weather.toLowerCase().includes("cold") || weather.toLowerCase().includes("snow"))
return "cold";
return "any";
}

function scopeAllows(destinationCountry, scope) {
// scope: "us-only" | "us+intl" | "intl-only"
if (!scope || scope === "us+intl") return true;
if (scope === "us-only") return destinationCountry === "US";
if (scope === "intl-only") return destinationCountry !== "US";
return true;
}

function scoreDestination({
dest,
distMiles,
maxMiles,
answers,
}) {
// Distance-first weighting:
// - distance dominates the ranking
// - then weather, then vacationType, then pace
const distanceWeight = 0.55;
const weatherWeight = 0.20;
const typeWeight = 0.20;
const paceWeight = 0.05;

let score = 0;

// Distance score (0..1)
// If maxMiles is missing, assume 300.
const m = Number(maxMiles || 300);
const d = Number(distMiles || 999999);
let distanceScore = 0;

if (d <= m) {
distanceScore = 1 - d / m; // closer is better
} else {
// If outside max distance, still give a tiny score so we can fall back gracefully
distanceScore = Math.max(0, 0.15 - (d - m) / (m * 10));
}
score += distanceWeight * distanceScore;

// Weather score
const desiredWeather = normalizeWeatherAnswer(answers.weather);
const destWeather = dest?.tags?.weather || "any";
let weatherScore = 0;

if (desiredWeather === "any" || !desiredWeather) weatherScore = 1;
else if (destWeather === desiredWeather) weatherScore = 1;
else weatherScore = 0;

score += weatherWeight * weatherScore;

// Vacation type score
const desiredType = answers.vacationType; // e.g. "Beach", "Outdoors"
const types = Array.isArray(dest?.tags?.types) ? dest.tags.types : [];
let typeScore = 0;

if (!desiredType) typeScore = 0.6;
else typeScore = types.includes(desiredType) ? 1 : 0;

score += typeWeight * typeScore;

// Pace score
const desiredPace = answers.pace; // e.g. "Slow & Relaxed"
const pace = Array.isArray(dest?.tags?.pace) ? dest.tags.pace : [];
let paceScore = 0;

if (!desiredPace) paceScore = 0.6;
else paceScore = pace.includes(desiredPace) ? 1 : 0;

score += paceWeight * paceScore;

return score;
}

export function matchDestinations({
origin,
destinations,
answers,
maxMiles,
scope,
limit = 6,
}) {
// origin: { lat, lng }
// answers: { weather, vacationType, pace, ... }
// maxMiles: number
// scope: "us-only" | "us+intl" | "intl-only"

const baseList = destinations
.filter((d) => d?.lat && d?.lng)
.filter((d) => scopeAllows(d.country, scope));

// Compute distances
const withDistance = baseList.map((d) => {
const distMiles = milesBetween(origin.lat, origin.lng, d.lat, d.lng);
return { dest: d, distMiles };
});

// Distance-first: try strict filter, then widen if needed
const m = Number(maxMiles || 300);

function pickWithin(mult) {
return withDistance.filter((x) => x.distMiles <= m * mult);
}

let candidates = pickWithin(1);
if (candidates.length < Math.min(3, limit)) candidates = pickWithin(1.5);
if (candidates.length < Math.min(3, limit)) candidates = pickWithin(2);
if (candidates.length === 0) candidates = withDistance; // final fallback

// Score + sort
const scored = candidates
.map((x) => {
const s = scoreDestination({
dest: x.dest,
distMiles: x.distMiles,
maxMiles: m,
answers,
});
return { ...x, score: s };
})
.sort((a, b) => {
// Primary sort by score, secondary by distance (closer wins ties)
if (b.score !== a.score) return b.score - a.score;
return a.distMiles - b.distMiles;
})
.slice(0, limit);

// Return as plain destinations with extra fields
return scored.map((x) => ({
...x.dest,
distanceMiles: Math.round(x.distMiles),
}));
}
