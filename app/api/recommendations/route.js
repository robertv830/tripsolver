// app/api/recommendations/route.js
import { NextResponse } from "next/server";
import { DESTINATIONS } from "@/lib/destinations";

const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

function haversineMiles(lat1, lon1, lat2, lon2) {
const toRad = (v) => (v * Math.PI) / 180;
const R = 3958.8;

const dLat = toRad(lat2 - lat1);
const dLon = toRad(lon2 - lon1);

const a =
Math.sin(dLat / 2) ** 2 +
Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

return 2 * R * Math.asin(Math.sqrt(a));
}

function normalizeScope(raw) {
const s = String(raw || "").toLowerCase().trim();

if (["us+intl", "us+international", "us and international", "us & international", "both", "all"].includes(s)) {
return "us+intl";
}

if (["intl-only", "international-only", "international only", "intl", "international"].includes(s)) {
return "intl-only";
}

return "us-only";
}

function getDistancePrefs(answers) {
const d = answers?.distance || {};
return {
miles: Number(d.miles) || null,
scope: normalizeScope(d.scope || "us-only"),
};
}

function isUnitedStates(country) {
const c = String(country || "").toLowerCase().trim();
return c === "us" || c === "usa" || c === "united states" || c === "united states of america";
}

async function geocodeOrigin(originQuery) {
if (!GOOGLE_KEY) return null;

const q = String(originQuery || "").trim();
if (!q) return null;

const url =
`https://maps.googleapis.com/maps/api/geocode/json?address=` +
`${encodeURIComponent(q)}&key=${encodeURIComponent(GOOGLE_KEY)}`;

const res = await fetch(url, { cache: "no-store" });
if (!res.ok) return null;

const data = await res.json();
const top = data?.results?.[0];
const loc = top?.geometry?.location;
if (!loc) return null;

return {
lat: loc.lat,
lon: loc.lng,
formattedAddress: top?.formatted_address || q,
};
}

function normalizeVacationTypes(raw) {
if (Array.isArray(raw)) {
return raw.map((x) => String(x || "").trim()).filter(Boolean);
}

const s = String(raw || "").trim();
if (!s || s.toLowerCase() === "any") return [];

return s
.split(",")
.map((x) => x.trim())
.filter(Boolean);
}

function vacationTypeKey(label) {
const s = String(label || "").toLowerCase().trim();

const map = {
theme: "themeParks",
"theme park": "themeParks",
"theme parks": "themeParks",

beach: "beach",
beaches: "beach",

culture: "cultureHistory",
history: "cultureHistory",
"culture & history": "cultureHistory",
"culture and history": "cultureHistory",

themed: "themedTowns",
"themed towns": "themedTowns",
"themed town": "themedTowns",
"themed cities & towns": "themedTowns",
"themed cities and towns": "themedTowns",

outdoors: "outdoorAdventure",
adventure: "outdoorAdventure",
"outdoor adventure": "outdoorAdventure",

family: "familyFriendly",
"family friendly": "familyFriendly",
"family-friendly": "familyFriendly",
};

return map[s] || "";
}

function getTagTypes(dest) {
return Array.isArray(dest?.tags?.types) ? dest.tags.types : [];
}

function matchesTypeByTags(dest, selectedType) {
const key = vacationTypeKey(selectedType);
const types = getTagTypes(dest).map((x) => String(x).toLowerCase().trim());

if (key === "themeParks") return types.includes("theme");
if (key === "beach") return types.includes("beach");
if (key === "cultureHistory") return types.includes("culture") || types.includes("history");
if (key === "themedTowns") return types.includes("themed");
if (key === "outdoorAdventure") return types.includes("outdoors") || types.includes("adventure");
if (key === "familyFriendly") return types.includes("family");

return false;
}

function hasAnyWeights(dest) {
const w = dest?.vacationTypeWeights || {};
return Object.values(w).some((v) => Number(v) > 0);
}

function getVacationTypeScore(dest, selectedType) {
const key = vacationTypeKey(selectedType);
if (!key) return 0;

if (hasAnyWeights(dest)) {
return Number(dest?.vacationTypeWeights?.[key] || 0);
}

return matchesTypeByTags(dest, selectedType) ? 10 : 0;
}

function getBestVacationTypeScore(dest, vacationTypes) {
if (!vacationTypes.length) return 0;
return Math.max(...vacationTypes.map((vt) => getVacationTypeScore(dest, vt)));
}

