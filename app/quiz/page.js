// app/quiz/page.js
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import questions from "./questions";

export default function QuizPage() {
const router = useRouter();

const [currentIndex, setCurrentIndex] = useState(0);
const [answers, setAnswers] = useState({});
const [quizComplete, setQuizComplete] = useState(false);

// Traveler count & ages
const [travelerCount, setTravelerCount] = useState(1);
const [ages, setAges] = useState({ adults: 1, teens: 0, kids: 0 });

// Budget slider
const [budget, setBudget] = useState(1500);

// Distance slider
const [distance, setDistance] = useState(300);
const [distanceScope, setDistanceScope] = useState("us-only");

const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState("");

const q = questions[currentIndex];

const styles = useMemo(() => {
return {
page: { padding: 28, display: "flex", justifyContent: "center" },
card: {
width: "100%",
maxWidth: 760,
border: "1px solid #e5e7eb",
borderRadius: 16,
padding: 24,
background: "#fff",
},
title: { fontSize: 28, fontWeight: 800, marginBottom: 10 },
subtitle: { color: "#6b7280", fontWeight: 700, marginBottom: 18 },

topRow: {
display: "flex",
justifyContent: "space-between",
alignItems: "center",
gap: 12,
marginBottom: 18,
},
backBtn: (disabled) => ({
background: disabled ? "#e5e7eb" : "#f3f4f6",
color: "#111827",
border: "1px solid #d1d5db",
padding: "8px 12px",
borderRadius: 10,
cursor: disabled ? "not-allowed" : "pointer",
fontWeight: 800,
minWidth: 90,
}),
qCount: { color: "#6b7280", fontWeight: 800 },

question: { fontSize: 20, fontWeight: 800, marginBottom: 16 },

input: {
padding: 12,
borderRadius: 10,
border: "1px solid #d1d5db",
width: "100%",
fontSize: 16,
},

row: { display: "flex", gap: 12, flexWrap: "wrap" },
col: { display: "flex", flexDirection: "column", gap: 8, flex: "1 1 220px" },

label: { fontWeight: 800, color: "#111827" },

sliderValue: { fontSize: 18, fontWeight: 800, marginBottom: 10 },
slider: { width: "100%" },

primaryBtn: {
marginTop: 16,
padding: "10px 16px",
borderRadius: 10,
border: "1px solid #1f2937",
background: "#111827",
color: "white",
fontWeight: 900,
cursor: "pointer",
},

optionWrap: { display: "flex", flexDirection: "column", gap: 12 },
optionBtn: {
padding: "12px 14px",
borderRadius: 10,
border: "1px solid #d1d5db",
background: "#fff",
textAlign: "left",
cursor: "pointer",
fontWeight: 800,
},

radioWrap: { display: "flex", flexDirection: "column", gap: 10, marginTop: 10 },
hint: { color: "#6b7280", fontWeight: 700, marginTop: 8 },

errorBox: {
marginTop: 12,
whiteSpace: "pre-wrap",
color: "crimson",
background: "#fff5f5",
border: "1px solid #fecaca",
padding: 12,
borderRadius: 10,
},
};
}, []);

function nextQuestion(saveValue) {
const cur = questions[currentIndex];

setAnswers((prev) => ({
...prev,
[String(cur.id)]: saveValue,
}));

if (currentIndex < questions.length - 1) {
setCurrentIndex((prev) => prev + 1);
} else {
setQuizComplete(true);
}
}

function prevQuestion() {
if (currentIndex === 0) return;
setCurrentIndex((prev) => prev - 1);
}

useEffect(() => {
if (!quizComplete) return;

async function finalize() {
setIsSubmitting(true);
setSubmitError("");

try {
const payloadAnswers = {
...answers,
budget,
distance: answers.distance || { miles: distance, scope: distanceScope },
};

localStorage.setItem("vacationAnswers", JSON.stringify(payloadAnswers));

const res = await fetch("/api/recommendations", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ answers: payloadAnswers }),
});

if (!res.ok) {
const txt = await res.text();
throw new Error(txt || "Failed to fetch recommendations.");
}

const data = await res.json();

sessionStorage.setItem("recommendations", JSON.stringify(data.recommendations || []));
sessionStorage.setItem("originZip", JSON.stringify(data.originZip || ""));
sessionStorage.setItem("origin", JSON.stringify(data.origin || null));
sessionStorage.setItem("quizAnswers", JSON.stringify(payloadAnswers));
sessionStorage.setItem("suggestions", JSON.stringify(data.suggestions || []));

router.push("/results");
} catch (e) {
setSubmitError(e?.message || "Something went wrong generating results.");
setIsSubmitting(false);
}
}

finalize();
}, [quizComplete, answers, budget, distance, distanceScope, router]);

if (quizComplete) {
return (
<div style={styles.page}>
<div style={styles.card}>
<div style={{ fontWeight: 900, fontSize: 18 }}>
{isSubmitting ? "Loading your results…" : "Could not generate results."}
</div>
{submitError ? <pre style={styles.errorBox}>{submitError}</pre> : null}
</div>
</div>
);
}

