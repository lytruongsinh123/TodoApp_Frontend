import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AIChatPopup from "./pages/AI_Support/AI_Support.tsx";
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
        <AIChatPopup/>
    </StrictMode>
);
