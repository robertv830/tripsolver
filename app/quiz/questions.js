// app/quiz/questions.js

const questions = [
// 1️⃣ ZIP CODE
{
id: "zipCode",
type: "zip",
question: "What is your home ZIP code?",
},

// 2️⃣ TRAVELER INFO
{
id: "travelerInfo",
type: "traveler-info",
question: "Tell us about the people traveling with you.",
},

// 3️⃣ BUDGET SLIDER
{
id: "budget",
type: "budget-slider",
question: "What is your approximate budget for this trip?",
},

// 4️⃣ DISTANCE SLIDER + INTERNATIONAL OPTION
{
id: "distance",
type: "distance-slider",
question: "How far are you willing to travel?",
},

// ⭐ Preferences follow
{
id: "vacationType",
question: "What type of vacation are you interested in?",
options: ["Relaxing", "Adventure", "Theme Park", "Outdoors", "Beach", "Culture & History"],
},

{
id: "pace",
question: "What pace of vacation do you prefer?",
options: ["Slow & Relaxed", "A Mix of Both", "Fast-Paced & Exciting"],
},

{
id: "weather",
question: "What kind of weather do you enjoy on vacation?",
options: ["Warm & Sunny", "Cool & Mild", "Cold & Snowy", "No Preference"],
},

{
id: "activityLevel",
question: "What level of physical activity do you prefer?",
options: ["Low Activity", "Moderate Activity", "High Activity"],
},

{
id: "cityOrNature",
question: "Do you enjoy visiting cities or nature more?",
options: ["Big Cities", "Small Towns", "Nature Destinations", "A Mix"],
},

{
id: "foodImportance",
question: "Do you enjoy food as a major part of your vacation?",
options: ["Absolutely", "Somewhat", "Not really"],
},

{
id: "lodging",
question: "What type of lodging do you prefer?",
options: ["Hotel", "Resort", "Airbnb/Apartment", "All-Inclusive", "No Preference"],
},

{
id: "popularOrHidden",
question: "Do you prefer popular destinations or hidden gems?",
options: ["Popular Destinations", "Hidden Gems", "Either is fine"],
},

{
id: "nightlife",
question: "How important is nightlife during your trip?",
options: ["Very Important", "Somewhat Important", "Not Important"],
},

{
id: "cultureLearning",
question: "Do you enjoy trips that are educational or cultural?",
options: ["Yes, I love learning", "A little bit", "Not really"],
},

{
id: "scenery",
question: "What kind of scenery do you enjoy most?",
options: ["Mountains", "Beaches", "City Skylines", "Forests", "No Preference"],
},

{
id: "spontaneity",
question: "How spontaneous do you like your vacations to be?",
options: ["Very Structured & Planned", "A Mix of Both", "Very Spontaneous"],
},

{
id: "foodExperience",
question: "What type of food experience do you prefer?",
options: ["Fine Dining", "Street Food", "Local Cuisine", "No Preference"],
},

{
id: "indoorOutdoor",
question: "Do you prefer indoor or outdoor activities?",
options: ["Mostly Indoor", "Mostly Outdoor", "A Mix"],
},

{
id: "walking",
question: "Do you like trips with a lot of walking?",
options: ["Yes", "Some", "Prefer minimal walking"],
},

{
id: "tripLength",
question: "What is your ideal trip length?",
options: ["Weekend Getaway (1–3 days)", "Short Trip (4–6 days)", "One Week", "More than a week"],
},

{
id: "relaxVsAdventure",
question: "Would you like your trip to be more relaxing or more adventurous?",
options: ["Relaxing", "Balanced", "Adventurous"],
},
];

export default questions;