return (
<div style={styles.page}>
<div style={styles.card}>
<div style={styles.title}>Vacation Planner Quiz 🌴</div>
<div style={styles.subtitle}>
Answer a few questions and we’ll match trips to your vibe.
</div>

<div style={styles.topRow}>
<button
onClick={prevQuestion}
disabled={currentIndex === 0}
style={styles.backBtn(currentIndex === 0)}
>
← Back
</button>

<div style={styles.qCount}>
Question {currentIndex + 1} of {questions.length}
</div>
</div>

<div style={styles.question}>{q.question || q.text}</div>

{/* ORIGIN */}
{q.type === "origin" && (
<div>
<input
type="text"
placeholder='e.g., "Austin, TX" or "78701"'
value={answers.origin || ""}
onChange={(e) =>
setAnswers((prev) => ({ ...prev, origin: e.target.value }))
}
style={styles.input}
/>

<button
onClick={() => nextQuestion(String(answers.origin || "").trim())}
style={styles.primaryBtn}
>
Continue
</button>

<div style={styles.hint}>Tip: You can type a city/state OR a ZIP.</div>
</div>
)}

{/* TRAVELER INFO */}
{q.type === "traveler-info" && (
<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
<div style={styles.row}>
<div style={styles.col}>
<div style={styles.label}>How many people are traveling?</div>
<input
type="number"
min={1}
max={12}
value={travelerCount}
onChange={(e) => setTravelerCount(Number(e.target.value))}
style={styles.input}
/>
</div>
</div>

<div style={{ fontWeight: 900, marginTop: 6 }}>Ages Breakdown</div>

<div style={styles.row}>
<div style={styles.col}>
<div style={styles.label}>Adults (18+)</div>
<input
type="number"
min={0}
value={ages.adults}
onChange={(e) =>
setAges((prev) => ({ ...prev, adults: Number(e.target.value) }))
}
style={styles.input}
/>
</div>

<div style={styles.col}>
<div style={styles.label}>Teens (13–17)</div>
<input
type="number"
min={0}
value={ages.teens}
onChange={(e) =>
setAges((prev) => ({ ...prev, teens: Number(e.target.value) }))
}
style={styles.input}
/>
</div>

<div style={styles.col}>
<div style={styles.label}>Kids (0–12)</div>
<input
type="number"
min={0}
value={ages.kids}
onChange={(e) =>
setAges((prev) => ({ ...prev, kids: Number(e.target.value) }))
}
style={styles.input}
/>
</div>
</div>

<button
onClick={() => {
const total = ages.adults + ages.teens + ages.kids;
if (total !== travelerCount) {
alert(`Mismatch: Expected ${travelerCount}, but total = ${total}`);
return;
}
nextQuestion({ travelerCount, ages });
}}
style={styles.primaryBtn}
>
Continue
</button>
</div>
)}

{/* BUDGET */}
{q.type === "budget-slider" && (
<div>
<div style={styles.sliderValue}>${budget.toLocaleString()}</div>

<input
type="range"
min={500}
max={10000}
step={100}
value={budget}
onChange={(e) => setBudget(Number(e.target.value))}
style={styles.slider}
/>

<button onClick={() => nextQuestion(budget)} style={styles.primaryBtn}>
Continue
</button>
</div>
)}

{/* DISTANCE */}
{q.type === "distance-slider" && (
<div>
<div style={styles.sliderValue}>{distance} miles</div>

<input
type="range"
min={50}
max={3000}
step={50}
value={distance}
onChange={(e) => setDistance(Number(e.target.value))}
style={styles.slider}
/>

<div style={{ fontWeight: 900, marginTop: 18 }}>
Where are you open to traveling?
</div>

<div style={styles.radioWrap}>
<label>
<input
type="radio"
name="scope"
checked={distanceScope === "us-only"}
onChange={() => setDistanceScope("us-only")}
/>
<span style={{ marginLeft: 8 }}>United States Only</span>
</label>

<label>
<input
type="radio"
name="scope"
checked={distanceScope === "us+intl"}
onChange={() => setDistanceScope("us+intl")}
/>
<span style={{ marginLeft: 8 }}>United States + International</span>
</label>

<label>
<input
type="radio"
name="scope"
checked={distanceScope === "intl-only"}
onChange={() => setDistanceScope("intl-only")}
/>
<span style={{ marginLeft: 8 }}>International Only</span>
</label>
</div>

<button
onClick={() =>
nextQuestion({ miles: distance, scope: distanceScope })
}
style={styles.primaryBtn}
>
Continue
</button>
</div>
)}

{/* MULTIPLE CHOICE */}
{!q.type && q.options && (
<div style={styles.optionWrap}>
{q.options.map((opt, index) => (
<button
key={index}
onClick={() => nextQuestion(opt)}
style={styles.optionBtn}
>
{opt}
</button>
))}
</div>
)}
</div>
</div>
);
}
