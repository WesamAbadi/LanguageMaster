import React from "react";

function Login(props) {
  const { user, signInWithGoogle } = props;

  return (
    <div className="login-page">
      {user ? (
        <a href="/home" className="cta-button">
          <button>Start!</button>
        </a>
      ) : (
        <button className="login-button" onClick={signInWithGoogle}>
          Start by signing here!
        </button>
      )}
    </div>
  );
}

export default Login;
