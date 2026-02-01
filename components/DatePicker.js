export default function DatePicker({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-1">{label}</label>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="border p-2 rounded w-full"
      />
    </div>
  );
}

