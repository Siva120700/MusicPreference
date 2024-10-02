"use client";
import { signIn, signOut, useSession } from "next-auth/react";

const AppBar = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-gray-900 text-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Music</h1>
        <div>
          {session ? (
            <button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-300"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppBar;
