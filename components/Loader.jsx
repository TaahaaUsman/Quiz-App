// components/Loader.jsx
import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-32 h-32">
        {/* Concentric Rings */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin-fast" />
        <div className="absolute inset-4 rounded-full border-4 border-transparent border-b-pink-500 animate-spin-reverse" />
        <div className="absolute inset-8 rounded-full border-4 border-transparent border-l-green-500 animate-spin-slow" />

        {/* Rotating Cube at Center */}
        <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-lg shadow-lg animate-spin-cube" style={{ transform: 'translate(-50%, -50%)' }} />

        {/* Orbiting Dots */}
        <div className="dot dot1" />
        <div className="dot dot2" />
        <div className="dot dot3" />
        <div className="dot dot4" />
      </div>

      {/* Wavy “Loading…” Text */}
      <p className="mt-4 text-lg font-semibold text-gray-700 flex space-x-1">
        {'Loading…'.split('').map((char, idx) => (
          <span key={idx} style={{ animation: `wave 1s ease-in-out infinite`, animationDelay: `${idx * 0.1}s` }}>
            {char}
          </span>
        ))}
      </p>
    </div>
  );
}
