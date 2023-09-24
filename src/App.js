import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import LanguagePage from "./pages/LanguagePage"; // Import LanguagePage component

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/Admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/:languageName" element={<LanguagePage />} />
      </Routes>
    </Router>
  );
}

export default App;
