import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./Home/Home"
import Dashboard from "./Dashboard/Dashboard";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App