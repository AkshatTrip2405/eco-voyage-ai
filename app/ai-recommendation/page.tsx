export default function AIRecommendation() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        AI Travel Recommendations
      </h1>

      <div className="bg-gray-200 p-6 mb-6">
        <h2 className="font-bold">
          User Preferences
        </h2>

        <p>Budget: ₹20,000</p>
        <p>Duration: 5 Days</p>
        <p>Travel Type: Nature</p>
      </div>

      <div className="bg-gray-200 p-6 mb-6">
        <h2 className="font-bold">
          Recommended Destination
        </h2>

        <p>Kerala</p>
        <p>Eco Score: 95</p>

        <p className="mt-4">
          Matches nature preference and sustainable tourism goals.
        </p>
      </div>

      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Plan My Trip
      </button>
    </div>
  );
}