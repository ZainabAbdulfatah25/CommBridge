import React from "react";
import logo from "../assets/logo.png";

const Splash = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-white">
    <img src={logo} alt="CommBridge" className="w-32 mb-8" />
    <h1 className="text-2xl font-semibold mb-8">CommBridge</h1>
    <div className="flex flex-col gap-4">
      <button className="bg-primary text-white py-2 px-10 rounded-lg hover:bg-purple-700">
        Get Started
      </button>
      <button className="border border-primary text-primary py-2 px-10 rounded-lg hover:bg-purple-50">
        Learn More
      </button>
    </div>
  </div>
);

export default Splash;
