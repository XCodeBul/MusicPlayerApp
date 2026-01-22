import React from "react";
import { songs } from "../data/songs";

function Playlist({ onSelectSong, currentSong }) {
  return (
    <div className="mt-6 w-full max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-4 text-center">Playlist</h3>

      <ul className="space-y-3 ">
        {songs.map((song) => {
          const isActive = currentSong && currentSong.id === song.id;
          return (
            <li
              key={song.id}
              onClick={() => onSelectSong(song)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 bg-[#0D1117]  shadow-lg hover:shadow-xl ${
                isActive ? "bg-blue-600 text-white scale-101" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >

              <img
                src={song.cover}
                alt={song.title}
                className="w-16 h-16 object-cover rounded-md shadow-md flex-shrink-0"
              />


              <div className="flex flex-col w-full min-w-0">
                <h4 className="text-lg font-semibold leading-tight truncate">
                  {song.title}
                </h4>
                <p className="text-gray-400 text-sm mt-1">{song.artist}</p>
              </div>


            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Playlist;
