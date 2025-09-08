import React, { useState } from 'react';

const CompilationResults = ({ result, onClose }) => {
  const [activeTab, setActiveTab] = useState('output');

  if (!result) return null;

  const { success, output, errors, wasm, candid } = result;

  const downloadWasm = () => {
    if (wasm) {
      const blob = new Blob([wasm], { type: 'application/wasm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compiled.wasm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const downloadCandid = () => {
    if (candid) {
      const blob = new Blob([candid], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compiled.did';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-4/5 h-4/5 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${success ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <h2 className="text-xl font-bold text-white">
              {success ? 'Compilation Successful' : 'Compilation Failed'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('output')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'output'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Output
          </button>
          {errors && errors.length > 0 && (
            <button
              onClick={() => setActiveTab('errors')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'errors'
                  ? 'text-red-400 border-b-2 border-red-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Errors ({errors.length})
            </button>
          )}
          {wasm && (
            <button
              onClick={() => setActiveTab('wasm')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'wasm'
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              WASM
            </button>
          )}
          {candid && (
            <button
              onClick={() => setActiveTab('candid')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'candid'
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Candid
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'output' && (
            <div className="space-y-2">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {output}
              </pre>
            </div>
          )}

          {activeTab === 'errors' && errors && errors.length > 0 && (
            <div className="space-y-2">
              {errors.map((error, index) => (
                <div key={index} className="bg-red-900 bg-opacity-50 border border-red-700 rounded p-3">
                  <div className="text-red-300 font-mono text-sm">{error}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'wasm' && wasm && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">WebAssembly Output</h3>
                <button
                  onClick={downloadWasm}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                >
                  Download WASM
                </button>
              </div>
              <div className="bg-gray-900 rounded p-4">
                <div className="text-sm text-gray-400 mb-2">
                  Size: {wasm.length} bytes
                </div>
                <div className="text-xs text-gray-500 font-mono break-all">
                  {Array.from(wasm).map((byte, i) => (
                    <span key={i} className="text-gray-600">
                      {byte.toString(16).padStart(2, '0')}
                      {(i + 1) % 16 === 0 ? '\n' : ' '}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'candid' && candid && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Candid Interface</h3>
                <button
                  onClick={downloadCandid}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm"
                >
                  Download Candid
                </button>
              </div>
              <div className="bg-gray-900 rounded p-4">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                  {candid}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompilationResults;
