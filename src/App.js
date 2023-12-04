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
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
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
  const [level, setLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const initialCheckboxes = [
    { id: "AI assistant", isChecked: true },
    { id: "Popup translation", isChecked: false },
    { id: "Music player", isChecked: false },
  ];
  const initialSettings = { language: "English", number: 1 };
  const [showOverlay, setShowOverlay] = useState(false);

  const [checkboxes, setCheckboxes] = useState(initialCheckboxes);
  const [theme, setTheme] = useState({ isChecked: true });
  const [settings, setSettings] = useState(initialSettings);
  const [openIndex, setOpenIndex] = useState(null);

  const faqItems = [
    {
      question: "Is this a beta version?",
      answer: "Yes, this is a beta version.",
    },
    { question: "Is it free?", answer: "Yes, it is free to use." },
    {
      question: "How can I contribute?",
      answer:
        "You can contribute by requesting an admin role and sumbitting your content.",
    },
    {
      question: "How can I report bugs?",
      answer:
        "To report bugs, please click the report button at the bottom of any lesson and state your issue.",
    },
    {
      question: "What are the benefits of this site?",
      answer:
        "It is a fun and educational learning platform that offers multiple languages. It is also a great way to enhance your vocabulary. You can also get a free lesson plan for free.",
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
          setLevel(userData.lvl || 0);
          setUser({ ...authUser, ...userData });

          // if (authUser.displayName === null) {
          //   try {
          //     const name = prompt("Enter your name");
          //     if (name !== null) {
          //       const updatedUser = { ...authUser, displayName: name };
          //       await setDoc(userDocRef, updatedUser);
          //       setUser(updatedUser);
          //     } else {
          //       console.log("User cancelled entering name");
          //     }
          //   } catch (error) {
          //     console.error("Error updating display name:", error);
          //   }
          // }
        } else {
          try {
            const newUserData = {
              name: authUser.displayName,
              email: authUser.email,
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
      setTimeout(() => {
        setLoading(false);
      }, 300);
    });

    return () => {
      unsubscribe();
      const settingsJson = localStorage.getItem("settings");
      if (!settingsJson) {
        localStorage.setItem("settings", JSON.stringify(settings));
      }
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const savedCheckboxes = localStorage.getItem("checkboxes");
    const savedSettings = localStorage.getItem("settings");
    const savedTheme = localStorage.getItem("theme");
    if (savedCheckboxes) setCheckboxes(JSON.parse(savedCheckboxes));
    else localStorage.setItem("checkboxes", JSON.stringify(initialCheckboxes));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    else localStorage.setItem("settings", JSON.stringify(initialSettings));
    if (savedTheme) setTheme(JSON.parse(savedTheme));
    else localStorage.setItem("theme", JSON.stringify(theme));
    // eslint-disable-next-line
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
      setShowOverlay(false);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleLogin = async (email = "", password = "") => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const username = email.split("@")[0];
      const user = userCredential.user;
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userDocRef, { name: username }, { merge: true });
      console.log("User logged in:", user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error during login:", errorCode, errorMessage);
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
              setShowOverlay2={setShowOverlay}
              content={
                <div className="faq-container">
                  <p>FAQ</p>
                  <ul>
                    {faqItems.map((item, index) => (
                      <li key={index}>
                        <button onClick={() => handleToggle(index)}>
                          {item.question}
                        </button>
                        <div
                          className={`answer-container ${
                            openIndex === index ? "open" : "closed"
                          }`}
                        >
                          {openIndex === index && <p>{item.answer}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            />
            <OverlayBox
              icon={<FaPuzzlePiece />}
              setShowOverlay2={setShowOverlay}
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
              setShowOverlay2={setShowOverlay}
              content={
                <div>
                  BETA
                  <div
                    style={{ border: "1px solid transparent" }}
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
                    {/* <label>
                      Num of generated answers:
                      <select
                        value={settings.number}
                        onChange={handleNumberChange}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </label> */}
                  </div>
                  {/* <div
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
                  </div> */}
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
              setShowOverlay2={setShowOverlay}
              content={
                <div className="user-info">
                  <div className="xp">
                    <p className="level">Level {level}</p>
                    <p>|</p>
                    <p>{xp} XP</p>
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
          <div>
            <button className="login-button" onClick={signInWithGoogle}>
              Sign in with Google
            </button>
          </div>
        )}
      </nav>
      <div className={` content-container ${showOverlay ? "blur" : ""}`}>
        <Routes>
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route
            path="/"
            element={
              <Landing
                user={user}
                signInWithGoogle={signInWithGoogle}
                handleLogin={() => handleLogin("demo@demo.com", "userdemo")}
              />
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
