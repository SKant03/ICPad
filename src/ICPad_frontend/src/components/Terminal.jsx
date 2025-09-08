import React, { useEffect, useRef, useState } from 'react';
import { useIDE } from '../contexts/IDEContext';

const Terminal = ({ height = '400px' }) => {
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const { addTerminalOutput, currentProject } = useIDE();
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize terminal output
  useEffect(() => {
    const welcomeMessage = [
      { type: 'info', text: '🚀 ICPad Terminal - Internet Computer Development Environment' },
      { type: 'info', text: 'Supported Languages: Rust, Motoko, JavaScript' },
      { type: 'info', text: 'Type "help" for available commands' },
      { type: 'prompt', text: getPrompt() }
    ];
    setOutput(welcomeMessage);
  }, [currentProject]);

  const getPrompt = () => {
    const projectName = currentProject ? currentProject.name : 'no-project';
    const language = currentProject ? currentProject.language : 'none';
    return `${projectName}:${language}$ `;
  };

  const addOutput = (text, type = 'output') => {
    setOutput(prev => [...prev, { type, text }]);
  };

  const handleCommand = async (cmd) => {
    if (!cmd.trim()) return;

    // Add command to output
    addOutput(`${getPrompt()}${cmd}`, 'command');
    
    // Add to history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(commandHistory.length);

    const [commandName, ...args] = cmd.trim().split(' ');

    try {
      switch (commandName.toLowerCase()) {
        case 'help':
          showHelp();
          break;
        case 'clear':
          setOutput([]);
          addOutput(getPrompt(), 'prompt');
          return;
        case 'ls':
        case 'dir':
          listFiles();
          break;
        case 'pwd':
          showCurrentDirectory();
          break;
        case 'cat':
          showFile(args[0]);
          break;
        case 'rust':
          handleRustCommand(args);
          break;
        case 'motoko':
          handleMotokoCommand(args);
          break;
        case 'dfx':
          handleDfxCommand(args);
          break;
        case 'compile':
          await compileCurrentProject();
          break;
        case 'deploy':
          await deployCurrentProject();
          break;
        case 'test':
          await testCurrentProject(args.join(' '));
          break;
        case 'new':
          await createNewProject(args);
          break;
        case 'load':
          await loadProject(args[0]);
          break;
        case 'save':
          await saveCurrentProject();
          break;
        default:
          addOutput(`Command not found: ${commandName}`, 'error');
          addOutput('Type "help" for available commands', 'info');
      }
    } catch (error) {
      addOutput(`Error: ${error.message}`, 'error');
    }

    // Add new prompt
    addOutput(getPrompt(), 'prompt');
  };

  const showHelp = () => {
    const helpText = [
      'Available Commands:',
      '',
      'Project Management:',
      '  new <name> <language>    Create a new project (rust/motoko/js)',
      '  load <project_id>        Load an existing project',
      '  save                     Save current project',
      '  ls, dir                  List files in current project',
      '  cat <filename>           Display file contents',
      '',
      'Development:',
      '  compile                  Compile current project',
      '  deploy                   Deploy project to IC',
      '  test <input>             Test current project',
      '  rust <command>           Rust-specific commands',
      '  motoko <command>         Motoko-specific commands',
      '  dfx <command>            DFX commands',
      '',
      'System:',
      '  clear                    Clear terminal',
      '  help                     Show this help',
      '  pwd                      Show current directory',
      '',
      'Rust Commands:',
      '  rust new <name>          Create new Rust project',
      '  rust build               Build Rust project',
      '  rust test                Run Rust tests',
      '  rust check               Check Rust code',
      '',
      'Motoko Commands:',
      '  motoko new <name>        Create new Motoko project',
      '  motoko check             Check Motoko code',
      '  motoko compile           Compile Motoko code'
    ];
    
    helpText.forEach(line => addOutput(line, 'info'));
  };

  const listFiles = () => {
    if (!currentProject) {
      addOutput('No project loaded', 'error');
      return;
    }

    const files = [
      { name: 'src/', type: 'dir' },
      { name: 'Cargo.toml', type: 'file' },
      { name: 'dfx.json', type: 'file' },
      { name: 'README.md', type: 'file' }
    ];

    files.forEach(file => {
      const icon = file.type === 'dir' ? '📁' : '📄';
      addOutput(`${icon} ${file.name}`, 'info');
    });
  };

  const showCurrentDirectory = () => {
    const projectName = currentProject ? currentProject.name : 'no-project';
    addOutput(`/projects/${projectName}`, 'info');
  };

  const showFile = (filename) => {
    if (!filename) {
      addOutput('Usage: cat <filename>', 'error');
      return;
    }

    if (!currentProject) {
      addOutput('No project loaded', 'error');
      return;
    }

    if (filename === 'src/main.rs' || filename === 'src/lib.rs') {
      addOutput('--- File: src/lib.rs ---', 'info');
      addOutput(currentProject.code || '// No code available', 'code');
    } else {
      addOutput(`File not found: ${filename}`, 'error');
    }
  };

  const handleRustCommand = async (args) => {
    const [subcommand, ...subargs] = args;
    
    switch (subcommand) {
      case 'new':
        if (subargs.length === 0) {
          addOutput('Usage: rust new <project_name>', 'error');
          return;
        }
        await createNewProject(subargs[0], 'rust', '// Rust project template\nfn main() {\n    println!("Hello, Internet Computer!");\n}');
        break;
      case 'build':
        addOutput('Building Rust project...', 'info');
        await compileCurrentProject();
        break;
      case 'check':
        addOutput('Checking Rust code...', 'info');
        await compileCurrentProject();
        break;
      case 'test':
        addOutput('Running Rust tests...', 'info');
        await testCurrentProject('test');
        break;
      default:
        addOutput('Unknown Rust command. Available: new, build, check, test', 'error');
    }
  };

  const handleMotokoCommand = async (args) => {
    const [subcommand, ...subargs] = args;
    
    switch (subcommand) {
      case 'new':
        if (subargs.length === 0) {
          addOutput('Usage: motoko new <project_name>', 'error');
          return;
        }
        await createNewProject(subargs[0], 'motoko', '// Motoko project template\nimport Principal "mo:base/Principal";\n\nactor Hello {\n    public func greet(name : Text) : async Text {\n        return "Hello, " # name # "!";\n    };\n}');
        break;
      case 'check':
        addOutput('Checking Motoko code...', 'info');
        await compileCurrentProject();
        break;
      case 'compile':
        addOutput('Compiling Motoko code...', 'info');
        await compileCurrentProject();
        break;
      default:
        addOutput('Unknown Motoko command. Available: new, check, compile', 'error');
    }
  };

  const handleDfxCommand = async (args) => {
    const command = args.join(' ');
    addOutput(`Executing: dfx ${command}`, 'info');
    
    if (command.includes('start')) {
      addOutput('✅ DFX replica started', 'success');
    } else if (command.includes('deploy')) {
      await deployCurrentProject();
    } else if (command.includes('generate')) {
      addOutput('✅ Candid files generated', 'success');
    } else {
      addOutput(`DFX command: ${command}`, 'info');
    }
  };

  const createNewProject = async (name, language, initialCode) => {
    const { createNewProject: createProject } = useIDE();
    const projectId = await createProject(name, language, initialCode);
    if (projectId) {
      addOutput(`✅ Created project: ${name} (${language})`, 'success');
    }
  };

  const loadProject = async (projectId) => {
    const { loadProject: loadProj } = useIDE();
    await loadProj(projectId);
    addOutput(`✅ Loaded project: ${projectId}`, 'success');
  };

  const saveCurrentProject = async () => {
    const { saveProjectCode, currentProject } = useIDE();
    if (currentProject) {
      await saveProjectCode(currentProject.id, currentProject.code);
      addOutput('✅ Project saved', 'success');
    } else {
      addOutput('No project to save', 'error');
    }
  };

  const compileCurrentProject = async () => {
    const { compileCurrentProject: compile } = useIDE();
    await compile();
  };

  const deployCurrentProject = async () => {
    const { deployCurrentProject: deploy } = useIDE();
    await deploy();
  };

  const testCurrentProject = async (input) => {
    const { testCurrentProject: test } = useIDE();
    await test(input);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(command);
      setCommand('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex] || '');
      } else {
        setHistoryIndex(commandHistory.length);
        setCommand('');
      }
    }
  };

  const getOutputStyle = (type) => {
    switch (type) {
      case 'command':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'success':
        return 'text-green-300';
      case 'info':
        return 'text-blue-300';
      case 'code':
        return 'text-gray-300 font-mono text-sm';
      case 'prompt':
        return 'text-green-400 font-bold';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div 
      ref={terminalRef} 
      style={{ 
        height, 
        width: '100%',
        backgroundColor: '#1e1e1e',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }} 
    >
      {/* Terminal Output */}
      <div 
        className="flex-1 p-4 overflow-y-auto font-mono text-sm"
        style={{ backgroundColor: '#1e1e1e' }}
      >
        {output.map((line, index) => (
          <div key={index} className={getOutputStyle(line.type)}>
            {line.text}
          </div>
        ))}
      </div>
      
      {/* Terminal Input */}
      <div className="flex items-center p-2 border-t border-gray-600">
        <span className="text-green-400 font-bold mr-2">{getPrompt()}</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-transparent text-white outline-none font-mono"
          placeholder="Type a command..."
          autoFocus
        />
      </div>
    </div>
  );
};

export default Terminal;
