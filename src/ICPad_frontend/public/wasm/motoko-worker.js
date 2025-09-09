// Motoko Compiler Worker
let motokoCompiler = null;

self.onmessage = async function(e) {
  const { type, data } = e.data;
  
  try {
    switch (type) {
      case 'init':
        await initializeCompiler(data.wasmBytes);
        self.postMessage({ type: 'init-complete' });
        break;
        
      case 'compile':
        const result = await compileMotoko(data.code, data.options);
        self.postMessage({ type: 'compile-result', result });
        break;
        
      default:
        self.postMessage({ type: 'error', error: 'Unknown message type' });
    }
  } catch (error) {
    if (type === 'init') {
      self.postMessage({ type: 'init-error', error: error.message });
    } else {
      self.postMessage({ type: 'compile-error', error: error.message });
    }
  }
};

async function initializeCompiler(wasmBytes) {
  try {
    // Import the Motoko compiler
    const { default: Motoko } = await import('./motoko-playground.js');
    
    // Initialize the compiler with WASM bytes
    motokoCompiler = new Motoko();
    await motokoCompiler.load(wasmBytes);
    
    console.log('Motoko compiler initialized in worker');
  } catch (error) {
    console.error('Failed to initialize Motoko compiler:', error);
    throw error;
  }
}

async function compileMotoko(code, options = {}) {
  if (!motokoCompiler) {
    throw new Error('Compiler not initialized');
  }
  
  try {
    // Compile the Motoko code
    const result = motokoCompiler.compile(code, options);
    
    return {
      success: true,
      output: 'Motoko compilation successful!',
      errors: [],
      warnings: [],
      wasm: result.wasm,
      candid: result.candid
    };
  } catch (error) {
    return {
      success: false,
      output: `Compilation failed: ${error.message}`,
      errors: [error.message],
      warnings: [],
      wasm: null,
      candid: null
    };
  }
}
