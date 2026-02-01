import { NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

function mapsUrlForPlace(name, placeId) {
// Place ID link is most reliable
if (placeId) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${placeId}`;
return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
}

async function geocodeByName(name) {
const url =
`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(name)}&key=${API_KEY}`;
const res = await fetch(url);
const data = await res.json();

if (data.status !== "OK" || !data.results?.[0]?.geometry?.location) {
throw new Error(`Geocoding failed: ${data.status}`);
}

return data.results[0].geometry.location; // { lat, lng }
}

async function nearbySearch({ lat, lng, keyword }) {
// radius in meters (25km)
const radius = 25000;
const url =
`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&key=${API_KEY}`;

const res = await fetch(url);
const data = await res.json();

if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
throw new Error(`Places NearbySearch failed: ${data.status}`);
}

return (data.results || []).slice(0, 10).map((p) => ({
place_id: p.place_id,
name: p.name,
vicinity: p.vicinity || "",
mapsUrl: mapsUrlForPlace(p.name, p.place_id),
}));
}

export async function POST(req) {
try {
if (!API_KEY) {
return NextResponse.json(
{ error: "Missing GOOGLE_MAPS_API_KEY in .env.local" },
{ status: 500 }
);
}

const body = await req.json();
const name = body?.name || "";
let lat = body?.lat;
let lng = body?.lng;

// If we don't have lat/lng, geocode the destination name
if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
const loc = await geocodeByName(name);
lat = loc.lat;
lng = loc.lng;
}

const activities = await nearbySearch({ lat, lng, keyword: "tourist attractions" });
const restaurants = await nearbySearch({ lat, lng, keyword: "restaurants" });

// tag types for saving itinerary
const activitiesTagged = activities.map((x) => ({ ...x, _type: "activity" }));
const restaurantsTagged = restaurants.map((x) => ({ ...x, _type: "restaurant" }));

return NextResponse.json({
activities: activitiesTagged,
restaurants: restaurantsTagged,
});
} catch (e) {
return NextResponse.json(
{ error: e?.message || "Unknown error" },
{ status: 500 }
);
}
}
