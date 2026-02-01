"use client"; // needed for React hooks in Next.js app directory

import { useState } from "react";

export default function ItineraryPage() {
  // State for the itinerary
  const [itinerary, setItinerary] = useState([]);

  // Sample destinations (you could replace this with your DestinationCard data)
  const destinations = [
    { id: 1, name: "Disney World" },
    { id: 2, name: "Tokyo Disney" },
    { id: 3, name: "Universal Studios" },
  ];

  // Add a destination with a date
  const addDestination = (destination) => {
    const date = prompt("Enter a date for this destination (YYYY-MM-DD):");
    if (date) {
      setItinerary([...itinerary, { ...destination, date }]);
    }
  };

  // Remove a destination
  const removeDestination = (id) => {
    setItinerary(itinerary.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Itinerary</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Destinations</h2>
        <div className="flex gap-4">
          {destinations.map((dest) => (
            <button
              key={dest.id}
              onClick={() => addDestination(dest)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {dest.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Planned Trips</h2>
        {itinerary.length === 0 && <p>No destinations added yet.</p>}
        <ul className="space-y-2">
          {itinerary.map((item) => (
            <li
              key={item.id + item.date}
              className="flex justify-between items-center bg-gray-100 p-3 rounded"
            >
              <span>
                {item.name} - <span className="font-semibold">{item.date}</span>
              </span>
              <button
                onClick={() => removeDestination(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
