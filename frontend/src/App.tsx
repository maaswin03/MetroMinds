import { useAuth } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './Dashboard/Dashboard';
import Home from "./Home/Home";
import Signin from "./Autentication/Signin";
import EarthQuakeMonitoring from "./EarthQuakeMonitoring/EarthQuakeMonitoring";
import Citysoundmonitoring from "./Citysoundmonitoring/Citysoundmonitoring";
import Loading from "./AddedWidget/Loading";

export default function App() {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <Loading/>;
  }

  return (
    <Router>
      <Routes>
        {isSignedIn ? (
          <Route path="/dashboard" element={<Dashboard />} />
        ) : (
          <Route path="/dashboard" element={<Navigate to="/Signin" />} />
        )}
        {isSignedIn ? (
          <Route path="/earthquakemonitoring" element={<EarthQuakeMonitoring/>} />
        ) : (
          <Route path="/earthquakemonitoring" element={<Navigate to="/Signin" />} />
        )}
        {isSignedIn ? (
          <Route path="/citysoundmonitoring" element={<Citysoundmonitoring/>} />
        ) : (
          <Route path="/citysoundmonitoring" element={<Navigate to="/Signin" />} />
        )}

        <Route path="/" element={<Home />} />
        <Route path="/Signin" element={<Signin />} />
      </Routes>
    </Router>
  );
}

