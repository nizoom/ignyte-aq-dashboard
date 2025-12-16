import LandingPage from "./pages/landingpage";
import SensorMap from "./pages/sensormap";
import DashboardPage from "./pages/dashboard";
import BatteryDiagPage from "./pages/batter-diag";

import RequireAuth from "./auth/user-types/require-user";
import RequireResearcher from "./auth/user-types/require-researcher";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sensor_map" element={<SensorMap />} />

        {/* 🔒 Authenticated routes */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* 🔬 Researcher-only routes */}
          {/* <Route element={<RequireResearcher />}> */}
          <Route path="/battery_diagnostics" element={<BatteryDiagPage />} />
          {/* </Route> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
