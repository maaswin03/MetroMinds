import FloodMonitoring from "./app/Dashboard/FloodMonitoring";
import Userlogin from "./app/Authentication/Userlogin";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FourSquare } from "react-loading-indicators";
import Home from "./app/Home/Home";
import EarthquakeMonitoring from "./app/Dashboard/EarthquakeMonitoring";
import WasteMonitoring from "./app/Dashboard/WasteManagement";
import NoiseMonitoring from "./app/Dashboard/NoiseMonitoring";
import TrafficMonitoring from "./app/Dashboard/TrafficMonitoring";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/User/Authentication" element={<RedirectAuthenticated><Userlogin /></RedirectAuthenticated>} />
        <Route path="/Dashboard/FloodMonitoring" element={<PrivateRoute><FloodMonitoring/></PrivateRoute>} />
        <Route path="/Dashboard/EarthquakeMonitoring" element={<PrivateRoute><EarthquakeMonitoring/></PrivateRoute>} />
        <Route path="/Dashboard/WasteMonitoring" element={<PrivateRoute><WasteMonitoring/></PrivateRoute>} />
        <Route path="/Dashboard/NoiseMonitoring" element={<PrivateRoute><NoiseMonitoring/></PrivateRoute>} />
        <Route path="/Dashboard/TrafficMonitoring" element={<PrivateRoute><TrafficMonitoring/></PrivateRoute>} />

        {/* <Route
          path="/User/Authentication"
          element={
            <RedirectAuthenticated>
              <Userlogin />
            </RedirectAuthenticated>
          }
        />
        <Route
          path="/Dashboard/FloodMonitoring"
          element={<FloodMonitoring />}
        />
        <Route
          path="/Dashboard/EarthquakeMonitoring"
          element={<EarthquakeMonitoring />}
        />
        <Route
          path="/Dashboard/WasteMonitoring"
          element={<WasteMonitoring />}
        />
        <Route
          path="/Dashboard/NoiseMonitoring"
          element={<NoiseMonitoring />}
        />
        <Route
          path="/Dashboard/TrafficMonitoring"
          element={<TrafficMonitoring />}
        /> */}
      </Routes>
    </Router>
  );
}

function RedirectAuthenticated({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return (
      <div>
        <FourSquare color="blue" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return (
      <div>
        <FourSquare color="blue" size="medium" text="" textColor="" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/User/Authentication" />;
  }

  return children;
}
