import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Menu from "./components/Menu";


import LogIn from "./Pages/LogIn";
import Register from "./Pages/Register"
import Auctions from "./Pages/Auctions"

function App() {
  return (
      <div className={App}>
          <Router>

              <Menu />
              <Routes>
                  <Route path="/" element={<Auctions />} />
                  <Route path="/login" element={<LogIn />} />
                  <Route path="/register" element={<Register/>} />
                  {/*<Route path='/auction/:auctionId' element={<AuctionItemPage />}/>*/}
              </Routes>
          </Router>
      </div>
  );
}

export default App;
