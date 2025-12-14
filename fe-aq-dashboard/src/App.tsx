import LandingPage from "./pages/landingpage";
import SensorMap from "./pages/sensormap";
import DashboardPage from "./pages/dashboard";
import BatteryDiagPage from "./pages/batter-diag";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sensor_map" element={<SensorMap />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/battery_diagnostics" element={<BatteryDiagPage />} />
      </Routes>
    </Router>
  );
}

export default App;
