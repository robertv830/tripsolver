// lib/destinations/core.js

export const PRIMARY_TYPES = ["theme", "beach", "culture", "themed", "outdoors", "family"];

export const SECONDARY_TYPES = ["history", "relaxing"];

export const WEATHER_TYPES = ["warm", "cool", "cold", "any"];

export const PACE_TYPES = ["relaxed", "moderate", "active"];

export const SEASONS = ["winter", "spring", "summer", "fall"];

export const FOOD_TYPES = [
"bbq",
"seafood",
"mexican",
"italian",
"street-food",
"fine-dining",
"family-friendly",
"american",
"german",
"bakery",
"coffee",
"southern",
];

export const ACTIVITY_TYPES = [
"theme-parks",
"museums",
"history-tours",
"walking",
"hiking",
"water-activities",
"shopping",
"shows",
"wildlife",
"sports",
"food-tours",
"scenic-drives",
];

function normalizeArray(value) {
return Array.isArray(value) ? value.filter(Boolean) : [];
}

function normalizeWeight(value) {
const n = Number(value);
if (!Number.isFinite(n)) return 0;
return Math.max(0, Math.min(10, n));
}

export function createDestination(data) {
const base = {
id: "",
name: "",
country: "US",
region: "",
lat: null,
lng: null,
summary: "",

tags: {
primary: [],
secondary: [],
weather: "any",
pace: [],
seasonBest: [],
hiddenGem: false,
},

vacationTypeWeights: {
themeParks: 0,
beach: 0,
cultureHistory: 0,
themedTowns: 0,
outdoorAdventure: 0,
familyFriendly: 0,
},

food: {
styles: [],
},

activities: {
styles: [],
},

imageQuery: "",
imageUrl: "",
imageSourceUrl: "",
imageCredit: "",
priority: 5,
};

const merged = {
...base,
...data,
tags: {
...base.tags,
...(data?.tags || {}),
},
vacationTypeWeights: {
...base.vacationTypeWeights,
...(data?.vacationTypeWeights || {}),
},
food: {
...base.food,
...(data?.food || {}),
},
activities: {
...base.activities,
...(data?.activities || {}),
},
};

return {
...merged,

id: String(merged.id || "").trim(),
name: String(merged.name || "").trim(),
country: String(merged.country || "US").trim(),
region: String(merged.region || "").trim(),

lat: typeof merged.lat === "number" ? merged.lat : null,
lng: typeof merged.lng === "number" ? merged.lng : null,

summary: String(merged.summary || "").trim(),

tags: {
primary: normalizeArray(merged.tags.primary).map((x) =>
String(x).toLowerCase().trim()
),
secondary: normalizeArray(merged.tags.secondary).map((x) =>
String(x).toLowerCase().trim()
),
weather: String(merged.tags.weather || "any").toLowerCase().trim(),
pace: normalizeArray(merged.tags.pace).map((x) =>
String(x).toLowerCase().trim()
),
seasonBest: normalizeArray(merged.tags.seasonBest).map((x) =>
String(x).toLowerCase().trim()
),
hiddenGem: Boolean(merged.tags.hiddenGem || merged.hiddenGem),
},

vacationTypeWeights: {
themeParks: normalizeWeight(merged.vacationTypeWeights.themeParks),
beach: normalizeWeight(merged.vacationTypeWeights.beach),
cultureHistory: normalizeWeight(merged.vacationTypeWeights.cultureHistory),
themedTowns: normalizeWeight(merged.vacationTypeWeights.themedTowns),
outdoorAdventure: normalizeWeight(merged.vacationTypeWeights.outdoorAdventure),
familyFriendly: normalizeWeight(merged.vacationTypeWeights.familyFriendly),
},

food: {
styles: normalizeArray(merged.food.styles).map((x) =>
String(x).toLowerCase().trim()
),
},

activities: {
styles: normalizeArray(merged.activities.styles).map((x) =>
String(x).toLowerCase().trim()
),
},

imageQuery: String(merged.imageQuery || "").trim(),
imageUrl: String(merged.imageUrl || "").trim(),
imageSourceUrl: String(merged.imageSourceUrl || "").trim(),
imageCredit: String(merged.imageCredit || "").replaceAll('"', "").trim(),

priority: Number.isFinite(Number(merged.priority)) ? Number(merged.priority) : 5,
};
}

/*
Compatibility helper for older code paths.
This lets route.js still read tags.types while we migrate to weights.
*/
export function toLegacyDestinationShape(destination) {
const primary = normalizeArray(destination?.tags?.primary);
const secondary = normalizeArray(destination?.tags?.secondary);

return {
...destination,
tags: {
types: [...primary, ...secondary],
pace: normalizeArray(destination?.tags?.pace),
weather: destination?.tags?.weather || "any",
hiddenGem: Boolean(destination?.tags?.hiddenGem),
},
};
}
   