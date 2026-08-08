// lib/destinations/beach.js

import { createDestination } from "./core";

export const beachDestinations = [
createDestination({
id: "south-padre-island-tx",
name: "South Padre Island, TX",
country: "US",
region: "Texas",
lat: 26.1118,
lng: -97.1681,
summary: "A warm Gulf Coast getaway with beaches, sunshine, and a laid-back vacation feel.",
tags: {
primary: ["beach"],
secondary: ["relaxing"],
weather: "warm",
pace: ["relaxed"],
seasonBest: ["spring", "summer"],
hiddenGem: false,
},
food: {
styles: ["seafood", "mexican", "family-friendly"],
},
activities: {
styles: ["water-activities", "walking"],
},
imageQuery: "South Padre Island beach",
priority: 8,
}),

createDestination({
id: "destin-fl",
name: "Destin, FL",
country: "US",
region: "Florida",
lat: 30.3935,
lng: -86.4958,
summary: "A popular Emerald Coast destination known for white sand beaches and family-friendly vacations.",
tags: {
primary: ["beach"],
secondary: ["family"],
weather: "warm",
pace: ["relaxed"],
seasonBest: ["spring", "summer", "fall"],
hiddenGem: false,
},
food: {
styles: ["seafood", "family-friendly", "american"],
},
activities: {
styles: ["water-activities", "walking", "shopping"],
},
imageQuery: "Destin Florida beach",
priority: 9,
}),

createDestination({
id: "clearwater-beach-fl",
name: "Clearwater Beach, FL",
country: "US",
region: "Florida",
lat: 27.977,
lng: -82.827,
summary: "A classic warm-weather Florida beach destination with easy access, soft sand, and family appeal.",
tags: {
primary: ["beach"],
secondary: ["relaxing"],
weather: "warm",
pace: ["relaxed"],
seasonBest: ["winter", "spring", "fall"],
hiddenGem: false,
},
food: {
styles: ["seafood", "family-friendly", "american"],
},
activities: {
styles: ["water-activities", "walking"],
},
imageQuery: "Clearwater Beach Florida",
priority: 8,
}),

createDestination({
id: "outer-banks-nc",
name: "Outer Banks, NC",
country: "US",
region: "North Carolina",
lat: 35.5582,
lng: -75.4665,
summary: "A scenic coastal getaway with beaches, lighthouses, and a slower-paced outdoor feel.",
tags: {
primary: ["beach"],
secondary: ["relaxing"],
weather: "warm",
pace: ["relaxed"],
seasonBest: ["spring", "summer", "fall"],
hiddenGem: false,
},
food: {
styles: ["seafood", "family-friendly"],
},
activities: {
styles: ["water-activities", "walking", "scenic-drives"],
},
imageQuery: "Outer Banks lighthouse beach",
priority: 8,
}),

createDestination({
id: "rehoboth-beach-de",
name: "Rehoboth Beach, DE",
country: "US",
region: "Delaware",
lat: 38.7209,
lng: -75.076,
summary: "A friendly East Coast beach destination known for boardwalk fun and family-friendly coastal trips.",
tags: {
primary: ["beach"],
secondary: ["family"],
weather: "warm",
pace: ["relaxed"],
seasonBest: ["summer", "fall"],
hiddenGem: false,
},
food: {
styles: ["seafood", "family-friendly", "american"],
},
activities: {
styles: ["walking", "shopping", "water-activities"],
},
imageQuery: "Rehoboth Beach boardwalk",
priority: 7,
}),

createDestination({
id: "cape-may-nj",
name: "Cape May, NJ",
country: "US",
region: "New Jersey",
lat: 38.9351,
lng: -74.906,
summary: "A coastal town blending beach time with Victorian charm and a gentler vacation pace.",
tags: {
primary: ["beach"],
secondary: ["history", "relaxing"],
weather: "warm",
pace: ["relaxed"],
seasonBest: ["summer", "fall"],
hiddenGem: false,
},
food: {
styles: ["seafood", "american"],
},
activities: {
styles: ["walking", "history-tours", "shopping"],
},
imageQuery: "Cape May beach Victorian houses",
priority: 7,
}),

createDestination({
id: "myrtle-beach-sc",
name: "Myrtle Beach, SC",
country: "US",
region: "South Carolina",
lat: 33.6891,
lng: -78.8867,
summary: "A popular beach vacation spot with family attractions, wide beaches, and easy entertainment.",
tags: {
primary: ["beach"],
secondary: ["family"],
weather: "warm",
pace: ["relaxed"],
seasonBest: ["spring", "summer", "fall"],
hiddenGem: false,
},
food: {
styles: ["seafood", "family-friendly", "american"],
},
activities: {
styles: ["water-activities", "shows", "shopping"],
},
imageQuery: "Myrtle Beach boardwalk beach",
priority: 7,
}),

createDestination({
id: "miami-fl",
name: "Miami, FL",
country: "US",
region: "Florida",
lat: 25.7617,
lng: -80.1918,
summary: "A warm-weather destination that combines beaches, nightlife, food, and international city energy.",
tags: {
primary: ["beach"],
secondary: ["culture"],
weather: "warm",
pace: ["moderate"],
seasonBest: ["winter", "spring"],
hiddenGem: false,
},
food: {
styles: ["seafood", "street-food", "fine-dining", "mexican"],
},
activities: {
styles: ["water-activities", "walking", "shopping", "shows"],
},
imageQuery: "Miami beach skyline",
priority: 8,
}),

createDestination({
id: "san-diego-ca",
name: "San Diego, CA",
country: "US",
region: "California",
lat: 32.7157,
lng: -117.1611,
summary: "A versatile coastal destination combining beaches, family attractions, and easygoing city access.",
tags: {
primary: ["beach"],
secondary: ["family", "culture"],
weather: "warm",
pace: ["moderate"],
seasonBest: ["spring", "summer", "fall"],
hiddenGem: false,
},
food: {
styles: ["seafood", "mexican", "family-friendly"],
},
activities: {
styles: ["water-activities", "walking", "shopping", "wildlife"],
},
imageQuery: "San Diego beach coastline",
priority: 9,
}),

createDestination({
id: "waikiki-honolulu-hi",
name: "Waikiki / Honolulu, HI",
country: "US",
region: "Hawaii",
lat: 21.3069,
lng: -157.8583,
summary: "An iconic island destination with beaches, scenery, and broad appeal for both relaxation and activity.",
tags: {
primary: ["beach"],
secondary: ["family", "relaxing"],
weather: "warm",
pace: ["relaxed"],
seasonBest: ["winter", "spring", "summer", "fall"],
hiddenGem: false,
},
food: {
styles: ["seafood", "family-friendly", "street-food"],
},
activities: {
styles: ["water-activities", "walking", "shopping", "wildlife"],
},
imageQuery: "Waikiki beach Honolulu",
priority: 9,
}),
];
