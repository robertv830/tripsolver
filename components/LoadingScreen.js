"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen({ title = "Generating your results…" }) {
const steps = [
"Reviewing your quiz answers",
"Finding destinations that match your preferences",
"Calculating distances from your ZIP code",
"Building your trip options (flights, hotels, activities)",
"Finalizing your personalized results",
];

const [stepIndex, setStepIndex] = useState(0);
const [progress, setProgress] = useState(8);

useEffect(() => {
// Step text changes every ~1.6s
const stepTimer = setInterval(() => {
setStepIndex((i) => (i + 1) % steps.length);
}, 1600);

// Progress creeps forward smoothly until 92%
const progressTimer = setInterval(() => {
setProgress((p) => {
if (p >= 92) return p;
const bump = p < 40 ? 6 : p < 70 ? 4 : 2;
return Math.min(92, p + bump);
});
}, 900);

return () => {
clearInterval(stepTimer);
clearInterval(progressTimer);
};
}, []);

return (
<div
style={{
minHeight: "65vh",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: 24,
}}
>
<div
style={{
width: "100%",
maxWidth: 680,
border: "1px solid rgba(0,0,0,0.08)",
borderRadius: 18,
padding: 22,
boxShadow: "0 16px 44px rgba(0,0,0,0.10)",
background: "white",
}}
>
<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
<Spinner />
<h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
</div>

<p style={{ marginTop: 14, marginBottom: 12, color: "#374151" }}>
{steps[stepIndex]}
</p>

{/* Progress bar */}
<div
style={{
height: 12,
borderRadius: 999,
background: "rgba(0,0,0,0.08)",
overflow: "hidden",
}}
>
<div
style={{
height: "100%",
width: `${progress}%`,
borderRadius: 999,
background: "rgba(37, 99, 235, 0.9)",
transition: "width 600ms ease",
}}
/>
</div>

<div
style={{
marginTop: 10,
display: "flex",
justifyContent: "space-between",
fontSize: 12,
color: "#6b7280",
}}
>
<span>Working…</span>
<span>{progress}%</span>
</div>

<div
style={{
marginTop: 14,
fontSize: 12,
color: "#6b7280",
lineHeight: 1.4,
}}
>
Tip: If it takes longer than expected, it’s usually because we’re pulling
more detailed recommendations.
</div>
</div>
</div>
);
}

function Spinner() {
return (
<div
style={{
width: 28,
height: 28,
borderRadius: "50%",
border: "3px solid rgba(0,0,0,0.10)",
borderTop: "3px solid rgba(37, 99, 235, 0.95)",
animation: "spin 0.9s linear infinite",
}}
>
<style>{`
@keyframes spin {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}
`}</style>
</div>
);
}