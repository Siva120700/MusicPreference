"use client";
import { useState } from "react";

const AddSong = () => {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/streams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          creatorId: 1,  
        }),
      });

      if (response.ok) {
        setMessage("Song added successfully!");
      } else {
        const errorResult = await response.json();
        setMessage(`Error: ${errorResult.message}`);
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add a Song</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          className="p-3 border border-blue-500 rounded-md w-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Add Song
        </button>
      </form>
      {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
    </div>
  );
};

export default AddSong;
