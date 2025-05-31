import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import IndexPage from "./Pages/IndexPage";
import RegisterPage from "./Pages/RegisterPage";
import SettingsPanel from "./components/SettinPanel";
import EditProfile from "./components/EditProfile";
import Account from "./components/Account";
import Ranking from "./components/Ranking";
import Cart from "./components/Cart";
import Checkout from "./components/checkaout";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />      {/* αρχική σελίδα */}
        <Route path="/home" element={<IndexPage />} />  {/* μετά το login */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/settings" element={<SettingsPanel/>}   />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/account" element={<Account />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/cart" element={<Cart></Cart>}></Route>
        <Route path="/checkout" element={<Checkout />} />




      </Routes>
    </Router>

  );
}

export default App;
