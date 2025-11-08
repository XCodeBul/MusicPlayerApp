import { useState } from "react";

export default function Navbar() {
  const [search, setSearch] = useState("");

  return (
    <nav className="w-full bg-gray-800 px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-purple-400 text-2xl">🎵</span>
        <h1 className="text-xl font-bold">My Music Player</h1>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search songs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded">
          Login
        </button>
      </div>
    </nav>
  );
}
