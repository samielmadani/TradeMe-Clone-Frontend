import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Menu from "./components/Menu";


import LogIn from "./Pages/LogIn";
import Register from "./Pages/Register"
import Auctions from "./Pages/Auctions"
import UserProfile from "./Pages/UserProfile"

import New from "./Pages/New"
import MyAuctions from "./Pages/MyAuctions"
import Listing from "./Pages/Listing"
import EditProfile from "./Pages/EditProfile"

function App() {
  return (
      <div className={App} >
          <Router>

              <Menu />
              <Routes>
                  <Route path="/" element={<Auctions />} />
                  <Route path="/login" element={<LogIn />} />
                  <Route path="/register" element={<Register/>} />
                  <Route path="/new" element={<New />}/>
                  <Route path="/myauctions" element={<MyAuctions/>} />
                  <Route path="/listing/:auctionId" element={<Listing />}/>
                  <Route path="/userprofile" element={<UserProfile />} />
                  <Route path="/editprofile" element={<EditProfile/>} />
              </Routes>
          </Router>
      </div>
  );
}

export default App;
