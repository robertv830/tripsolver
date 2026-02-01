// app/feedback/page.js

const FEEDBACK_FORM_URL =
"https://docs.google.com/forms/d/e/1FAIpQLSe2x3uZGyIgFS2S_p9Zgr2cqZgzuz18XVbEisolcKcCgxZMZQ/viewform?usp=header";

export default function FeedbackPage() {
return (
<div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
<div
style={{
display: "flex",
justifyContent: "space-between",
gap: 12,
flexWrap: "wrap",
alignItems: "center",
}}
>
<div>
<h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>
Quick Feedback (2–3 minutes)
</h1>
<div style={{ marginTop: 6, color: "#6b7280", fontWeight: 700 }}>
Thanks — your answers help improve matching + deals + itinerary features.
</div>
</div>

<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
<a
href="/results"
style={{
border: "1px solid #d1d5db",
background: "white",
borderRadius: 10,
padding: "10px 14px",
textDecoration: "none",
fontWeight: 900,
color: "#111827",
}}
>
← Back to Results
</a>

<a
href={FEEDBACK_FORM_URL}
target="_blank"
rel="noreferrer"
style={{
background: "#111827",
color: "white",
borderRadius: 10,
padding: "10px 14px",
textDecoration: "none",
fontWeight: 900,
}}
>
Open in new tab
</a>
</div>
</div>

<div
style={{
marginTop: 16,
border: "1px solid #d1d5db",
borderRadius: 12,
overflow: "hidden",
background: "white",
}}
>
<iframe
title="Trip Feedback Form"
src={FEEDBACK_FORM_URL}
style={{ width: "100%", height: "82vh", border: 0 }}
/>
</div>
</div>
);
}