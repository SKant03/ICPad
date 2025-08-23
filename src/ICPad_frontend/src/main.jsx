import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { PrincipalProvider } from "./contexts/PrincipalContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
        <PrincipalProvider>
            <App />
        </PrincipalProvider>
        </BrowserRouter>
    </React.StrictMode>
)