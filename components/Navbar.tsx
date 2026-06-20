export default function Navbar() {
  return (
    <nav className="flex justify-between bg-gray-200 p-4 mb-8">
      <h1 className="font-bold">ECO VOYAGE AI</h1>

      <div className="flex gap-6">
        <a href="/">Home</a>
        <a href="/destination-details">Destinations</a>
        <a href="/login">Login</a>
      </div>
    </nav>
  );
}