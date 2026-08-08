// lib/destinations/theme.js

import { createDestination } from "./core";

export const themeDestinations = [
createDestination({
id: "orlando-fl",
name: "Orlando, FL",
country: "US",
region: "Florida",
lat: 28.5383,
lng: -81.3792,
summary: "Top U.S. theme park destination with major attractions and family-friendly entertainment year-round.",
tags: {
primary: ["theme"],
secondary: ["family"],
weather: "warm",
pace: ["moderate"],
seasonBest: ["winter", "spring", "fall"],
hiddenGem: false,
},
food: {
styles: ["family-friendly", "american"],
},
activities: {
styles: ["theme-parks", "shows", "shopping"],
},
imageQuery: "Orlando theme park castle",
priority: 10,
}),

createDestination({
id: "anaheim-ca",
name: "Anaheim, CA",
country: "US",
region: "California",
lat: 33.8366,
lng: -117.9143,
summary: "Classic Southern California theme park destination with major attractions and easy family travel options.",
tags: {
primary: ["theme"],
secondary: ["family"],
weather: "warm",
pace: ["moderate"],
seasonBest: ["spring", "fall", "winter"],
hiddenGem: false,
},
food: {
styles: ["family-friendly", "american"],
},
activities: {
styles: ["theme-parks", "shows", "shopping"],
},
imageQuery: "Anaheim theme park castle",
priority: 10,
}),

createDestination({
id: "tampa-fl",
name: "Tampa, FL",
country: "US",
region: "Florida",
lat: 27.9506,
lng: -82.4572,
summary: "Florida destination combining major thrill rides, family attractions, and warm-weather travel.",
tags: {
primary: ["theme"],
secondary: ["family"],
weather: "warm",
pace: ["moderate"],
seasonBest: ["winter", "spring", "fall"],
hiddenGem: false,
},
food: {
styles: ["family-friendly", "american", "seafood"],
},
activities: {
styles: ["theme-parks", "shows", "water-activities"],
},
imageQuery: "Busch Gardens Tampa roller coaster",
priority: 8,
}),

createDestination({
id: "branson-mo",
name: "Branson, MO",
country: "US",
region: "Missouri",
lat: 36.6437,
lng: -93.2185,
summary: "A family-friendly entertainment destination with rides, shows, and easygoing vacation options.",
tags: {
primary: ["theme"],
secondary: ["family", "relaxing"],
weather: "any",
pace: ["relaxed"],
seasonBest: ["spring", "summer", "fall"],
hiddenGem: false,
},
food: {
styles: ["family-friendly", "american", "southern"],
},
activities: {
styles: ["shows", "theme-parks", "shopping"],
},
imageQuery: "Branson ferris wheel entertainment district",
priority: 7,
}),

createDestination({
id: "hershey-pa",
name: "Hershey, PA",
country: "US",
region: "Pennsylvania",
lat: 40.2859,
lng: -76.6502,
summary: "A flagship East Coast theme park destination with strong family appeal and easy weekend-trip potential.",
tags: {
primary: ["theme"],
secondary: ["family"],
weather: "any",
pace: ["moderate"],
seasonBest: ["spring", "summer", "fall"],
hiddenGem: false,
},
food: {
styles: ["family-friendly", "american", "bakery"],
},
activities: {
styles: ["theme-parks", "shows", "shopping"],
},
imageQuery: "Hersheypark roller coaster",
priority: 8,
}),

createDestination({
id: "pigeon-forge-tn",
name: "Pigeon Forge, TN",
country: "US",
region: "Tennessee",
lat: 35.7884,
lng: -83.5543,
summary: "A family vacation hub blending amusement attractions with easy access to the Smoky Mountains.",
tags: {
primary: ["theme"],
secondary: ["family"],
weather: "any",
pace: ["moderate"],
seasonBest: ["spring", "summer", "fall"],
hiddenGem: false,
},
food: {
styles: ["family-friendly", "southern", "american"],
},
activities: {
styles: ["theme-parks", "shows", "shopping", "scenic-drives"],
},
imageQuery: "Pigeon Forge Dollywood",
priority: 8,
}),

createDestination({
id: "gatlinburg-tn",
name: "Gatlinburg, TN",
country: "US",
region: "Tennessee",
lat: 35.7143,
lng: -83.5102,
summary: "A mountain vacation town with family attractions and a strong entertainment-meets-nature mix.",
tags: {
primary: ["theme"],
secondary: ["family"],
weather: "any",
pace: ["moderate"],
seasonBest: ["spring", "summer", "fall"],
hiddenGem: false,
},
food: {
styles: ["family-friendly", "southern", "american"],
},
activities: {
styles: ["shows", "shopping", "scenic-drives", "walking"],
},
imageQuery: "Gatlinburg skypark town",
priority: 7,
}),

createDestination({
id: "wisconsin-dells-wi",
name: "Wisconsin Dells, WI",
country: "US",
region: "Wisconsin",
lat: 43.6275,
lng: -89.7709,
summary: "A major Midwest family getaway known for waterparks, attractions, and easy multi-day fun.",
tags: {
primary: ["theme"],
secondary: ["family"],
weather: "warm",
pace: ["moderate"],
seasonBest: ["summer"],
hiddenGem: false,
},
food: {
styles: ["family-friendly", "american"],
},
activities: {
styles: ["theme-parks", "water-activities", "shows"],
},
imageQuery: "Wisconsin Dells water park",
priority: 7,
}),

createDestination({
id: "williamsburg-va",
name: "Williamsburg, VA",
country: "US",
region: "Virginia",
lat: 37.2707,
lng: -76.7075,
summary: "A family-friendly destination pairing classic attractions with strong historical appeal.",
tags: {
primary: ["theme"],
secondary: ["family", "history"],
weather: "any",
pace: ["relaxed"],
seasonBest: ["spring", "fall"],
hiddenGem: false,
},
food: {
styles: ["family-friendly", "american"],
},
activities: {
styles: ["theme-parks", "history-tours", "walking"],
},
imageQuery: "Williamsburg Virginia colonial street",
priority: 6,
}),
];
