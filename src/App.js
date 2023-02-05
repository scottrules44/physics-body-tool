import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from "./pages/Home"
import About from "./pages/About";
const basename = "physicsBodyTool"
function App() {
  return (
    <Router basename={basename}>
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
