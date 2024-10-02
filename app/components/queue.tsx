"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Stream {
  id: string;
  url: string;
  title: string;
  thumbnail_url: string;
  votes: number;
}

const Queue = () => {
  const [queue, setQueue] = useState<Stream[]>([]);

  const fetchQueue = async () => {
    try {
      const response = await fetch("/api/streams");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Stream[] = await response.json();
      setQueue(data);
    } catch (error) {
      console.error("Error fetching queue:", error);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleVote = async (streamId: string) => {
    try {
      const response = await fetch(`/api/streams`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          streamId: streamId,
        }),
      });

      if (response.ok) {
        fetchQueue();
      } else {
        console.error("Error voting:", await response.text());
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Song Queue</h2>
      <ul className="space-y-4">
        {queue.map((song) => (
          <li key={song.id} className="flex items-center space-x-4">
            <Image
              src={song.thumbnail_url}
              alt={song.title}
              width={100}
              height={100}
              className="rounded-md shadow-md"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{song.title}</h3>
              <p className="text-gray-400">Votes: {song.votes}</p>
            </div>
            <button
              onClick={() => handleVote(song.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
            >
              Vote
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Queue;
