import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./components/Shared";
import VoiceGuardLayout from "./components/VoiceGuardLayout";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import AnalysisResult from "./pages/AnalysisResult";
import History from "./pages/History";
import Report from "./pages/Report";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function AppRouter() {
  return <VoiceGuardLayout><Switch><Route path="/" component={() => <Redirect to="/dashboard" />} /><Route path="/dashboard" component={Home} /><Route path="/analyze" component={Analyze} /><Route path="/history" component={History} /><Route path="/analysis/:id" component={AnalysisResult} /><Route path="/report/:id" component={Report} /><Route path="/settings" component={Settings} /><Route component={NotFound} /></Switch></VoiceGuardLayout>;
}

export default function App() { return <ErrorBoundary><ToastProvider><AppRouter /></ToastProvider></ErrorBoundary>; }
