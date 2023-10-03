import "./App.scss";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import { auth, googleProvider, db } from "./config/firebase-config";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
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
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const userRef = collection(db, "users");
        const userDocRef = doc(userRef, authUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({ ...authUser, ...userData });
        } else {
          try {
            const newUserData = {
              name: user.displayName,
              admin: false,
            };
            await setDoc(userDocRef, newUserData);
          } catch (error) {
            console.error("Error fetching user data from Firestore:", error);
          }
        }
      } else {
        setUser(null);
      }
    });

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
            <p>admin or not: {user.admin}</p>
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
        <Route path="/Admin" element={<Admin user={user} />} />
        <Route path="/:languageName" element={<LanguagePage />} />
        <Route path="/:languageName/:lessonId" element={<LessonPage />} />
        <Route path="/:languageName/:levelId/:lessonId" element={<Soon />} />
      </Routes>
    </Router>
  );
}

export default App;
