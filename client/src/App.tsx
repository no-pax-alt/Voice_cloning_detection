import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/Shared";
import "./phase2-visual-foundation.css";
import App from "./voiceguard";
export default function RootApp() { return <ErrorBoundary><ToastProvider><App /></ToastProvider></ErrorBoundary>; }
