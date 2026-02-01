// app/api/places/route.js
import { NextResponse } from "next/server";

const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY;

// ---------------- helpers ----------------
function mapsPlaceUrl(placeId) {
if (!placeId) return null;
return `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}`;
}

function mapsSearchUrl(query) {
return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function normalizeStr(s) {
return String(s || "").trim();
}

function isCruiseDestination(body, name) {
const flag =
body?.destination?.isCruise === true ||
body?.isCruise === true ||
String(name || "").toLowerCase().includes("cruise");
return !!flag;
}

// A light filter to remove obvious "non-activity" results.
function filterActivities(list) {
const badWords = [
"vacation",
"tour",
"tours",
"travel",
"agency",
"charter",
"transport",
"shuttle",
"rental",
"rentals",
"limo",
"taxi",
"airbnb",
"hotel",
"resort",
"inn",
"motel",
"lodging",
];

return (Array.isArray(list) ? list : []).filter((x) => {
const hay = `${x?.name || ""} ${x?.address || ""}`.toLowerCase();
return !badWords.some((w) => hay.includes(w));
});
}

// Coupons links (MVP). Swap URLs later for your affiliate format.
function buildCoupons(destinationName) {
const q = encodeURIComponent(destinationName);

return [
{
title: "Local deals & discounts (Groupon)",
source: "Groupon",
url: `https://www.groupon.com/local/${q}`,
},
{
title: "Tours & tickets (Viator)",
source: "Viator",
url: `https://www.viator.com/searchResults/all?text=${q}`,
},
{
title: "Things to do (GetYourGuide)",
source: "GetYourGuide",
url: `https://www.getyourguide.com/s/?q=${q}`,
},
];
}

// ---------------- Google calls ----------------
async function nearbySearch({ lat, lon, type, radiusMeters = 35000, keyword }) {
const loc = `${lat},${lon}`;

let url =
"https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
`location=${encodeURIComponent(loc)}` +
`&radius=${encodeURIComponent(radiusMeters)}` +
`&type=${encodeURIComponent(type)}` +
`&key=${encodeURIComponent(GOOGLE_KEY)}`;

if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

const res = await fetch(url, { cache: "no-store" });
const data = await res.json();

const results = Array.isArray(data?.results) ? data.results : [];

return results.slice(0, 12).map((r) => ({
name: r.name,
address: r.vicinity || r.formatted_address || "",
rating: r.rating ?? null,
placeId: r.place_id,
mapsUrl:
mapsPlaceUrl(r.place_id) || mapsSearchUrl(`${r.name} ${r.vicinity || ""}`),
}));
}

async function textSearch(query) {
const url =
"https://maps.googleapis.com/maps/api/place/textsearch/json?" +
`query=${encodeURIComponent(query)}&key=${encodeURIComponent(GOOGLE_KEY)}`;

const res = await fetch(url, { cache: "no-store" });
const data = await res.json();

const results = Array.isArray(data?.results) ? data.results : [];

return results.slice(0, 12).map((r) => ({
name: r.name,
address: r.formatted_address || r.vicinity || "",
rating: r.rating ?? null,
placeId: r.place_id,
mapsUrl:
mapsPlaceUrl(r.place_id) ||
mapsSearchUrl(`${r.name} ${r.formatted_address || ""}`),
}));
}

// ---------------- handler ----------------
export async function POST(req) {
try {
if (!GOOGLE_KEY) {
return NextResponse.json(
{ error: "Missing GOOGLE_MAPS_API_KEY on server" },
{ status: 500 }
);
}

const body = await req.json().catch(() => ({}));

const destinationName =
body?.destinationName || body?.destination?.name || body?.destination || "";

const name = normalizeStr(destinationName);
if (!name) {
return NextResponse.json(
{ error: "destinationName required" },
{ status: 400 }
);
}

// ✅ CRUISE SPECIAL CASE: give an onboard-style itinerary list instead of empty Google results
if (isCruiseDestination(body, name)) {
const activities = [
{ name: "Pool deck + hot tubs", address: "Onboard", rating: null, mapsUrl: mapsSearchUrl("cruise ship pool deck") },
{ name: "Broadway-style shows / live entertainment", address: "Onboard theater", rating: null, mapsUrl: mapsSearchUrl("cruise ship shows") },
{ name: "Kids club + family activities", address: "Onboard", rating: null, mapsUrl: mapsSearchUrl("cruise kids club") },
{ name: "Casino + nightlife", address: "Onboard", rating: null, mapsUrl: mapsSearchUrl("cruise casino") },
{ name: "Shore excursions (snorkeling, beaches, tours)", address: "At ports", rating: null, mapsUrl: mapsSearchUrl("caribbean shore excursions") },
];

const restaurants = [
{ name: "Main dining room", address: "Onboard", rating: null, mapsUrl: mapsSearchUrl("cruise main dining room") },
{ name: "Buffet + casual dining", address: "Onboard", rating: null, mapsUrl: mapsSearchUrl("cruise buffet") },
{ name: "Specialty dining (steakhouse / Italian / sushi)", address: "Onboard (varies by ship)", rating: null, mapsUrl: mapsSearchUrl("cruise specialty dining") },
{ name: "Coffee / desserts", address: "Onboard", rating: null, mapsUrl: mapsSearchUrl("cruise coffee bar") },
];

const coupons = buildCoupons("Caribbean Cruise");

return NextResponse.json({
destinationName: name,
activities,
restaurants,
coupons,
});
}

// OPTIONAL: If your destination object includes lat/lon, we use Nearby Search (better)
const lat = Number(body?.destination?.lat ?? body?.lat);
const lon = Number(body?.destination?.lon ?? body?.lon);
const hasCoords = Number.isFinite(lat) && Number.isFinite(lon);

let activities = [];
let restaurants = [];

if (hasCoords) {
const [a, r] = await Promise.all([
nearbySearch({
lat,
lon,
type: "tourist_attraction",
radiusMeters: 40000,
keyword: "things to do",
}),
nearbySearch({
lat,
lon,
type: "restaurant",
radiusMeters: 25000,
keyword: "best",
}),
]);

activities = filterActivities(a);
restaurants = r;
} else {
const activitiesQuery = `top things to do in ${name}`;
const restaurantsQuery = `best restaurants in ${name}`;

const [a, r] = await Promise.all([
textSearch(activitiesQuery),
textSearch(restaurantsQuery),
]);

activities = filterActivities(a);
restaurants = r;
}

const coupons = buildCoupons(name);

return NextResponse.json({
destinationName: name,
activities,
restaurants,
coupons,
});
} catch (e) {
console.error("places route error:", e);
return NextResponse.json(
{ error: "Failed to fetch places ideas" },
{ status: 500 }
);
}
}