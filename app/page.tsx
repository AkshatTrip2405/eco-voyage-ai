import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Card from "@/components/Card";

export default function Home() {
  return (
    <div className="p-10">
      <Navbar />

      <Hero />

      <input
        type="text"
        placeholder="Search Destination..."
        className="border p-3 w-full mb-8"
      />

      <h2 className="text-xl font-bold mb-4">
        Recommended Trips
      </h2>

      <div className="grid grid-cols-3 gap-4">
        <Card title="Goa Eco Score" />
        <Card title="Manali Eco Score" />
        <Card title="Kerala Eco Score" />
      </div>
    </div>
  );
}