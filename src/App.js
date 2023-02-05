import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from "./pages/Home"
import About from "./pages/About";
function App() {
  return (
    <Router>
      <div style={{resize:"none"}}>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
