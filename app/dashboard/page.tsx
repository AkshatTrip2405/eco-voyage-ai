"use client";

import { useEffect, useState } from "react";

// Define the shape of our data coming from the Python Backend
interface Destination {
  id: string;
  name: string;
  location: string;
  eco_score: number;
  description: string;
  image_url: string;
}

// Beautiful Default Nature Background
const DEFAULT_BG = "https://images.unsplash.com/photo-1500530855697-b586d89ba562?auto=format&fit=crop&w=1920&q=80";

export default function DashboardPage() {
  // States
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the dynamic background image
  const [activeBg, setActiveBg] = useState<string>(DEFAULT_BG);
  
  // NEW STATE: Tracks which destination's itinerary is currently open
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);

  // Helper to get real high-res images
  const getHighResImage = (name: string, url: string) => {
    const searchStr = (name + " " + url).toLowerCase();
    if (searchStr.includes("andaman") || searchStr.includes("coral")) return "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=1920&q=80"; 
    if (searchStr.includes("kerala")) return "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=80"; 
    if (searchStr.includes("spiti") || searchStr.includes("manali")) return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"; 
    if (searchStr.includes("goa") || searchStr.includes("beach")) return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"; 
    if (searchStr.includes("meghalaya") || searchStr.includes("nature")) return "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=1920&q=80"; 
    return DEFAULT_BG;
  };

  // Preload Images Trick
  const uniqueBackgrounds = Array.from(new Set([
    DEFAULT_BG,
    getHighResImage('goa', ''),
    getHighResImage('kerala', ''),
    ...destinations.map(d => getHighResImage(d.name, d.image_url))
  ]));

  // Fetching data from the FastAPI Backend
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/destinations");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        setDestinations(data);
      } catch (err: any) {
        console.error("Failed to fetch destinations:", err);
        setError("Failed to load recommendations. Is the backend running?");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  return (
    <div className="relative min-h-screen font-sans overflow-hidden">
      
      {/* Dynamic Background Layers */}
      {uniqueBackgrounds.map((bgUrl) => (
        <div 
          key={bgUrl}
          className={`fixed inset-0 z-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center ${
            activeBg === bgUrl ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="fixed inset-0 z-0 bg-black/60 transition-colors duration-500" />

      {/* Main Content */}
      <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto h-screen overflow-y-auto pb-32">
        
        <header className="mb-10 text-white drop-shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Welcome User! <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="mt-3 text-gray-200 text-lg font-medium max-w-2xl">
            Discover sustainable stays and eco-friendly adventures seamlessly tailored to your carbon footprint.
          </p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-xl hover:bg-white/20 transition-all duration-300">
             <div className="flex items-center gap-3 mb-2">
                 <span className="text-2xl">🌱</span>
                 <h3 className="text-white/90 text-sm font-bold uppercase tracking-wider">Average Eco Score</h3>
             </div>
             <p className="text-4xl font-extrabold text-white">92<span className="text-lg text-white/70 font-medium"> / 100</span></p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-xl hover:bg-white/20 transition-all duration-300">
             <div className="flex items-center gap-3 mb-2">
                 <span className="text-2xl">🗺️</span>
                 <h3 className="text-white/90 text-sm font-bold uppercase tracking-wider">Recommended Trips</h3>
             </div>
             <p className="text-4xl font-extrabold text-white">14<span className="text-lg text-white/70 font-medium"> Active</span></p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-xl hover:bg-white/20 transition-all duration-300">
             <div className="flex items-center gap-3 mb-2">
                 <span className="text-2xl">♻️</span>
                 <h3 className="text-white/90 text-sm font-bold uppercase tracking-wider">Carbon Saved</h3>
             </div>
             <p className="text-4xl font-extrabold text-white">350<span className="text-lg text-white/70 font-medium"> kg CO₂</span></p>
          </div>
        </div>

        {/* Live AI Recommendations Section */}
        <section className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
              AI Recommended Destinations
            </h2>
            <span className="bg-green-500/20 text-green-300 border border-green-400/30 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-lg">
              Live Data
            </span>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-20 bg-gray-900/40 backdrop-blur-md rounded-3xl border border-white/10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
              <span className="ml-4 text-xl font-medium text-white drop-shadow">Fetching your next adventure...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 text-white p-4 rounded-2xl flex items-center shadow-lg">
              <svg className="w-6 h-6 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((dest) => {
                const imgUrl = getHighResImage(dest.name, dest.image_url);
                return (
                  <div 
                    key={dest.id} 
                    onMouseEnter={() => setActiveBg(imgUrl)}
                    onMouseLeave={() => setActiveBg(DEFAULT_BG)}
                    className="group flex flex-col bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-white/10 hover:border-white/30 cursor-pointer"
                  >
                    <div className="relative h-56 w-full overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                        style={{ backgroundImage: `url(${imgUrl})` }}
                      />
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-1">
                        <span className="text-green-400 font-black text-lg">{dest.eco_score}</span>
                        <span className="text-gray-300 text-[10px] font-bold uppercase leading-tight tracking-tighter">Eco<br/>Score</span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">{dest.name}</h3>
                      
                      <div className="flex items-center text-gray-400 text-sm mb-4 font-medium">
                        <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                        {dest.location}
                      </div>
                      
                      <p className="text-gray-300 text-sm line-clamp-2 flex-grow">
                        {dest.description}
                      </p>

                      {/* Opens the specific destination in the Modal */}
                      <button 
                        onClick={() => setSelectedDest(dest)}
                        className="mt-6 w-full py-3.5 bg-green-600/90 hover:bg-green-500 text-white font-bold rounded-xl transition-colors text-sm shadow-lg backdrop-blur-md active:scale-[0.98]"
                      >
                        View Itinerary
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Static Recent Trips Section */}
        <section className="mt-16 pb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-6 text-white drop-shadow-md">
            Recent Trips
          </h2>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li 
                onMouseEnter={() => setActiveBg(getHighResImage('goa', ''))}
                onMouseLeave={() => setActiveBg(DEFAULT_BG)}
                className="flex items-center p-4 hover:bg-white/10 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-white/20"
              >
                <div 
                  className="w-16 h-16 rounded-xl bg-cover bg-center shadow-inner border border-white/20 mr-4 flex-shrink-0" 
                  style={{ backgroundImage: `url(${getHighResImage('goa', '')})` }} 
                />
                <div>
                  <p className="font-bold text-white text-lg">Goa Beaches</p>
                  <p className="text-sm font-medium text-gray-300">March 2026</p>
                </div>
              </li>
              <li 
                onMouseEnter={() => setActiveBg(getHighResImage('kerala', ''))}
                onMouseLeave={() => setActiveBg(DEFAULT_BG)}
                className="flex items-center p-4 hover:bg-white/10 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-white/20"
              >
                <div 
                  className="w-16 h-16 rounded-xl bg-cover bg-center shadow-inner border border-white/20 mr-4 flex-shrink-0" 
                  style={{ backgroundImage: `url(${getHighResImage('kerala', '')})` }} 
                />
                <div>
                  <p className="font-bold text-white text-lg">Kerala Backwaters</p>
                  <p className="text-sm font-medium text-gray-300">February 2026</p>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* --- PRODUCTION READY ITINERARY MODAL --- */}
      {selectedDest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop (Click to close) */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => setSelectedDest(null)}></div>
          
          {/* Modal Container */}
          <div className="relative bg-slate-900 border border-white/20 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-300">
            
            {/* Modal Header Image */}
            <div 
              className="h-56 w-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${getHighResImage(selectedDest.name, selectedDest.image_url)})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedDest(null)}
                className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black p-2.5 rounded-full backdrop-blur-md transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>

              <h3 className="absolute bottom-4 left-6 text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">{selectedDest.name}</h3>
            </div>
            
            {/* Modal Content (Timeline) */}
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-300 font-medium flex items-center gap-2 text-lg">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                  {selectedDest.location}
                </span>
                <span className="bg-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-sm font-bold border border-green-500/30 shadow-inner">
                  Eco Score: {selectedDest.eco_score}/100
                </span>
              </div>
              
              <h4 className="text-white text-xl font-bold mb-6">Your Sustainable Journey</h4>
              
              {/* Vertical Timeline */}
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-green-500 before:to-transparent">
                
                {/* Day 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group pb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-green-500 text-slate-900 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">1</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/10 p-4 rounded-2xl shadow">
                    <h4 className="text-white font-bold mb-1">Arrival & Local Culture</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">Check into your eco-lodge. Afternoon walking tour exploring the local heritage and zero-waste initiatives.</p>
                  </div>
                </div>

                {/* Day 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group pb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-green-500 text-slate-900 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">2</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/10 p-4 rounded-2xl shadow">
                    <h4 className="text-white font-bold mb-1">Nature Immersion</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">Guided nature hike with local conservationists. Learn about the flora contributing to the region's high eco-score.</p>
                  </div>
                </div>

                {/* Day 3 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-green-500 text-slate-900 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">3</div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/10 p-4 rounded-2xl shadow">
                    <h4 className="text-white font-bold mb-1">Give Back & Departure</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">Participate in a morning community project (tree planting or cleanup) before your carbon-neutral departure.</p>
                  </div>
                </div>

              </div>

              <div className="mt-10 flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                  Book This Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}