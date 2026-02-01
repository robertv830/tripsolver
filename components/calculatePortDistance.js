// components/calculatePortDistance.js

// Simple placeholder distance logic — you can improve later
export default function calculatePortDistance(userZip, port) {
if (!userZip || !port) return null;

// For now, return a random distance (just so it works!)
return Math.floor(Math.random() * 1000) + 50;
}