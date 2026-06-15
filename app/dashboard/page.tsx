import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Dashboard() {
  return (
    <>
      <Navbar />

      <main className="p-10">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p>View travel plans, recommendations, and bookings here.</p>
      </main>

      <Footer />
    </>
  );
}