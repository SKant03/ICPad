// src/components/LandingPageTopBar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import Button from './Button';

const LandingPageTopBar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="w-full text-center py-16 px-8 z-10">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
        Welcome to <span className="text-blue-500">ICPad</span>
      </h1>
      <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 opacity-80">
        Your ultimate platform for building, deploying, and discovering decentralized applications on the Internet Computer. Accelerate your Web3 development.
      </p>
      {/* This button will navigate to /ide */}
      <Button onClick={() => navigate('/ide')} className="text-lg px-10 py-4 shadow-lg hover:shadow-xl">
        Start Building Now
      </Button>
    </div>
  );
};

export default LandingPageTopBar;
