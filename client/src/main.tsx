import { createRoot } from "react-dom/client";
import App from "./App";
import { TranslationProvider } from "./lib/i18n/context";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <TranslationProvider>
    <App />
  </TranslationProvider>
);
