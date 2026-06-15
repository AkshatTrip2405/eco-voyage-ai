import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card
            title="AI Travel Planner"
            description="Generate personalized eco-tourism itineraries."
          />

          <Card
            title="Green Stays"
            description="Find sustainable homestays and eco-resorts."
          />
        </div>
      </main>

      <Footer />
    </>
  );
}