import LandingPage from "./pages/landingpage";
import SensorMap from "./pages/sensormap";
import DashboardPage from "./pages/dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
// import { handleRedirectResult } from "./auth/signin-funcs";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sensor_map" element={<SensorMap />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