function buildCruiseDestination({ vacationTypes }) {
const keys = vacationTypes.map(vacationTypeKey);

if (keys.includes("outdoorAdventure")) {
return {
name: "Alaska Cruise",
country: "Multi",
isCruise: true,
summary: "Glaciers, wildlife, and big scenery — outdoors made easy.",
imageQuery: "alaska cruise ship glacier",
mapsUrl: "https://www.google.com/maps/search/?api=1&query=alaska+cruise",
};
}

if (keys.includes("cultureHistory") || keys.includes("themedTowns")) {
return {
name: "Mediterranean Cruise",
country: "Multi",
isCruise: true,
summary: "History, coastal cities, and iconic international ports in one trip.",
imageQuery: "mediterranean cruise ship sea",
mapsUrl: "https://www.google.com/maps/search/?api=1&query=mediterranean+cruise",
};
}

if (keys.includes("familyFriendly") || keys.includes("themeParks")) {
return {
name: "Family-Friendly Cruise",
country: "Multi",
isCruise: true,
summary: "Kid-friendly activities, pools, dining, and simple logistics.",
imageQuery: "family cruise ship deck",
mapsUrl: "https://www.google.com/maps/search/?api=1&query=family+cruise",
};
}

return {
name: "Caribbean Cruise",
country: "Multi",
isCruise: true,
summary: "Warm beaches, sea days, and easy travel planning.",
imageQuery: "caribbean cruise ship ocean",
mapsUrl: "https://www.google.com/maps/search/?api=1&query=caribbean+cruise",
};
}

function getUnsplashPhotoIdFromUrl(url) {
try {
const u = new URL(url);
const parts = u.pathname.split("/").filter(Boolean);
const last = parts[parts.length - 1] || "";
return last.split("-").pop() || "";
} catch {
return "";
}
}

async function fetchUnsplashPhotoBySourceUrl(sourceUrl) {
if (!UNSPLASH_ACCESS_KEY || !sourceUrl) return null;

const id = getUnsplashPhotoIdFromUrl(sourceUrl);
if (!id) return null;

const res = await fetch(`https://api.unsplash.com/photos/${encodeURIComponent(id)}`, {
headers: {
Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
"Accept-Version": "v1",
},
cache: "no-store",
});

if (!res.ok) return null;

const photo = await res.json();

return {
imageUrl: photo.urls?.regular || photo.urls?.small || "",
imageThumbUrl: photo.urls?.thumb || "",
imageAlt: photo.alt_description || photo.description || "",
imagePhotographer: photo.user?.name || "",
imagePhotographerUrl: photo.user?.links?.html || "",
imagePhotoUrl: photo.links?.html || sourceUrl,
};
}

async function fetchUnsplashImage(query) {
if (!UNSPLASH_ACCESS_KEY || !query) return null;

const url =
`https://api.unsplash.com/search/photos?page=1&per_page=3&orientation=landscape&query=${encodeURIComponent(query)}`;

const res = await fetch(url, {
headers: {
Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
"Accept-Version": "v1",
},
cache: "no-store",
});

if (!res.ok) return null;

const data = await res.json();
const photo = data?.results?.[0];
if (!photo) return null;

return {
imageUrl: photo.urls?.regular || photo.urls?.small || "",
imageThumbUrl: photo.urls?.thumb || "",
imageAlt: photo.alt_description || photo.description || query,
imagePhotographer: photo.user?.name || "",
imagePhotographerUrl: photo.user?.links?.html || "",
imagePhotoUrl: photo.links?.html || "",
};
}

function buildSuggestions({ resultsCount, miles }) {
const suggestions = [];

if (resultsCount === 0) {
suggestions.push({
type: "info",
message: `No strong matches found within ${miles || "your selected"} miles. Try expanding your distance or choosing another vacation type.`,
});
} else if (resultsCount < 5) {
suggestions.push({
type: "info",
message: `We found ${resultsCount} strong match${resultsCount === 1 ? "" : "es"}. Try expanding your distance for more options.`,
});
}

return suggestions;
}

