import "./App.scss";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { auth, googleProvider } from "./config/firebase-config";
import { signInWithPopup, signOut } from "firebase/auth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import LanguagePage from "./pages/LanguagePage";
import LessonPage from "./pages/LessonPage";
import Landing from "./pages/Landing";
import Soon from "./pages/Soon";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then((result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
    });
  };

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        localStorage.setItem("isAuth", false);
        setIsAuth(false);
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };
  return (
    <Router>
      <nav>
        <Link to="/Home">Home</Link>
        <Link to="/Admin">Admin</Link>
        {isAuth ? (
          <button onClick={signOutUser}>Sign out</button>
        ) : (
          <button onClick={signInWithGoogle}>Sign in with Google</button>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/:languageName" element={<LanguagePage />} />
        <Route path="/:languageName/:lessonId" element={<LessonPage />} />
        <Route path="/:languageName/:levelId/:lessonId" element={<Soon />} />
      </Routes>
    </Router>
  );
}

export default App;
