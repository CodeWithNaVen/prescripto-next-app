"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="max-w-md text-center">
        {/* Cartoon 404 GIF */}
        <Image
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWk5OTZiZXg2am41ZXFod3ZyMmhqYzZ0dXVpamVubnpwb3ZjOGhrbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CoND5j6Bn1QZUgm1xX/giphy.gif"
          alt="Disconnected wire 404 animation"
          className="mx-auto mb-8 w-48 h-48 object-contain"
          loading="lazy"
          width={200}
          height={200}
        />

        <h1 className="text-7xl font-extrabold text-purple-700 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been disconnected or lost.
        </p>
        <button
          onClick={() => router.push("/")}
          className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition duration-300"
          aria-label="Go back home"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}
