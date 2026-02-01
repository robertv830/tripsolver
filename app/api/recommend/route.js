// app/api/recommend/route.js
import { NextResponse } from "next/server";

// ---------- Google Places (New) helpers ----------
const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;

async function placesSearchText(query) {
if (!GOOGLE_KEY) return null;

const url = "https://places.googleapis.com/v1/places:searchText";
const body = {
textQuery: query,
languageCode: "en",
maxResultCount: 1,
};

const res = await fetch(url, {
method: "POST",
headers: {
"Content-Type": "application/json",
"X-Goog-Api-Key": GOOGLE_KEY,
// Ask for only what we need
"X-Goog-FieldMask":
"places.id,places.displayName,places.formattedAddress,places.location,places.photos,places.googleMapsUri",
},
body: JSON.stringify(body),
});

if (!res.ok) return null;
const data = await res.json();
const place = data?.places?.[0];
return place || null;
}

function placePhotoUrl(photoName, { maxHeightPx = 1200, maxWidthPx = 900 } = {}) {
if (!GOOGLE_KEY || !photoName) return null;
// New Places API photo media endpoint
return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=${maxHeightPx}&maxWidthPx=${maxWidthPx}&key=${GOOGLE_KEY}`;
}

// ---------- Small seed catalog ----------
const CATALOG = [
{
name: "Orlando, Florida",
country: "US",
lat: 28.5383,
lon: -81.3792,
tags: ["Theme Park", "Family", "Warm & Sunny", "Fast-Paced & Exciting"],
summary:
"Theme-park capital with nonstop family fun, shows, and warm weather — perfect for a high-energy trip.",
},
{
name: "San Diego, California",
country: "US",
lat: 32.7157,
lon: -117.1611,
tags: ["Beach", "Relaxing", "Warm & Sunny", "A Mix of Both"],
summary:
"Easy coastal vibe with beaches, great food, and plenty of outdoor time — relaxing without feeling sleepy.",
},
{
name: "New York City, NY",
country: "US",
lat: 40.7128,
lon: -74.006,
tags: ["City", "Culture & History", "Fast-Paced & Exciting"],
summary:
"Big-city energy with iconic sights, museums, shows, and neighborhoods — perfect for a fast-paced itinerary.",
},
{
name: "Alaskan Cruise",
country: "US",
isCruise: true,
tags: ["Cruise", "Adventure", "Relaxing", "Outdoors", "Cool & Mild"],
summary:
"Epic scenery, glaciers, and wildlife with the comfort of a floating hotel — adventurous but easy to plan.",
},
{
name: "London, UK",
country: "UK",
lat: 51.5072,
lon: -0.1276,
tags: ["City", "Culture & History", "A Mix of Both", "Cool & Mild"],
summary:
"A classic international city break: museums, historic neighborhoods, and day-trip options — easy to fill a week.",
},
{
name: "Cancún, Mexico",
country: "MX",
lat: 21.1619,
lon: -86.8515,
tags: ["Beach", "Relaxing", "Warm & Sunny", "Resort"],
summary:
"Warm beaches, crystal water, and easy resort living — perfect for a stress-free international escape.",
},
];

// ---------- Basic scoring ----------
function scoreDestination(dest, answers) {
let score = 0;

const vacationType = answers?.vacationType || answers?.vacation_type;
const pace = answers?.pace;
const weather = answers?.weather;
const lodging = answers?.lodging;

if (vacationType && dest.tags?.includes(vacationType)) score += 4;
if (pace && dest.tags?.includes(pace)) score += 2;
if (weather && dest.tags?.includes(weather)) score += 2;

if (lodging && lodging.toLowerCase().includes("resort") && dest.tags?.includes("Resort")) {
score += 1;
}

if (vacationType === "Cruise" && dest.tags?.includes("Cruise")) score += 3;
if (vacationType !== "Cruise" && dest.tags?.includes("Cruise")) score -= 1;

return score;
}

// ---------- Pull distance scope + miles from quiz ----------
function getDistancePrefs(answers) {
const d = answers?.distance || {};
const miles = Number(d.miles) || Number(d.maxMiles) || Number(answers?.maxMiles) || null;
const scope = d.scope || answers?.scope || "us-only";
return { miles, scope };
}

export async function POST(req) {
try {
const answers = await req.json();
const { scope } = getDistancePrefs(answers);

const cruises = CATALOG.filter((d) => d.isCruise);
const nonCruise = CATALOG.filter((d) => !d.isCruise);

// Apply scope
let pool = nonCruise;
if (scope === "intl-only") {
pool = nonCruise.filter((d) => d.country && d.country !== "US");
} else if (scope === "us+intl") {
pool = nonCruise;
} else {
pool = nonCruise.filter((d) => !d.country || d.country === "US");
}

// Score + sort
const scored = pool
.map((d) => ({ ...d, _score: scoreDestination(d, answers) }))
.sort((a, b) => b._score - a._score);

const TOTAL_NON_CRUISE = 5;
let finalNonCruise = scored.slice(0, TOTAL_NON_CRUISE);

// Force at least 1 international if us+intl
if (scope === "us+intl") {
const hasIntl = finalNonCruise.some((d) => d.country && d.country !== "US");
if (!hasIntl) {
const intlCandidate = scored.find((d) => d.country && d.country !== "US");
if (intlCandidate) {
finalNonCruise = [...finalNonCruise.slice(0, TOTAL_NON_CRUISE - 1), intlCandidate];
}
}
}

// Enrich with Google Places photo + maps link (fast: 1 request per destination)
const enriched = await Promise.all(
finalNonCruise.map(async (d) => {
// Always give flights/hotels search links
const flightsUrl = `https://www.google.com/search?q=${encodeURIComponent(`flights to ${d.name}`)}`;
const hotelsUrl = `https://www.google.com/search?q=${encodeURIComponent(`hotels in ${d.name}`)}`;

let image = d.image || null;
let mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.name)}`;

if (GOOGLE_KEY) {
const place = await placesSearchText(d.name);
if (place?.photos?.[0]?.name) {
image = placePhotoUrl(place.photos[0].name) || image;
}
if (place?.googleMapsUri) {
mapUrl = place.googleMapsUri;
}
}

return {
name: d.name,
country: d.country || "US",
isCruise: !!d.isCruise,
summary: d.summary,
image,
mapUrl,
flightsUrl,
hotelsUrl,
lat: d.lat ?? null,
lon: d.lon ?? null,
};
})
);

// Add cruise card(s) at end
const final = [
...enriched,
...cruises.map((c) => ({
name: c.name,
country: c.country || "US",
isCruise: true,
summary: c.summary,
image: null, // cruises can be image-less for now; we can add later
mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name)}`,
flightsUrl: `https://www.google.com/search?q=${encodeURIComponent(`flights for ${c.name}`)}`,
hotelsUrl: `https://www.google.com/search?q=${encodeURIComponent(`${c.name} deals`)}`,
lat: null,
lon: null,
})),
];

return NextResponse.json({ recommendations: final });
} catch (err) {
console.error("recommend route error:", err);
return NextResponse.json({ error: "Failed to generate recommendations." }, { status: 500 });
}
}