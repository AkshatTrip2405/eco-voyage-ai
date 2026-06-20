import DashboardCard from "@/components/DashboardCard";

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-50 text-black">

      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-black">
        Welcome User! 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Eco Score" />
        <DashboardCard title="Recommended Trips" />
        <DashboardCard title="Carbon Saved" />
      </div>

      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-black">
          Recommended Destinations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-2xl font-bold text-black">🏖 Goa</h3>
            <p className="mt-3 text-gray-700">Eco Score: 92</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-2xl font-bold text-black">🏔 Manali</h3>
            <p className="mt-3 text-gray-700">Eco Score: 90</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-2xl font-bold text-black">🌴 Kerala</h3>
            <p className="mt-3 text-gray-700">Eco Score: 95</p>
          </div>

        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-black">
          Recent Trips
        </h2>

        <div className="bg-white rounded-2xl p-6 shadow-md text-black">
          <ul className="space-y-3">
            <li>📍 Goa - March 2026</li>
            <li>📍 Kerala - February 2026</li>
            <li>📍 Manali - January 2026</li>
          </ul>
        </div>
      </section>

    </div>
  );
}