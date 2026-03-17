import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Full background image with gradient overlay */}
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center px-6 py-16 relative"
        style={{
          backgroundImage: "url('/assets/call_center_AI_shutterstock_LuckyStep.jpg')"
        }}
      >
        {/* Overlay to make content readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-blue-700/60 to-blue-500/60 backdrop-blur-sm z-0"></div>

        {/*  Main content box */}
        <div className="relative z-10 max-w-7xl w-full flex flex-col md:flex-row items-center bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">

          {/* Left illustration removed: background handles it now */}

          {/* Right: Content Section (full width on small screens) */}
          <div className="w-full p-10 md:p-16 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-blue-100 mb-6">
               AI Call Volume Prediction
            </h1>
            <p className="text-blue-100 mb-8 text-lg leading-relaxed">
              Welcome! This system predicts call center volume trends using artificial intelligence.
              Head to the prediction page to explore your insights.
            </p>
            <Link
              to="/predict"
              className="inline-block bg-blue-600 hover:bg-blue-800 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
            >
              Go to Prediction →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
