export default function LoginForm() {
  return (
    <div className="bg-gray-200 p-8 rounded w-96">
      <h2 className="text-3xl font-bold mb-6 text-center">
        LOGIN
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="border w-full p-2 mb-4"
      />

      <input
        type="password"
        placeholder="Password"
        className="border w-full p-2 mb-4"
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Login
      </button>
    </div>
  );
}