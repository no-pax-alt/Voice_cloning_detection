import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/Shared";
import App from "./voiceguard";
export default function RootApp() { return <ErrorBoundary><ToastProvider><App /></ToastProvider></ErrorBoundary>; }
