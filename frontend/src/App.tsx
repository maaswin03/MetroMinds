import { useAuth } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './Dashboard/Dashboard';
import Home from "./Home/Home";
import Signin from "./Autentication/Signin";

export default function App() {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {isSignedIn ? (
          <Route path="/dashboard" element={<Dashboard />} />
        ) : (
          <Route path="/dashboard" element={<Navigate to="/" />} />
        )}

        <Route path="/" element={<Home />} />
        <Route path="*" element={<Signin />} />
      </Routes>
    </Router>
  );
}
