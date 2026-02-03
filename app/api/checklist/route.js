// app/api/checklist/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;

// ---------- Places API helpers ----------
async function placesSearchText(query) {
if (!GOOGLE_KEY) return null;

const url = "https://places.googleapis.com/v1/places:searchText";
const body = { textQuery: query, languageCode: "en", maxResultCount: 1 };

const res = await fetch(url, {
method: "POST",
headers: {
"Content-Type": "application/json",
"X-Goog-Api-Key": GOOGLE_KEY,
"X-Goog-FieldMask": "places.location,places.googleMapsUri,places.displayName",
},
body: JSON.stringify(body),
});

if (!res.ok) return null;
const data = await res.json();
return data?.places?.[0] || null;
}

async function placesNearby({ lat, lon, type, max = 8 }) {
if (!GOOGLE_KEY) return [];

const url = "https://places.googleapis.com/v1/places:searchNearby";
const body = {
includedTypes: [type],
maxResultCount: max,
locationRestriction: {
circle: {
center: { latitude: lat, longitude: lon },
radius: 10000, // 10km
},
},
languageCode: "en",
};

const res = await fetch(url, {
method: "POST",
headers: {
"Content-Type": "application/json",
"X-Goog-Api-Key": GOOGLE_KEY,
"X-Goog-FieldMask":
"places.displayName,places.googleMapsUri,places.websiteUri,places.editorialSummary",
},
body: JSON.stringify(body),
});

if (!res.ok) return [];
const data = await res.json();
return Array.isArray(data?.places) ? data.places : [];
}

function normalizePlaceItem(p) {
const name = p?.displayName?.text || "Unknown";
const url = p?.websiteUri || p?.googleMapsUri || "";
const description = p?.editorialSummary?.text
? p.editorialSummary.text.slice(0, 120)
: "";

return { name, url, description };
}

// ---------- AI fallback helpers ----------
function stripCodeFences(text) {
return String(text || "")
.replace(/```json/gi, "")
.replace(/```/g, "")
.trim();
}

function safeJsonParse(text) {
try {
return JSON.parse(text);
} catch {
return null;
}
}

export async function POST(req) {
try {
const body = await req.json();
const destination = String(body?.destination || "").trim();

if (!destination) {
return NextResponse.json({ error: "Destination is required" }, { status: 400 });
}

// ✅ Preferred path: Google Places (real places)
if (GOOGLE_KEY) {
const place = await placesSearchText(destination);

const lat = place?.location?.latitude;
const lon = place?.location?.longitude;

if (typeof lat === "number" && typeof lon === "number") {
const activitiesRaw = await placesNearby({
lat,
lon,
type: "tourist_attraction",
max: 8,
});

const restaurantsRaw = await placesNearby({
lat,
lon,
type: "restaurant",
max: 8,
});

const activities = activitiesRaw.map(normalizePlaceItem).filter((x) => x.url);
const restaurants = restaurantsRaw.map(normalizePlaceItem).filter((x) => x.url);

const coupons = [
{
name: `${destination} attraction passes / bundles`,
description: "Search passes and bundles you can compare quickly.",
url: `https://www.google.com/search?q=${encodeURIComponent(
`${destination} attraction pass`
)}`,
},
{
name: `${destination} discounts / deals`,
description: "Search current local deals and city passes.",
url: `https://www.google.com/search?q=${encodeURIComponent(
`${destination} deals discount tickets`
)}`,
},
];

return NextResponse.json({ activities, restaurants, coupons });
}
}

// ✅ Fallback: OpenAI ONLY if needed
const openaiKey = process.env.OPENAI_API_KEY;
if (!openaiKey) {
return NextResponse.json(
{ error: "Missing OPENAI_API_KEY on server" },
{ status: 500 }
);
}

const openai = new OpenAI({ apiKey: openaiKey });

const prompt = `
Return ONLY valid JSON (no markdown, no extra text).

Destination: "${destination}"

Generate an object with EXACTLY these keys:
{
"activities": [ { "name": "...", "description": "...", "url": "https://..." }, ... ],
"restaurants": [ { "name": "...", "description": "...", "url": "https://..." }, ... ],
"coupons": [ { "name": "...", "description": "...", "url": "https://..." }, ... ]
}

Rules:
- Provide 6-10 activities.
- Provide 4-8 restaurants (specific place names if possible).
- Provide 2-5 coupons/deals.
- Keep descriptions short (8-18 words).
- URLs should be real if you know them; otherwise omit url.
`;

const response = await openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [{ role: "user", content: prompt }],
temperature: 0.7,
});

let raw = stripCodeFences(response.choices?.[0]?.message?.content || "");
let parsed = safeJsonParse(raw);

if (!parsed) {
const start = raw.indexOf("{");
const end = raw.lastIndexOf("}");
if (start !== -1 && end !== -1 && end > start) {
parsed = safeJsonParse(raw.slice(start, end + 1));
}
}

if (!parsed || typeof parsed !== "object") {
return NextResponse.json({ error: "Invalid JSON from AI", raw }, { status: 500 });
}

const ensureArray = (v) => (Array.isArray(v) ? v : []);

const withSearchFallback = (item, type) => {
const name = String(item?.name || item || "").trim();
const description = String(item?.description || "").trim();
let url = String(item?.url || "").trim();

if (!url) {
const q = `${name} ${destination}`;
url = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}
return { name, description, url };
};

const activities = ensureArray(parsed.activities).map((i) =>
withSearchFallback(i, "activity")
);
const restaurants = ensureArray(parsed.restaurants).map((i) =>
withSearchFallback(i, "restaurant")
);
const coupons = ensureArray(parsed.coupons).map((i) =>
withSearchFallback(i, "coupon")
);

return NextResponse.json({ activities, restaurants, coupons });
} catch (error) {
console.error("Checklist route error:", error);
return NextResponse.json({ error: "Server error" }, { status: 500 });
}
}
