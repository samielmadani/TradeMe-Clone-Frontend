import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";


import LogIn from "./Pages/LogIn";
import Register from "./Pages/Register"
import Auctions from "./Pages/Auctions"

function App() {
  return (
      <Router>
        <div className={App}>
            <Navbar />
          <Routes>
              <Route path="/" element={<Auctions />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/register" element={<Register/>} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
