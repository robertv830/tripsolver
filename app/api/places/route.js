// app/api/places/route.js
import { NextResponse } from "next/server";

const GOOGLE_KEY =
process.env.GOOGLE_PLACES_API_KEY ||
process.env.GOOGLE_MAPS_API_KEY;

// ---------------- helpers ----------------

function mapsPlaceUrl(placeId) {
if (!placeId) return null;

return `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(
placeId
)}`;
}

function mapsSearchUrl(query) {
return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
query
)}`;
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

function filterActivities(list) {
const badWords = [
"vacation",
"travel agency",
"travel agencies",
"charter",
"transport",
"shuttle",
"rental car",
"car rental",
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

function normalizeGooglePlace(r) {
return {
name: r?.name || "Place",
address: r?.vicinity || r?.formatted_address || "",
rating: r?.rating ?? null,
placeId: r?.place_id || "",
mapsUrl:
mapsPlaceUrl(r?.place_id) ||
mapsSearchUrl(
`${r?.name || ""} ${r?.vicinity || r?.formatted_address || ""}`
),
};
}

function checkGoogleResponse(data, label) {
const status = String(data?.status || "").trim();

if (!status) {
throw new Error(`${label}: Google returned no status.`);
}

if (status === "OK") return;

if (status === "ZERO_RESULTS") return;

const errorMessage = data?.error_message
? ` ${data.error_message}`
: "";

throw new Error(`${label}: Google Places returned ${status}.${errorMessage}`);
}

// ---------------- Google calls ----------------

async function nearbySearch({
lat,
lon,
type,
radiusMeters = 35000,
keyword,
}) {
const loc = `${lat},${lon}`;

let url =
"https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
`location=${encodeURIComponent(loc)}` +
`&radius=${encodeURIComponent(radiusMeters)}` +
`&type=${encodeURIComponent(type)}` +
`&key=${encodeURIComponent(GOOGLE_KEY)}`;

if (keyword) {
url += `&keyword=${encodeURIComponent(keyword)}`;
}

const res = await fetch(url, {
cache: "no-store",
});

if (!res.ok) {
throw new Error(
`Nearby Search HTTP error: ${res.status} ${res.statusText}`
);
}

const data = await res.json();

checkGoogleResponse(data, `Nearby Search (${type})`);

const results = Array.isArray(data?.results)
? data.results
: [];

return results
.slice(0, 12)
.map(normalizeGooglePlace);
}

async function textSearch(query) {
const url =
"https://maps.googleapis.com/maps/api/place/textsearch/json?" +
`query=${encodeURIComponent(query)}` +
`&key=${encodeURIComponent(GOOGLE_KEY)}`;

const res = await fetch(url, {
cache: "no-store",
});

if (!res.ok) {
throw new Error(
`Text Search HTTP error: ${res.status} ${res.statusText}`
);
}

const data = await res.json();

checkGoogleResponse(data, `Text Search (${query})`);

const results = Array.isArray(data?.results)
? data.results
: [];

return results
.slice(0, 12)
.map(normalizeGooglePlace);
}

// ---------------- handler ----------------

export async function POST(req) {
try {
if (!GOOGLE_KEY) {
return NextResponse.json(
{
error:
"Missing GOOGLE_PLACES_API_KEY or GOOGLE_MAPS_API_KEY on server.",
},
{ status: 500 }
);
}

const body = await req.json().catch(() => ({}));

const destinationName =
body?.destinationName ||
body?.destination?.name ||
body?.destination ||
"";

const name = normalizeStr(destinationName);

if (!name) {
return NextResponse.json(
{ error: "destinationName required" },
{ status: 400 }
);
}

// ---------------- cruise special case ----------------

if (isCruiseDestination(body, name)) {
const activities = [
{
name: "Pool deck + hot tubs",
address: "Onboard",
rating: null,
mapsUrl: mapsSearchUrl("cruise ship pool deck"),
},
{
name: "Live shows and entertainment",
address: "Onboard theater",
rating: null,
mapsUrl: mapsSearchUrl("cruise ship live entertainment"),
},
{
name: "Kids club + family activities",
address: "Onboard",
rating: null,
mapsUrl: mapsSearchUrl("cruise kids club"),
},
{
name: "Casino + nightlife",
address: "Onboard",
rating: null,
mapsUrl: mapsSearchUrl("cruise casino"),
},
{
name: "Shore excursions",
address: "At ports",
rating: null,
mapsUrl: mapsSearchUrl(`${name} shore excursions`),
},
];

const restaurants = [
{
name: "Main dining room",
address: "Onboard",
rating: null,
mapsUrl: mapsSearchUrl("cruise main dining room"),
},
{
name: "Buffet + casual dining",
address: "Onboard",
rating: null,
mapsUrl: mapsSearchUrl("cruise buffet"),
},
{
name: "Specialty dining",
address: "Onboard — varies by ship",
rating: null,
mapsUrl: mapsSearchUrl("cruise specialty dining"),
},
{
name: "Coffee + desserts",
address: "Onboard",
rating: null,
mapsUrl: mapsSearchUrl("cruise coffee dessert"),
},
];

return NextResponse.json({
destinationName: name,
activities,
restaurants,
coupons: buildCoupons(name),
debug: {
source: "cruise-static",
},
});
}

// ---------------- destination search ----------------

const lat = Number(
body?.destination?.lat ??
body?.lat
);

const lon = Number(
body?.destination?.lon ??
body?.destination?.lng ??
body?.lon ??
body?.lng
);

const hasCoords =
Number.isFinite(lat) &&
Number.isFinite(lon);

let activities = [];
let restaurants = [];

if (hasCoords) {
const [activityResults, restaurantResults] =
await Promise.all([
nearbySearch({
lat,
lon,
type: "tourist_attraction",
radiusMeters: 40000,
keyword: "attractions museums parks things to do",
}),
nearbySearch({
lat,
lon,
type: "restaurant",
radiusMeters: 25000,
keyword: "restaurants",
}),
]);

activities =
filterActivities(activityResults)
.slice(0, 10);

restaurants =
restaurantResults
.slice(0, 10);
} else {
const activitiesQuery =
`top attractions museums parks things to do in ${name}`;

const restaurantsQuery =
`best restaurants in ${name}`;

const [activityResults, restaurantResults] =
await Promise.all([
textSearch(activitiesQuery),
textSearch(restaurantsQuery),
]);

activities =
filterActivities(activityResults)
.slice(0, 10);

restaurants =
restaurantResults
.slice(0, 10);
}

return NextResponse.json({
destinationName: name,
activities,
restaurants,
coupons: buildCoupons(name),
debug: {
source: hasCoords
? "google-nearby-search"
: "google-text-search",
activityCount: activities.length,
restaurantCount: restaurants.length,
},
});
} catch (e) {
console.error("places route error:", e);

return NextResponse.json(
{
error:
e?.message ||
"Failed to fetch places ideas.",
},
{ status: 500 }
);
}
}

