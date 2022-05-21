import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Menu from "./components/Menu";


import LogIn from "./Pages/LogIn";
import Register from "./Pages/Register"
import Auctions from "./Pages/Auctions"
import UserProfile from "./Pages/UserProfile"

function App() {
  return (
      <div className={App}>
          <Router>

              <Menu />
              <Routes>
                  <Route path="/" element={<Auctions />} />
                  <Route path="/login" element={<LogIn />} />
                  <Route path="/register" element={<Register/>} />
                  {/*<Route path='/create' element={<CreateAuction />}/>*/}
                  {/*<Route path="/myauctions" element={<MyAuctions/>} />*/}
                  {/*<Route path='/auction/:auctionId' element={<AuctionItemPage />}/>*/}
                  <Route path="/userprofile" element={<UserProfile />} />
                  {/*<Route path="/editProfile" element={<editProfile/>} />*/}
              </Routes>
          </Router>
      </div>
  );
}

export default App;
