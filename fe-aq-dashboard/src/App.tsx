import LandingPage from "./pages/landingpage";
import SensorMap from "./pages/sensormap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sensor_map" element={<SensorMap />} />
      </Routes>
    </Router>
  );
}

export default App;
