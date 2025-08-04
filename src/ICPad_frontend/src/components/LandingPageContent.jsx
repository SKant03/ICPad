// src/components/LandingPageContent.jsx
import React from 'react';
import Card from './Card';
import { Code, Rocket, Store } from '../utils/Icons.jsx'; // Import icons

const LandingPageContent = () => {
  return (
    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full z-10 pb-16">
      <Card className="text-center p-6 flex flex-col items-center">
        <Code className="w-12 h-12 text-blue-400 mb-4" />
        <h3 className="text-2xl font-semibold mb-3">Integrated IDE</h3>
        <p className="opacity-70">Develop smart contracts and dApps with a powerful, real-time web-based code editor.</p>
      </Card>
      <Card className="text-center p-6 flex flex-col items-center">
        <Rocket className="w-12 h-12 text-blue-400 mb-4" />
        <h3 className="text-2xl font-semibold mb-3">Seamless Deployment</h3>
        <p className="opacity-70">Deploy your applications directly to the Internet Computer blockchain with ease and confidence.</p>
      </Card>
      <Card className="text-center p-6 flex flex-col items-center">
        <Store className="w-12 h-12 text-blue-400 mb-4" />
        <h3 className="text-2xl font-semibold mb-3">Canister Marketplace</h3>
        <p className="opacity-70">Discover and utilize a rich library of pre-built canisters and templates for rapid development.</p>
      </Card>
    </div>
  );
};

export default LandingPageContent;
