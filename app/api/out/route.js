// app/api/out/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
const { searchParams } = new URL(req.url);

const url = searchParams.get("url");
const type = searchParams.get("type") || "unknown";
const dest = searchParams.get("dest") || "unknown";

if (!url) {
return NextResponse.json({ error: "Missing url" }, { status: 400 });
}

// Basic safety: only allow http(s) redirects
if (!/^https?:\/\//i.test(url)) {
return NextResponse.json({ error: "Invalid url" }, { status: 400 });
}

// ✅ Tracking (simple for now)
// Later: swap this with GA event, PostHog, DB insert, etc.
console.log(
`[OUT] ${new Date().toISOString()} type=${type} dest="${dest}" url=${url}`
);

return NextResponse.redirect(url, { status: 302 });
}