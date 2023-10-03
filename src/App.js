import "./App.scss";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up an authentication observer
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in.
        setUser(authUser);
      } else {
        // User is signed out.
        setUser(null);
      }
    });

    // Clean up the observer when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Router>
      <nav>
        <div>
          <NavLink to="/Home">Home</NavLink>
          <NavLink to="/Admin">Admin</NavLink>
        </div>
        {user ? (
          <div>
            <p>Welcome, {user.displayName}!</p>
            <button onClick={signOutUser}>Sign out</button>
          </div>
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
