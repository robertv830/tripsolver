// app/quiz/questions.js

const questions = [
// 1️⃣ ORIGIN (CITY OR ZIP)
{
id: "origin",
type: "origin",
question: "Where are you starting from? (City or ZIP)",
},

// 2️⃣ TRAVELER INFO
{
id: "travelerInfo",
type: "traveler-info",
question: "Tell us about the people traveling with you.",
},

// 3️⃣ BUDGET
// Keep for future package suggestions / pricing insights,
// but do not use it as a main destination-matching factor.
{
id: "budget",
type: "budget-slider",
question: "What is your approximate budget for this trip?",
},

// 4️⃣ DISTANCE + INTERNATIONAL OPTION
{
id: "distance",
type: "distance-slider",
question: "How far are you willing to travel?",
},

// 5️⃣ MAIN DESTINATION TYPE
// This should be one of the two biggest destination inputs,
// along with distance.
{
id: "vacationType",
question: "What type of vacation are you interested in?",
options: [
"Theme Parks",
"Beach",
"Culture & History",
"Themed Cities & Towns",
"Outdoor Adventure",
"Family-Friendly",
],
},

// 6️⃣ SEASON PREFERENCE
// Replaces weather. Better for card messaging and seasonal suggestions.
{
id: "seasonPreference",
question: "What season do you most like to travel?",
options: ["Winter", "Spring", "Summer", "Fall"],
},

// 7️⃣ POPULAR VS HIDDEN GEMS
// Keep as a light preference only.
{
id: "popularOrHidden",
question: "Do you prefer popular destinations or hidden gems?",
options: ["Popular Destinations", "Hidden Gems", "Either is fine"],
},

// 8️⃣ LEARNING / CULTURE PREFERENCE
// Use later for activities inside the destination.
{
id: "cultureLearning",
question: "Do you enjoy trips that are educational or cultural?",
options: ["Yes, I love learning", "A little bit", "Not really"],
},

// 9️⃣ FOOD PREFERENCE
// Use later to influence restaurants shown in the modal/card.
{
id: "foodExperience",
question: "What type of food experience do you prefer?",
options: ["Fine Dining", "Street Food", "Local Cuisine", "No Preference"],
},

// 10️⃣ INDOOR VS OUTDOOR ACTIVITIES
// Use later for activity suggestions.
{
id: "indoorOutdoor",
question: "Do you prefer indoor or outdoor activities?",
options: ["Mostly Indoor", "Mostly Outdoor", "A Mix"],
},

// 11️⃣ ACTIVITY LEVEL
// Replaces the old walking question.
{
id: "activityLevel",
question: "How active do you like your trips to be?",
options: ["Relaxed", "Moderately Active", "Very Active"],
},

// 12️⃣ TRIP LENGTH
// Useful later for itinerary generation and package suggestions.
{
id: "tripLength",
question: "What is your ideal trip length?",
options: [
"Weekend Getaway (1–3 days)",
"Short Trip (4–6 days)",
"One Week",
"More than a week",
],
},
];

export default questions;
