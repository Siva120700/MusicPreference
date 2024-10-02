// components/NowPlaying.tsx
"use client";
import { useEffect, useState, useRef, useCallback } from "react";
// import Image from "next/image";

interface Stream {
  id: string;
  url: string;
  thumbnail_url: string;
  votes: number;
}

const NowPlaying = () => {
  const [nowPlaying, setNowPlaying] = useState<Stream | null>(null);
  const [queue, setQueue] = useState<Stream[]>([]);
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  const [isYouTubeAPIReady, setIsYouTubeAPIReady] = useState(false);

  useEffect(() => {
    const fetchQueue = async () => {
      const response = await fetch("/api/streams");
      const data = await response.json();
      setQueue(data);
      setNowPlaying(data[0]);
    };

    fetchQueue();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
          setIsYouTubeAPIReady(true);
        };
      } else {
        setIsYouTubeAPIReady(true);
      }
    }
  }, []);

  const removeSongFromQueue = async (streamId: string) => {
    try {
      const response = await fetch("/api/streams", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamId }),
      });

      if (response.ok) {
        console.log("Song removed successfully");
      } else {
        console.error("Failed to remove song");
      }
    } catch (error) {
      console.error("Error removing song:", error);
    }
  };

  const handleSongEnd = useCallback(async () => {
    if (nowPlaying) {
      await removeSongFromQueue(nowPlaying.id);
      const updatedQueue = queue.filter((song) => song.id !== nowPlaying.id);
      setQueue(updatedQueue);
      const currentIndex = queue.findIndex(
        (song) => song.id === nowPlaying?.id
      );
      if (currentIndex !== -1 && currentIndex + 1 < queue.length) {
        setNowPlaying(queue[currentIndex + 1]);
      } else {
        setNowPlaying(null);
      }
    }
  }, [nowPlaying, queue]);

  const onPlayerStateChange = useCallback(
    (event: any) => {
      if (event.data === 0) {
        handleSongEnd();
      }
    },
    [handleSongEnd]
  );

  useEffect(() => {
    if (nowPlaying && isYouTubeAPIReady && playerRef.current) {
      const player = new window.YT.Player(playerRef.current, {
        videoId: extractYouTubeId(nowPlaying.url),
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    }
  }, [nowPlaying, isYouTubeAPIReady, onPlayerStateChange]);

  const extractYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=|watch\?.*?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="h-screen snap-start relative bg-black text-white flex items-center justify-center">
      {/* Now Playing Content */}
      <div className="text-center">
        {nowPlaying ? (
          <div>
            <h2 className="text-4xl font-bold mb-4">Now Playing</h2>
            {/* <Image
              src={nowPlaying.thumbnail_url}
              alt="Thumbnail"
              width={300}
              height={300}
              className="rounded-md"
            /> */}
            <div
              className="relative w-[60vw] h-[60vh] mx-auto mt-5"
              style={{ paddingBottom: "33.75%" }}
            >
              <div
                id="player-container"
                className="absolute top-0 left-0 w-full h-full"
              >
                <iframe
                  ref={playerRef}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(
                    nowPlaying.url
                  )}?enablejsapi=1`}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        ) : (
          <p>No song is currently playing</p>
        )}
      </div>
    </div>
  );
};

export default NowPlaying;
