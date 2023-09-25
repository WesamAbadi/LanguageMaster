import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import LanguagePage from "./pages/LanguagePage";
import LessonPage from "./pages/LessonPage";
import Soon from "./pages/Soon";

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
        <Route path="/:languageName/:lessonId" element={<LessonPage />} />
        <Route path="/:languageName/:levelId/:lessonId" element={<Soon />} />
      </Routes>
    </Router>
  );
}

export default App;
