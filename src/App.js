import "./App.scss";
import { useState, useEffect } from "react";
import {
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
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);
  const initialCheckboxes = [
    { id: "AI assistant", isChecked: false },
    { id: "Popup translation", isChecked: false },
    { id: "Music player", isChecked: false },
  ];
  const initialSettings = { language: "English", number: 1 };

  const [checkboxes, setCheckboxes] = useState(initialCheckboxes);
  const [theme, setTheme] = useState({ isChecked: true });
  const [settings, setSettings] = useState(initialSettings);
  const [openIndex, setOpenIndex] = useState(null);

  const faqItems = [
    {
      question: "Is this a beta version?",
      answer: "Yes, this is a beta version.",
    },
    { question: "How can I contribute?", answer: "You can contribute by..." },
    { question: "How can I report bugs?", answer: "To report bugs, please..." },
    { question: "Is it free?", answer: "Yes, it is free to use." },
    {
      question: "How can I contact support?",
      answer: "You can contact support by...",
    },
  ];
  const navigate = useNavigate();

  const handleToggle = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
        const userRef = collection(db, "users");
        const userDocRef = doc(userRef, authUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          console.log("Getting User data from Firestore");
          const userData = userDoc.data();
          setXp(userData.xp || 0);
          setUser({ ...authUser, ...userData });
        } else {
          try {
            const newUserData = {
              name: authUser.displayName,
              admin: false,
              createdAt: new Date(
                parseInt(authUser.metadata.createdAt)
              ).toLocaleString(),
              photoURL: authUser.photoURL,
              xp: 0,
            };
            console.log("New user data");
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
      const settingsJson = localStorage.getItem("settings");
      if (!settingsJson) {
        localStorage.setItem("settings", JSON.stringify(settings));
      }
    };
  }, []);

  useEffect(() => {
    const savedCheckboxes = localStorage.getItem("checkboxes");
    const savedSettings = localStorage.getItem("settings");
    const savedTheme = localStorage.getItem("theme");
    if (savedCheckboxes) setCheckboxes(JSON.parse(savedCheckboxes));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedTheme) setTheme(JSON.parse(savedTheme));
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
  const handleLanguageChange = (event) => {
    const newSettings = { ...settings, language: event.target.value };
    setSettings(newSettings);
    saveSettingsToLocalStorage(newSettings);
  };

  const handleNumberChange = (event) => {
    const newSettings = {
      ...settings,
      number: parseInt(event.target.value, 10),
    };
    setSettings(newSettings);
    saveSettingsToLocalStorage(newSettings);
  };
  const handleThemeChange = (event) => {
    const newTheme = {
      ...theme,
      isChecked: !theme.isChecked,
    };
    setTheme(newTheme);
    saveThemeToLocalStorage(newTheme);
  };
  const saveCheckboxesToLocalStorage = (checkboxes) => {
    localStorage.setItem("checkboxes", JSON.stringify(checkboxes));
  };
  const saveSettingsToLocalStorage = (settings) => {
    localStorage.setItem("settings", JSON.stringify(settings));
  };
  const saveThemeToLocalStorage = (theme) => {
    localStorage.setItem("theme", JSON.stringify(theme));
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="gooey">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              ></feGaussianBlur>
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="goo"
              ></feColorMatrix>
              <feBlend in="SourceGraphic" in2="goo"></feBlend>
            </filter>
          </defs>
        </svg>
        <div className="blob blob-0"></div>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>
      </div>
    );
  }
  return (
    <div>
      <nav>
        <div className="flex">
          <NavLink className="logo" to={user ? "/Home" : "/"}>
            <img src={require("./assets/img/logo-cut.png")} alt="logo" />
            Home
          </NavLink>
          {user && <NavLink to="/Admin">Admin</NavLink>}
        </div>
        {user ? (
          <div className="flex">
            <OverlayBox
              icon={<FaRegCircleQuestion />}
              content={
                <div>
                  <p>FAQ</p>
                  <ul>
                    {faqItems.map((item, index) => (
                      <li key={index}>
                        <button onClick={() => handleToggle(index)}>
                          {item.question}
                        </button>
                        {openIndex === index && <p>{item.answer}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              }
            />
            <OverlayBox
              icon={<FaPuzzlePiece />}
              content={
                <div className="extensions-container">
                  <p>Extensions</p>
                  {checkboxes.map((checkbox) => (
                    <div
                      className="extension checkbox-element"
                      key={checkbox.id}
                    >
                      {checkbox.id === "AI assistant" ? (
                        <p>AI assistant (Beta)</p>
                      ) : checkbox.id === "Popup translation" ? (
                        <p>Popup chat (soon)</p>
                      ) : (
                        <p>Music player (soon)</p>
                      )}
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
            <OverlayBox
              icon={<FaGear />}
              content={
                <div>
                  BETA
                  <div
                    style={{ border: "1px solid white" }}
                    className="ai-settings"
                  >
                    <label>
                      AI Language:
                      <select
                        value={settings.language}
                        onChange={handleLanguageChange}
                      >
                        <option value="English">English (Recommended)</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Hungarian">Hungarian</option>
                        <option value="Arabic">Arabic</option>
                      </select>
                    </label>

                    <br />

                    <label>
                      Num of generated answers:
                      <select
                        value={settings.number}
                        onChange={handleNumberChange}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </label>
                  </div>
                  <div
                    style={{ border: "1px solid green" }}
                    className="ui-settings"
                  >
                    <div className="checkbox-element">
                      <p>{`Theme: ${theme.isChecked ? "Dark" : "Light"}`}</p>
                      <input
                        type="checkbox"
                        id="toggleTheme"
                        checked={theme.isChecked}
                        onChange={() => handleThemeChange(theme.isChecked)}
                      />
                      <label htmlFor="toggleTheme">
                        Toggle {theme.isChecked}
                      </label>
                    </div>
                  </div>
                </div>
              }
            />
            <OverlayBox
              icon={
                user.photoURL ? (
                  <img className="user-img" src={user.photoURL} alt="" />
                ) : (
                  <FaCircleUser />
                )
              }
              content={
                <div className="user-info">
                  <div className="xp">
                    <p>level 2</p>
                    <p>{xp}xp</p>
                  </div>
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
          <Route
            path="/"
            element={
              <Landing user={user} signInWithGoogle={signInWithGoogle} />
            }
          />
          <Route
            path="/Login"
            element={<Login user={user} signInWithGoogle={signInWithGoogle} />}
          />
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
