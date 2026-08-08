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
const w = String(weather).toLowerCase();
if (w.includes("warm")) return "warm";
if (w.includes("cool")) return "cool";
if (w.includes("cold") || w.includes("snow")) return "cold";
return "any";
}

function scopeAllows(destinationCountry, scope) {
// scope: "us-only" | "us+intl" | "intl-only"
if (!scope || scope === "us+intl") return true;
if (scope === "us-only") return destinationCountry === "US";
if (scope === "intl-only") return destinationCountry !== "US";
return true;
}

function norm(s) {
return String(s || "")
.toLowerCase()
.trim();
}

/**
* Q5 (the heavy preference) support:
* We don’t assume the exact key name because your quiz wiring may call it different things.
* We try a few likely keys. If none are present -> "any".
*
* IMPORTANT: This is ONLY scoring right now. We’ll hook it into /api/places for restaurant bias next.
*/
function getQ5Preference(answers) {
const a = answers || {};
const candidate =
a.q5 ??
a.question5 ??
a.food ??
a.foodPreference ??
a.foodStyle ??
a.cuisine ??
a.dining ??
a.restaurantVibe ??
a.vibe5 ??
a.preference5;

const v = norm(candidate);
if (!v) return "any";
if (v.includes("no preference") || v === "any" || v === "none") return "any";
return v;
}

/**
* Destination Q5 tags:
* We support these optional destination tag shapes (any one works):
* - dest.tags.q5 (array of strings)
* - dest.tags.food (array of strings)
* - dest.tags.vibes (array of strings)
* - dest.tags.keywords (array of strings)
* - dest.tags.q5Weights (object map: { "street food": 1, "fine dining": 0.6, ... })
*/
function scoreQ5(dest, q5Pref) {
const pref = norm(q5Pref);
if (!pref || pref === "any") return 0.5; // neutral

const t = dest?.tags || {};

// Weighted map takes priority if present
if (t.q5Weights && typeof t.q5Weights === "object") {
// Try exact key, then try normalized keys
const direct = t.q5Weights[pref];
if (typeof direct === "number") return clamp01(direct);

// Try any key that is "close" (very light fuzzy: contains)
const keys = Object.keys(t.q5Weights);
for (const k of keys) {
if (norm(k) === pref) return clamp01(t.q5Weights[k]);
}
for (const k of keys) {
if (norm(k).includes(pref) || pref.includes(norm(k))) {
const val = t.q5Weights[k];
if (typeof val === "number") return clamp01(val);
}
}
}

const list =
(Array.isArray(t.q5) ? t.q5 : null) ||
(Array.isArray(t.food) ? t.food : null) ||
(Array.isArray(t.vibes) ? t.vibes : null) ||
(Array.isArray(t.keywords) ? t.keywords : null) ||
[];

const normalized = list.map(norm).filter(Boolean);

// Exact match
if (normalized.includes(pref)) return 1;

// Light partial match: "street food" matches "street-food", "streetfood", "street"
const prefTokens = pref.split(/\s+/).filter(Boolean);
const joined = normalized.join(" | ");

// If any token appears in any tag string, give partial credit
const tokenHit = prefTokens.some((tok) => joined.includes(tok));
if (tokenHit) return 0.75;

return 0; // doesn’t match
}

function clamp01(n) {
if (Number.isNaN(n)) return 0;
if (n < 0) return 0;
if (n > 1) return 1;
return n;
}

function scoreDestination({ dest, distMiles, maxMiles, answers }) {
/**
* New ranking priorities per your request:
* 1) Distance (highest)
* 2) Question #5 (heavy, second)
* 3) Everything else = small tie-breakers
*
* NOTE: "No preference" for Q5 becomes neutral and won't reorder results.
*/
const distanceWeight = 0.65;
const q5Weight = 0.25;
const weatherWeight = 0.05;
const typeWeight = 0.04;
const paceWeight = 0.01;

let score = 0;

// Distance score (0..1)
// If maxMiles is missing, assume 300.
const m = Number(maxMiles || 300);
const d = Number(distMiles || 999999);
let distanceScore = 0;

if (d <= m) {
distanceScore = 1 - d / m; // closer is better
} else {
// outside max distance: small score so we can still fall back
distanceScore = Math.max(0, 0.15 - (d - m) / (m * 10));
}
score += distanceWeight * distanceScore;

// Q5 score (heavy)
const q5Pref = getQ5Preference(answers);
const q5Score = scoreQ5(dest, q5Pref);
score += q5Weight * q5Score;

// Weather score (small tie-breaker)
const desiredWeather = normalizeWeatherAnswer(answers?.weather);
const destWeather = dest?.tags?.weather || "any";
let weatherScore = 0;

if (desiredWeather === "any" || !desiredWeather) weatherScore = 0.5; // neutral
else if (destWeather === desiredWeather) weatherScore = 1;
else weatherScore = 0;

score += weatherWeight * weatherScore;

// Vacation type score (small tie-breaker)
// NOTE: Your new "Vacation type dropdown" is on the results page; it may not be in answers yet.
// We keep this for backwards compatibility with the quiz.
const desiredType = answers?.vacationType;
const types = Array.isArray(dest?.tags?.types) ? dest.tags.types : [];
let typeScore = 0;

if (!desiredType) typeScore = 0.5; // neutral
else typeScore = types.includes(desiredType) ? 1 : 0;

score += typeWeight * typeScore;

// Pace score (tiny tie-breaker)
const desiredPace = answers?.pace;
const pace = Array.isArray(dest?.tags?.pace) ? dest.tags.pace : [];
let paceScore = 0;

if (!desiredPace) paceScore = 0.5; // neutral
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
// answers: { weather, vacationType, pace, ... + Q5 fields }
// maxMiles: number
// scope: "us-only" | "us+intl" | "intl-only"

const baseList = (destinations || [])
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
// keep both names so existing UI doesn't break
distanceMiles: Math.round(x.distMiles),
distance: Math.round(x.distMiles),
_score: x.score, // helpful for debugging; remove later if you want
}));
}
