// src/pages/IDEPage.jsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/Button';

const IDEPage = () => {
  const { isDarkMode } = useTheme();
  const bgColor = isDarkMode ? 'bg-slate-900' : 'bg-gray-100';
  const topBarBg = isDarkMode ? 'bg-zinc-800' : 'bg-gray-200';
  const panelBg = isDarkMode ? 'bg-zinc-800' : 'bg-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';

  const mockCode = `
// main.mo - My Motoko DApp
actor {
  stable var counter: Nat = 0;

  public query func getCounter(): Nat {
    counter
  };

  public update func increment(): Nat {
    counter += 1;
    counter
  };

  public query func greet(name: Text): Text {
    "Hello, " # name # "!"
  };
};
  `;

  const mockTerminalOutput = `
$ dfx deploy --network ic
Deploying "my_motoko_dapp" canister...
Building canister 'my_motoko_dapp'...
Running 'dfx build --network ic' for canister 'my_motoko_dapp'
WARN: The 'dfx' command is not in your PATH.
WARN: Consider adding it to your shell configuration.
Uploading canister 'my_motoko_dapp' to the IC...
Deployed canister 'my_motoko_dapp'.
Canister ID: ryjl3-tyaaa-aaaaa-aaaba-cai
Canister URL: https://ryjl3-tyaaa-aaaaa-aaaba-cai.ic0.app/
$ dfx canister call my_motoko_dapp greet 'World'
("Hello, World!")
$ dfx canister call my_motoko_dapp increment
(1 : nat)
$ dfx canister call my_motoko_dapp getCounter
(1 : nat)
`;

  return (
    <div className={`${bgColor} ${textColor} flex flex-col h-screen overflow-hidden`}>
      {/* Top Bar */}
      <div className={`${topBarBg} p-3 flex items-center justify-between shadow-sm z-10`}>
        <h2 className="text-xl font-semibold pl-4">Project: My Motoko DApp</h2>
        <div className="flex space-x-3 pr-4">
          <Button variant="secondary" className="text-sm">Run</Button>
          <Button className="text-sm">Deploy</Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: File Explorer */}
        <div className={`${panelBg} w-64 p-4 border-r border-zinc-700 overflow-y-auto flex-shrink-0`}>
          <h3 className="font-semibold mb-3 text-lg">File Explorer</h3>
          <ul className="space-y-1 text-sm">
            <li className="font-medium text-blue-400">📁 src/</li>
            <li className="ml-4 flex items-center hover:bg-zinc-700 rounded-sm p-1 cursor-pointer">📄 <span className="font-semibold text-blue-300">main.mo</span></li>
            <li className="ml-4 flex items-center hover:bg-zinc-700 rounded-sm p-1 cursor-pointer">📄 lib.mo</li>
            <li className="font-medium mt-2">📁 assets/</li>
            <li className="ml-4 flex items-center hover:bg-zinc-700 rounded-sm p-1 cursor-pointer">📄 index.html</li>
            <li className="flex items-center hover:bg-zinc-700 rounded-sm p-1 cursor-pointer">📄 dfx.json</li>
            <li className="flex items-center hover:bg-zinc-700 rounded-sm p-1 cursor-pointer">📄 README.md</li>
            <li className="flex items-center hover:bg-zinc-700 rounded-sm p-1 cursor-pointer">📄 .env</li>
          </ul>
        </div>

        {/* Center: Code Editor & Terminal */}
        <div className="flex flex-col flex-1">
          {/* Code Editor Placeholder */}
          <div className="flex-1 border-b border-zinc-700 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 p-2 bg-zinc-700 text-sm border-b border-zinc-600">
              <span className="text-blue-300">main.mo</span>
            </div>
            <pre className="h-full w-full bg-zinc-900 text-gray-300 p-4 pt-10 overflow-auto text-sm font-mono whitespace-pre-wrap">
              <code className="block">
                <span className="text-purple-400">{'// main.mo - My Motoko DApp'}</span><br/>
                <span className="text-blue-400">actor</span> {'{'}<br/>
                {'  '}<span className="text-green-400">stable</span> <span className="text-blue-400">var</span> <span className="text-yellow-300">counter</span>: <span className="text-cyan-400">Nat</span> = <span className="text-orange-300">0</span>;<br/>
                <br/>
                {'  '}<span className="text-purple-400">public</span> <span className="text-blue-400">query</span> <span className="text-green-400">func</span> <span className="text-yellow-300">getCounter</span>(): <span className="text-cyan-400">Nat</span> {'{'}<br/>
                {'    '}<span className="text-yellow-300">counter</span><br/>
                {'  }'};<br/>
                <br/>
                {'  '}<span className="text-purple-400">public</span> <span className="text-blue-400">update</span> <span className="text-green-400">func</span> <span className="text-yellow-300">increment</span>(): <span className="text-cyan-400">Nat</span> {'{'}<br/>
                {'    '}<span className="text-yellow-300">counter</span> <span className="text-red-400">+=</span> <span className="text-orange-300">1</span>;<br/>
                {'    '}<span className="text-yellow-300">counter</span><br/>
                {'  }'};<br/>
                <br/>
                {'  '}<span className="text-purple-400">public</span> <span className="text-blue-400">query</span> <span className="text-green-400">func</span> <span className="text-yellow-300">greet</span>(name: <span className="text-cyan-400">Text</span>): <span className="text-cyan-400">Text</span> {'{'}<br/>
                {'    '}<span className="text-orange-300">"Hello, "</span> <span className="text-red-400">#</span> <span className="text-yellow-300">name</span> <span className="text-red-400">#</span> <span className="text-orange-300">"!"</span><br/>
                {'  }'};<br/>
                {mockCode}
              </code>
            </pre>
          </div>
          {/* Bottom: Terminal/Console */}
          <div className={`${panelBg} h-48 p-4 overflow-y-auto flex-shrink-0`}>
            <h3 className="font-semibold mb-3 text-lg">Terminal Output</h3>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
              <code>
                <span className="text-green-400">$</span> <span className="text-white">dfx deploy --network ic</span><br/>
                <span className="text-gray-400">Deploying "my_motoko_dapp" canister...</span><br/>
                <span className="text-gray-400">Building canister 'my_motoko_dapp'...</span><br/>
                <span className="text-gray-400">Running 'dfx build --network ic' for canister 'my_motoko_dapp'</span><br/>
                <span className="text-yellow-400">WARN: The 'dfx' command is not in your PATH.</span><br/>
                <span className="text-yellow-400">WARN: Consider adding it to your shell configuration.</span><br/>
                <span className="text-gray-400">Uploading canister 'my_motoko_dapp' to the IC...</span><br/>
                <span className="text-green-400">Deployed canister 'my_motoko_dapp'.</span><br/>
                <span className="text-blue-400">Canister ID: ryjl3-tyaaa-aaaaa-aaaba-cai</span><br/>
                <span className="text-blue-400">Canister URL: https://ryjl3-tyaaa-aaaaa-aaaba-cai.ic0.app/</span><br/>
                <span className="text-green-400">$</span> <span className="text-white">dfx canister call my_motoko_dapp greet 'World'</span><br/>
                <span className="text-gray-300">("Hello, World!")</span><br/>
                <span className="text-green-400">$</span> <span className="text-white">dfx canister call my_motoko_dapp increment</span><br/>
                <span className="text-gray-300">(1 : nat)</span><br/>
                <span className="text-green-400">$</span> <span className="text-white">dfx canister call my_motoko_dapp getCounter</span><br/>
                <span className="text-gray-300">(1 : nat)</span><br/>
                {mockTerminalOutput}
              </code>
            </pre>
          </div>
        </div>

        {/* Right Panel: Assistant/Deployment Preview (Optional) */}
        <div className={`${panelBg} w-64 p-4 border-l border-zinc-700 overflow-y-auto flex-shrink-0`}>
          <h3 className="font-semibold mb-3 text-lg">Assistant / Preview</h3>
          <p className="text-sm opacity-70 mb-4">
            This panel provides context-aware assistance, deployment logs, and a live preview of your dApp as you build.
          </p>
          <div className="space-y-3">
            <h4 className="font-medium text-blue-300">Quick Actions:</h4>
            <Button variant="ghost" className="text-sm w-full justify-start">Suggest Code Snippets</Button>
            <Button variant="ghost" className="text-sm w-full justify-start">Explain Selection</Button>
            <Button variant="ghost" className="text-sm w-full justify-start">Generate Test Cases</Button>
            <h4 className="font-medium text-blue-300 mt-4">Deployment Info:</h4>
            <p className="text-xs opacity-60">Last Deployment: 2023-05-10 14:30 UTC</p>
            <p className="text-xs opacity-60">Status: <span className="text-green-400">Success</span></p>
            <Button variant="secondary" className="text-sm mt-4 w-full">View Deployment Logs</Button>
            <Button variant="outline" className="text-sm mt-2 w-full">Open Live Preview</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDEPage;
