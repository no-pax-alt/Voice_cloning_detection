import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/Shared";
import "./phase2-visual-foundation.css";
import App from "./voiceguard";
import DashboardPage from "./pages/DashboardPage";
import LiveCallPage from "./pages/LiveCallPage";
import AnalysisPage from "./pages/AnalysisPage";

function Phase3Routes() {
  const path = window.location.pathname;
  if (path === "/migration/dashboard") return <DashboardPage />;
  if (path === "/migration/live-call") return <LiveCallPage />;
  if (path === "/migration/analyze") return <AnalysisPage />;
  return <App />;
}

export default function RootApp() {
  return <ErrorBoundary><ToastProvider><Phase3Routes /></ToastProvider></ErrorBoundary>;
}
