# ICPad - Internet Computer Development Platform

A modern, web-based IDE and development platform for building decentralized applications (dApps) on the Internet Computer (IC) blockchain.

## 🚀 Overview

ICPad is a comprehensive development environment that combines a modern React-based UI with Internet Computer canister deployment capabilities. It provides developers with an intuitive interface for creating, testing, and deploying dApps on the IC network.

## ✨ Features

- **Modern Web IDE** - React-based interface with syntax highlighting and real-time editing
- **Canister Management** - Deploy and manage Internet Computer canisters
- **Template Marketplace** - Browse and use pre-built canister templates
- **Multi-Network Support** - Deploy to local, testnet, and mainnet networks
- **Dark/Light Theme** - Customizable UI themes for better development experience
- **Real-time Terminal** - Integrated terminal for deployment and debugging

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with React Router
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with custom theme system
- **State Management**: React Context for theme management

### Backend (Rust + Internet Computer)
- **Language**: Rust with IC CDK
- **Canister Type**: Rust canister for backend logic
- **Interface**: Candid for type-safe communication

### Project Structure
```
ICPad/
├── src/
│   ├── ICPad_frontend/          # React frontend application
│   │   ├── src/
│   │   │   ├── Pages/           # Main application pages
│   │   │   ├── components/      # Reusable UI components
│   │   │   ├── contexts/        # React contexts
│   │   │   └── utils/           # Utility functions
│   │   ├── dist/                # Built frontend assets
│   │   └── package.json         # Frontend dependencies
│   ├── ICPad_backend/           # Rust backend canister
│   │   ├── src/
│   │   │   └── lib.rs           # Main canister logic
│   │   └── ICPad_backend.did    # Candid interface
│   └── declarations/            # Generated canister bindings
├── dfx.json                     # DFX configuration
├── package.json                 # Root package configuration
└── Cargo.toml                   # Rust dependencies
```

## 🛠️ Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (>= 16.0.0)
- **npm** (>= 7.0.0)
- **Rust** (latest stable)
- **DFX** (Internet Computer SDK)
- **Git**

### Installing DFX

```bash
# Install DFX
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Verify installation
dfx --version
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ICPad
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd src/ICPad_frontend
npm install
cd ../..
```

### 3. Start the Local Internet Computer Network

```bash
# Start local IC network in background
dfx start --clean --background
```

### 4. Deploy the Backend Canister

```bash
# Deploy the backend canister
dfx deploy ICPad_backend
```

### 5. Start the Frontend Development Server

```bash
# Start the frontend (from project root)
cd src/ICPad_frontend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000 (or 3001 if 3000 is busy)
- **Canister Interface**: http://127.0.0.1:4943/?canisterId=[CANISTER_ID]

## 📱 Application Pages

### Landing Page
Welcome page with project overview and quick start guide.

### Dashboard
Central hub for managing your dApp projects and deployed canisters.

### IDE
Integrated development environment with:
- Code editor with syntax highlighting
- File explorer
- Integrated terminal
- Real-time deployment capabilities

### Marketplace
Browse and download pre-built canister templates and components.

### Deploy
Deploy your dApps to different networks:
- Local development network
- IC testnet
- IC mainnet

### Settings
Configure your development environment and preferences.

## 🔧 Development

### Frontend Development

```bash
cd src/ICPad_frontend

# Start development server
npm start

# Build for production
npm run build

# Format code
npm run format
```

### Backend Development

```bash
# Build the Rust canister
dfx build ICPad_backend

# Deploy to local network
dfx deploy ICPad_backend

# Deploy to mainnet
dfx deploy --network ic ICPad_backend
```

### Adding New Features

1. **Frontend Components**: Add new components in `src/ICPad_frontend/src/components/`
2. **Pages**: Create new pages in `src/ICPad_frontend/src/Pages/`
3. **Backend Functions**: Add new functions in `src/ICPad_backend/src/lib.rs`
4. **Canister Interface**: Update `src/ICPad_backend/ICPad_backend.did`

## 🌐 Network Configuration

### Local Development
- Network: `local`
- URL: `http://localhost:4943`

### Testnet
- Network: `ic_testnet`
- URL: `https://ic0.testnet.app`

### Mainnet
- Network: `ic`
- URL: `https://ic0.app`

## 🔗 Canister Integration

The project includes generated TypeScript/JavaScript bindings for the backend canister:

```javascript
import { createActor, ICPad_backend } from 'declarations/ICPad_backend';

// Create actor instance
const actor = createActor(process.env.CANISTER_ID_ICPAD_BACKEND);

// Call canister functions
const greeting = await actor.greet("World");
```

## 🚀 Deployment

### Deploy to Mainnet

```bash
# Deploy backend canister to mainnet
dfx deploy --network ic ICPad_backend

# Deploy frontend canister to mainnet
dfx deploy --network ic ICPad_frontend
```

### Environment Variables

The application uses environment variables for configuration:

- `CANISTER_ID_ICPAD_BACKEND`: Backend canister ID
- `DFX_NETWORK`: Target network (local, ic_testnet, ic)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the project wiki for detailed guides
- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join community discussions on GitHub Discussions

## 🔮 Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced debugging tools
- [ ] Canister performance monitoring
- [ ] Template marketplace integration
- [ ] Multi-language support (Motoko, Rust, TypeScript)
- [ ] CI/CD pipeline integration

---

**Built with ❤️ for the Internet Computer ecosystem**
