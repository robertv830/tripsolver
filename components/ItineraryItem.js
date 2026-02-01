export default function ItineraryItem({ day, activity }) {
  return (
    <div className="bg-white p-3 rounded-lg shadow mb-2">
      <span className="font-bold">Day {day}:</span> {activity}
    </div>
  );
}

