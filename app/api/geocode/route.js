// app/api/geocode/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
try {
const body = await req.json();
const query = (body?.query || "").trim();

if (!query) {
return NextResponse.json(
{ ok: false, error: "Missing query" },
{ status: 400 }
);
}

const key =
process.env.GOOGLE_MAPS_API_KEY ||
process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!key) {
return NextResponse.json(
{ ok: false, error: "Missing Google Maps API key" },
{ status: 500 }
);
}

const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
query
)}&key=${encodeURIComponent(key)}`;

const resp = await fetch(url, { method: "GET" });
const data = await resp.json();

if (data?.status !== "OK") {
return NextResponse.json(
{ ok: false, error: data?.error_message || `Geocode error: ${data?.status}` },
{ status: 500 }
);
}

const top = data?.results?.[0];
const loc = top?.geometry?.location;

if (!loc || typeof loc.lat !== "number" || typeof loc.lng !== "number") {
return NextResponse.json(
{ ok: false, error: "No coordinates found" },
{ status: 500 }
);
}

return NextResponse.json({
ok: true,
lat: loc.lat,
lon: loc.lng,
formattedAddress: top?.formatted_address || query,
});
} catch (e) {
return NextResponse.json(
{ ok: false, error: "Server error geocoding destination" },
{ status: 500 }
);
}
}
