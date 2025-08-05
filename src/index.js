import React from "react";
import ReactDOM from 'react-dom/client';
import App from './App';
import ThemeProviderWrapper from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);

root.render(
    <AuthProvider>
        <ThemeProviderWrapper>
            <App />
        </ThemeProviderWrapper>
    </AuthProvider>
);
