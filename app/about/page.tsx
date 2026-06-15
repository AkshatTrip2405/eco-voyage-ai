import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />

      <main className="p-10">
        <h1 className="text-4xl font-bold mb-4">About</h1>
        <p>
          EcoVoyage AI helps travelers discover eco-friendly and sustainable tourism experiences.
        </p>
      </main>

      <Footer />
    </>
  );
}