export async function POST(req) {
try {
const { answers } = await req.json();
if (!answers) {
return NextResponse.json({ error: "Missing answers" }, { status: 400 });
}

const { miles, scope } = getDistancePrefs(answers);
const maxMiles = Number(miles);
const vacationTypes = normalizeVacationTypes(answers?.vacationType);

const originQuery = answers?.origin || answers?.zipCode || "";
const origin = await geocodeOrigin(originQuery);

let pool = DESTINATIONS.filter((d) => !d.isCruise);

if (scope === "us-only") {
pool = pool.filter((d) => isUnitedStates(d.country));
} else if (scope === "intl-only") {
pool = pool.filter((d) => !isUnitedStates(d.country));
}

let candidates = pool;

if (origin && Number.isFinite(maxMiles)) {
candidates = candidates.filter((d) => {
if (!Number.isFinite(d.lat) || !Number.isFinite(d.lng ?? d.lon)) return false;
const dist = haversineMiles(origin.lat, origin.lon, d.lat, d.lng ?? d.lon);
return dist <= maxMiles;
});
}

// HARD FILTER: no fallback results.
if (vacationTypes.length > 0) {
candidates = candidates.filter((d) => getBestVacationTypeScore(d, vacationTypes) >= 7);
}

const scored = candidates
.map((d) => {
const distance =
origin && Number.isFinite(d.lat) && Number.isFinite(d.lng ?? d.lon)
? Math.round(haversineMiles(origin.lat, origin.lon, d.lat, d.lng ?? d.lon))
: null;

const typeScore = getBestVacationTypeScore(d, vacationTypes);

return {
...d,
_distance: distance,
_typeScore: typeScore,
};
})
.sort((a, b) => {
// Closest strong match first.
if (a._distance != null && b._distance != null && a._distance !== b._distance) {
return a._distance - b._distance;
}

// Then stronger vacation-type match.
if (b._typeScore !== a._typeScore) return b._typeScore - a._typeScore;

// Then hidden gems.
const aHidden = a?.tags?.hiddenGem ? 1 : 0;
const bHidden = b?.tags?.hiddenGem ? 1 : 0;
if (bHidden !== aHidden) return bHidden - aHidden;

return String(a.name).localeCompare(String(b.name));
});

const RESULT_POOL_SIZE = 24;
const finalList = scored.slice(0, RESULT_POOL_SIZE);

const recommendations = await Promise.all(
finalList.map(async (d) => {
const image =
d.imageUrl
? {
imageUrl: d.imageUrl,
imageAlt: d.name,
imagePhotographer: d.imageCredit || "",
imagePhotographerUrl: d.imageSourceUrl || "",
imagePhotoUrl: d.imageSourceUrl || "",
}
: (await fetchUnsplashPhotoBySourceUrl(d.imageSourceUrl)) ||
(await fetchUnsplashImage(d.imageQuery || d.name));

const whyMatched = [];

if (d._distance != null && Number.isFinite(maxMiles)) {
whyMatched.push(`Within your ${maxMiles} mile radius (${d._distance} mi).`);
}

if (vacationTypes.length > 0) {
whyMatched.push(`Strong ${vacationTypes.join(" + ")} match (${d._typeScore}/10).`);
}

return {
name: d.name,
country: d.country || "US",
lat: d.lat ?? null,
lng: d.lng ?? d.lon ?? null,
lon: d.lng ?? d.lon ?? null,
summary: d.summary || "",
description: d.summary || "",
tags: Array.isArray(d?.tags?.types) ? d.tags.types : [],
cost: d.cost || "medium",
climate: d?.tags?.weather || d.climate || "any",
distance: d._distance,
score: d._typeScore,
recommendationTier: d._typeScore >= 9 ? "Best Match" : "Strong Match",
mapsUrl:
d.mapsUrl ||
`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.name)}`,
whyMatched,
vacationTypeWeights: d.vacationTypeWeights || {},
imageUrl: image?.imageUrl || "",
imageThumbUrl: image?.imageThumbUrl || "",
imageAlt: image?.imageAlt || d.name,
imagePhotographer: image?.imagePhotographer || d.imageCredit || "",
imagePhotographerUrl: image?.imagePhotographerUrl || d.imageSourceUrl || "",
imagePhotoUrl: image?.imagePhotoUrl || d.imageSourceUrl || "",
imageSourceUrl: d.imageSourceUrl || "",
imageCredit: d.imageCredit || "",
};
})
);

const cruiseDestination = buildCruiseDestination({ vacationTypes });
const cruiseImage = await fetchUnsplashImage(cruiseDestination.imageQuery);

const cruiseForClient = {
...cruiseDestination,
isCruise: true,
imageUrl: cruiseImage?.imageUrl || "",
imageThumbUrl: cruiseImage?.imageThumbUrl || "",
imageAlt: cruiseImage?.imageAlt || cruiseDestination.name,
imagePhotographer: cruiseImage?.imagePhotographer || "",
imagePhotographerUrl: cruiseImage?.imagePhotographerUrl || "",
imagePhotoUrl: cruiseImage?.imagePhotoUrl || "",
};

return NextResponse.json({
recommendations: [...recommendations, cruiseForClient],
originZip: String(originQuery || ""),
origin,
suggestions: buildSuggestions({
resultsCount: recommendations.length,
miles: maxMiles,
}),
scope,
});
} catch (e) {
console.error("recommendations route error:", e);
return NextResponse.json(
{ error: "Failed to generate recommendations." },
{ status: 500 }
);
}
}