"use client";

import { useState } from "react";

export default function TravelModal({ destination, onClose, viatorRoot }) {
const [selected, setSelected] = useState({});

if (!destination) return null;

const toggleItem = (key) => {
setSelected((prev) => ({
...prev,
[key]: !prev[key],
}));
};

const handleSave = () => {
const chosen = Object.keys(selected).filter((k) => selected[k]);
// For now, just show an alert. Later we can wire this into an itinerary feature.
alert(
chosen.length
? `Saving ${chosen.length} item(s) to your itinerary (feature coming soon).`
: "You haven't selected anything yet."
);
};

// Safeguard arrays
const activities = destination.activities || [];
const restaurants = destination.restaurants || [];
const deals = destination.deals || [];

const viatorLink = viatorRoot || "https://www.viator.com/?pid=P00276898&mcid=42383&medium=link";

return (
<>
<div className="modal-overlay" onClick={onClose} />

<div className="travel-modal">
<button className="modal-close" onClick={onClose}>
×
</button>

<h2 className="modal-title">
Plan Your Trip: {destination.name}
</h2>

<div className="modal-scroll">
{/* ACTIVITIES */}
<section className="modal-section">
<h3>⭐ Recommended Activities</h3>
<p className="section-note">
Select activities to add to your itinerary.
</p>

{activities.length === 0 ? (
<p>No specific activities listed yet.</p>
) : (
<ul className="modal-list">
{activities.map((act, index) => {
const key = `activity-${index}`;
return (
<li key={key} className="modal-list-item">
<input
type="checkbox"
className="checkbox"
checked={!!selected[key]}
onChange={() => toggleItem(key)}
/>
<div className="activity-text">
<a
href={viatorLink}
target="_blank"
rel="noopener noreferrer"
className="activity-link"
>
{act.name}
</a>
{act.description && (
<span className="activity-description">
{act.description}
</span>
)}
</div>
</li>
);
})}
</ul>
)}
</section>

{/* RESTAURANTS */}
<section className="modal-section">
<h3>🍽 Recommended Restaurants</h3>
{restaurants.length === 0 ? (
<p>No restaurant suggestions yet.</p>
) : (
<ul className="modal-list">
{restaurants.map((rest, index) => {
const key = `restaurant-${index}`;
return (
<li key={key} className="modal-list-item">
<input
type="checkbox"
className="checkbox"
checked={!!selected[key]}
onChange={() => toggleItem(key)}
/>
<div className="activity-text">
<span className="activity-link">{rest.name}</span>
{rest.description && (
<span className="activity-description">
{rest.description}
</span>
)}
</div>
</li>
);
})}
</ul>
)}
</section>

{/* DEALS */}
<section className="modal-section">
<h3>💸 Coupons & Deals</h3>
{deals.length === 0 ? (
<p>No deals listed yet.</p>
) : (
<ul className="modal-list">
{deals.map((deal, index) => {
const key = `deal-${index}`;
return (
<li key={key} className="modal-list-item">
<input
type="checkbox"
className="checkbox"
checked={!!selected[key]}
onChange={() => toggleItem(key)}
/>
<div className="activity-text">
<a
href={viatorLink}
target="_blank"
rel="noopener noreferrer"
className="deal-link"
>
{deal.name}
</a>
{deal.description && (
<span className="activity-description">
{deal.description}
</span>
)}
</div>
</li>
);
})}
</ul>
)}
</section>
</div>

<button className="save-button" onClick={handleSave}>
Add Selected to Itinerary
</button>
</div>
</>
);
}