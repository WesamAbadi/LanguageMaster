import { auth, googleProvider } from "../config/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";
export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h2>Auth</h2>
      <input onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
      />
      <button onClick={signIn}>Login</button>
      <button onClick={signInWithGoogle}>sign in with google</button>
      <button onClick={logout}>logout</button>
    </div>
  );
};
