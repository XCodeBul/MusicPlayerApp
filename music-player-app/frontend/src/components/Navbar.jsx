// components/Navbar.jsx
import { useState } from "react";

export default function Navbar({ searchQuery, setSearchQuery }) {
  return (
    <nav className="w-full bg-gray-800 px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-purple-400 text-2xl">Music Note</span>
      </div>

      <div className="flex items-center gap-4">
        {/* SEARCH BAR — NOW VISIBLE */}
        <input
          type="text"
          placeholder="Search songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-80 bg-gray-700 text-white rounded-lg px-4 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        />

        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded">
          Login
        </button>
      </div>
    </nav>
  );
}