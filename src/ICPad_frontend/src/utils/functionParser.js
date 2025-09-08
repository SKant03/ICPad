// Function Parser for Dynamic Test Button Generation
export class FunctionParser {
  static parseFunctions(code, language) {
    if (!code || typeof code !== 'string') {
      return [];
    }

    switch (language.toLowerCase()) {
      case 'motoko':
        return this.parseMotokoFunctions(code);
      case 'rust':
        return this.parseRustFunctions(code);
      case 'javascript':
        return this.parseJavaScriptFunctions(code);
      default:
        return [];
    }
  }

  static parseMotokoFunctions(code) {
    const functions = [];
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Match public functions
      const funcMatch = line.match(/public func\s+(\w+)\s*\(([^)]*)\)\s*:\s*async\s+([^;{]+)/);
      if (funcMatch) {
        const [, funcName, params, returnType] = funcMatch;
        const paramList = this.parseMotokoParameters(params);
        
        functions.push({
          name: funcName,
          params: paramList,
          returnType: returnType.trim(),
          line: i + 1,
          language: 'motoko'
        });
      }
    }
    
    return functions;
  }

  static parseRustFunctions(code) {
    const functions = [];
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Match public async functions
      const funcMatch = line.match(/pub async fn\s+(\w+)\s*\(([^)]*)\)\s*->\s*([^{]+)/);
      if (funcMatch) {
        const [, funcName, params, returnType] = funcMatch;
        const paramList = this.parseRustParameters(params);
        
        functions.push({
          name: funcName,
          params: paramList,
          returnType: returnType.trim(),
          line: i + 1,
          language: 'rust'
        });
      }
    }
    
    return functions;
  }

  static parseJavaScriptFunctions(code) {
    const functions = [];
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Match exported functions
      const funcMatch = line.match(/export function\s+(\w+)\s*\(([^)]*)\)/);
      if (funcMatch) {
        const [, funcName, params] = funcMatch;
        const paramList = this.parseJavaScriptParameters(params);
        
        functions.push({
          name: funcName,
          params: paramList,
          returnType: 'any',
          line: i + 1,
          language: 'javascript'
        });
      }
    }
    
    return functions;
  }

  static parseMotokoParameters(paramString) {
    if (!paramString.trim()) return [];
    
    return paramString.split(',').map(param => {
      const trimmed = param.trim();
      const colonIndex = trimmed.lastIndexOf(':');
      
      if (colonIndex === -1) {
        return { name: trimmed, type: 'Text' };
      }
      
      return {
        name: trimmed.substring(0, colonIndex).trim(),
        type: trimmed.substring(colonIndex + 1).trim()
      };
    });
  }

  static parseRustParameters(paramString) {
    if (!paramString.trim()) return [];
    
    return paramString.split(',').map(param => {
      const trimmed = param.trim();
      const colonIndex = trimmed.lastIndexOf(':');
      
      if (colonIndex === -1) {
        return { name: trimmed, type: 'String' };
      }
      
      return {
        name: trimmed.substring(0, colonIndex).trim(),
        type: trimmed.substring(colonIndex + 1).trim()
      };
    });
  }

  static parseJavaScriptParameters(paramString) {
    if (!paramString.trim()) return [];
    
    return paramString.split(',').map(param => {
      const trimmed = param.trim();
      return {
        name: trimmed,
        type: 'any'
      };
    });
  }

  // Generate test arguments for a function
  static generateTestArgs(functionInfo) {
    return functionInfo.params.map(param => {
      switch (param.type.toLowerCase()) {
        case 'text':
        case 'string':
          return 'Test Input';
        case 'nat':
        case 'int':
          return '42';
        case 'bool':
          return 'true';
        case 'principal':
          return 'Principal';
        default:
          return 'Test Value';
      }
    });
  }
}
