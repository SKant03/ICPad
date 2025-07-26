# ICPad IDE-Canister Integration Guide

## Overview

This guide documents the integration between the ICPad IDE frontend and the Internet Computer backend canister. The integration allows users to create, edit, compile, deploy, and test projects directly from the web-based IDE.

## Architecture

### Backend (Rust Canister)
- **Location**: `src/ICPad_backend/`
- **Canister ID**: `umunu-kh777-77774-qaaca-cai` (local)
- **Language**: Rust with ic-cdk
- **Features**:
  - Project management (create, read, update)
  - Code compilation simulation
  - Deployment simulation
  - Project testing

### Frontend (React)
- **Location**: `src/ICPad_frontend/`
- **Framework**: React with Vite
- **Language**: JavaScript/JSX
- **Features**:
  - Real-time code editor
  - Project file explorer
  - Terminal output
  - Canister integration

## Key Components

### 1. Canister Service (`src/ICPad_frontend/src/utils/canisterService.js`)
Handles all communication with the backend canister:
- Project CRUD operations
- Compilation requests
- Deployment requests
- Testing functionality

### 2. IDE Context (`src/ICPad_frontend/src/contexts/IDEContext.jsx`)
Manages IDE state and provides canister interaction methods:
- Current project state
- Terminal output
- Loading states
- Connection status

### 3. IDE Page (`src/ICPad_frontend/src/Pages/IDEpage.jsx`)
Main IDE interface with:
- Code editor
- Project sidebar
- Terminal panel
- Project info panel

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- DFX (v0.28.0+)
- Rust toolchain

### 1. Start Local Network
```bash
dfx start --background
```

### 2. Deploy Backend Canister
```bash
dfx deploy ICPad_backend
```

### 3. Generate Type Declarations
```bash
dfx generate ICPad_backend
```

### 4. Start Frontend
```bash
cd src/ICPad_frontend
npm start
```

## Testing the Integration

### 1. Access the IDE
Navigate to `http://localhost:3000/ide`

### 2. Test Connection
The IDE will automatically test the connection to the canister. You should see:
- ✅ Connected to ICPad backend canister
- 📁 Loaded X projects

### 3. Create a Test Project
1. Click the ➕ button in the Projects sidebar
2. Enter a project name (e.g., "My First DApp")
3. Select a language (Motoko or Rust)
4. Click "Create"

### 4. Test Project Operations
- **Edit Code**: Modify the code in the editor
- **Save**: Click the 💾 Save button
- **Compile**: Click the "Compile" button
- **Test**: Enter test input and click "Test"
- **Deploy**: Click the "Deploy" button

## API Endpoints

### Project Management
- `create_project(name, language, initial_code)` → `project_id`
- `get_project(project_id)` → `Project`
- `list_projects()` → `[Project]`
- `update_project_code(project_id, code)` → `bool`

### Development Operations
- `compile_project(project_id)` → `CompileResult`
- `deploy_project(project_id)` → `DeployResult`
- `test_project(project_id, test_input)` → `string`

## Data Structures

### Project
```rust
pub struct Project {
    pub id: String,
    pub name: String,
    pub language: String,
    pub code: String,
    pub status: String,
    pub canister_id: Option<String>,
    pub created_at: u64,
    pub updated_at: u64,
}
```

### CompileResult
```rust
pub struct CompileResult {
    pub success: bool,
    pub output: String,
    pub errors: Vec<String>,
}
```

### DeployResult
```rust
pub struct DeployResult {
    pub success: bool,
    pub canister_id: Option<String>,
    pub url: Option<String>,
    pub output: String,
}
```

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Ensure the local network is running: `dfx start --background`
   - Check if the backend canister is deployed: `dfx canister status ICPad_backend`
   - Verify the canister ID in `canisterService.js`

2. **Type Declarations Missing**
   - Run: `dfx generate ICPad_backend`
   - Check that `src/declarations/ICPad_backend/` exists

3. **Frontend Not Loading**
   - Check if the dev server is running: `lsof -i :3000`
   - Restart: `cd src/ICPad_frontend && npm start`

4. **Canister Errors**
   - Check canister logs: `dfx canister call ICPad_backend greet 'test'`
   - Redeploy if needed: `dfx deploy ICPad_backend`

### Debug Mode
To enable debug logging, add this to the browser console:
```javascript
localStorage.setItem('debug', 'icpad:*');
```

## Next Steps

1. **Real Compilation**: Replace simulation with actual Motoko/Rust compilation
2. **Persistent Storage**: Implement stable storage for projects
3. **User Authentication**: Add user management and project ownership
4. **Collaboration**: Enable real-time collaboration features
5. **Advanced IDE**: Add syntax highlighting, autocomplete, and debugging

## Contributing

When making changes to the integration:

1. Update the backend canister code
2. Regenerate type declarations: `dfx generate ICPad_backend`
3. Update the frontend service layer if needed
4. Test all operations end-to-end
5. Update this documentation 