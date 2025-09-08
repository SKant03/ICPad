# ICPad Terminal Demo

## 🚀 Online IDE with Rust and Motoko Support

Your ICPad application now includes a fully functional online terminal that supports both Rust and Motoko development for the Internet Computer!

## ✨ Features

### 🖥️ Interactive Terminal
- **xterm.js integration** - Full-featured terminal emulator
- **Command history** - Navigate through previous commands
- **Tab completion** - Auto-complete commands and file names
- **Syntax highlighting** - Color-coded output for better readability
- **Resizable** - Adjust terminal height as needed

### 🦀 Rust Support
- **Create projects**: `rust new my_project`
- **Build/Check**: `rust build`, `rust check`
- **Run tests**: `rust test`
- **Compile**: `compile` (compiles current project)

### 🎯 Motoko Support
- **Create projects**: `motoko new my_project`
- **Check code**: `motoko check`
- **Compile**: `motoko compile`

### 🔧 Development Commands
- **Project management**: `new`, `load`, `save`, `ls`, `cat`
- **DFX integration**: `dfx start`, `dfx deploy`, `dfx generate`
- **Compilation**: `compile` (compiles current project)
- **Deployment**: `deploy` (deploys to Internet Computer)
- **Testing**: `test <input>` (tests current project)

## 🎮 How to Use

### 1. Access the IDE
Open your browser and navigate to:
**http://u6s2n-gx777-77774-qaaba-cai.localhost:4943/**

### 2. Create a New Project
In the terminal, type:
```bash
rust new hello_world
# or
motoko new hello_world
```

### 3. Load a Project
```bash
load <project_id>
```

### 4. View Files
```bash
ls                    # List files
cat src/lib.rs        # View source code
```

### 5. Compile and Deploy
```bash
compile               # Compile current project
deploy                # Deploy to Internet Computer
test "Hello World"    # Test the project
```

### 6. DFX Commands
```bash
dfx start             # Start DFX replica
dfx deploy            # Deploy canisters
dfx generate          # Generate Candid files
```

## 🎨 Terminal Features

### Command Help
Type `help` to see all available commands:
- Project management commands
- Development commands
- System commands
- Language-specific commands

### File Operations
- `ls` / `dir` - List files in current project
- `cat <filename>` - Display file contents
- `pwd` - Show current directory
- `cd <path>` - Change directory

### Project Operations
- `new <name> <language>` - Create new project
- `load <project_id>` - Load existing project
- `save` - Save current project
- `compile` - Compile current project
- `deploy` - Deploy current project
- `test <input>` - Test current project

## 🔧 Technical Details

### Backend Integration
- **Rust canister** handles all terminal commands
- **Project storage** in canister memory
- **Compilation simulation** for Rust and Motoko
- **Deployment simulation** to Internet Computer
- **Real-time command execution**

### Frontend Features
- **Monaco Editor** with syntax highlighting
- **Language switching** between Rust, Motoko, and JavaScript
- **Project sidebar** for easy navigation
- **Terminal integration** with IDE context
- **Real-time updates** and status indicators

## 🎯 Example Workflow

1. **Create a Rust project**:
   ```bash
   rust new my_rust_app
   ```

2. **View the generated code**:
   ```bash
   cat src/lib.rs
   ```

3. **Compile the project**:
   ```bash
   compile
   ```

4. **Deploy to Internet Computer**:
   ```bash
   deploy
   ```

5. **Test the deployment**:
   ```bash
   test "Alice"
   ```

## 🌟 Next Steps

Your ICPad IDE is now ready for Internet Computer development! You can:
- Create and manage multiple projects
- Write Rust and Motoko code with full IDE support
- Compile and test your code
- Deploy to the Internet Computer
- Use the integrated terminal for all development tasks

Happy coding! 🚀
