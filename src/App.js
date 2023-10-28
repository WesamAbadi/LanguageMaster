import "./App.scss";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { auth, googleProvider, db } from "./config/firebase-config";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";

import {
  FaPuzzlePiece,
  FaRegCircleQuestion,
  FaGear,
  FaCircleUser,
} from "react-icons/fa6";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import LanguagePage from "./pages/LanguagePage";
import LessonPage from "./pages/LessonPage";
import Landing from "./pages/Landing";
import Soon from "./pages/Soon";
import OverlayBox from "./components/Home/OverlayBox";

function App() {
  const [user, setUser] = useState(null);
  const isAdminUser = user !== null && user.admin === true;
  const [loading, setLoading] = useState(true);
  const initialCheckboxes = [
    { id: "AI assistant", isChecked: false },
    { id: "Popup translation", isChecked: false },
    { id: "Music player", isChecked: false },
  ];
  const [checkboxes, setCheckboxes] = useState(initialCheckboxes);
  const navigate = useNavigate();

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
              name: authUser.displayName, // Access displayName from authUser
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
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const savedCheckboxes = localStorage.getItem("checkboxes");
    if (savedCheckboxes) {
      setCheckboxes(JSON.parse(savedCheckboxes));
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCheckboxChange = (id) => {
    const updatedCheckboxes = checkboxes.map((checkbox) => {
      if (checkbox.id === id) {
        return { ...checkbox, isChecked: !checkbox.isChecked };
      }
      return checkbox;
    });
    setCheckboxes(updatedCheckboxes);
    saveCheckboxesToLocalStorage(updatedCheckboxes);
  };

  const saveCheckboxesToLocalStorage = (checkboxes) => {
    localStorage.setItem("checkboxes", JSON.stringify(checkboxes));
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <nav>
        <div className="flex" >
            <NavLink className="logo" to={user ? "/Home" : "/"}><img src={require("./assets/img/logo-cut.png")} alt="logo" />
            Home</NavLink>
          {user && <NavLink to="/Admin">Admin</NavLink>}
        </div>
        {user ? (
          <div className="flex">
            <OverlayBox
              icon={<FaRegCircleQuestion />}
              content={<div>FAQ</div>}
            />
            <OverlayBox
              icon={<FaPuzzlePiece />}
              content={
                <div className="extensions-container">
                  <p>Extensions (soon)</p>
                  {checkboxes.map((checkbox) => (
                    <div className="extension" key={checkbox.id}>
                      <p>{`${checkbox.id} ${checkbox.isChecked ? "" : ""}`}</p>
                      <input
                        type="checkbox"
                        id={checkbox.id}
                        checked={checkbox.isChecked}
                        onChange={() => handleCheckboxChange(checkbox.id)}
                      />
                      <label htmlFor={checkbox.id}>Toggle {checkbox.id}</label>
                    </div>
                  ))}
                </div>
              }
            />
            <OverlayBox icon={<FaGear />} content={<div>Settings</div>} />
            <OverlayBox
              icon={<FaCircleUser />}
              content={
                <div className="user-info">
                  <p>{user.email}</p>
                  <p>{user.name}</p>
                  <button className="login-button" onClick={signOutUser}>
                    Sign out
                  </button>
                </div>
              }
            />
          </div>
        ) : (
          <button className="login-button" onClick={signInWithGoogle}>
            Sign in with Google
          </button>
        )}
      </nav>
      <div className="content-container">
        <Routes>
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Landing />} />
          <Route path="/Login" element={<Login />} />
          <Route
            path="/Home"
            element={user ? <Home isAuth={user} /> : <Navigate to="/Login" />}
          />
          <Route
            path="/Admin"
            element={user ? <Admin user={user} /> : <Navigate to="/Login" />}
          />
          <Route
            path="/:languageName"
            element={user ? <LanguagePage /> : <Navigate to="/Login" />}
          />
          <Route
            path="/:languageName/:lessonId"
            element={user ? <LessonPage /> : <Navigate to="/Login" />}
          />
          <Route
            path="/:languageName/:levelId/:lessonId"
            element={user ? <Soon /> : <Navigate to="/Login" />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
