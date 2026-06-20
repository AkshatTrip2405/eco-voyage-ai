export default function DestinationDetails() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Destination Details
      </h1>

      <div className="bg-gray-200 h-64 flex items-center justify-center mb-8">
        Goa Image
      </div>

      <h2 className="text-xl font-bold">
        Destination: Goa
      </h2>

      <p className="mt-4">Eco Score: 92</p>

      <p className="mt-4">
        Beautiful beaches and eco-friendly tourism options.
      </p>

      <button className="bg-green-500 text-white px-4 py-2 rounded mt-6">
        Book Now
      </button>
    </div>
  );
}