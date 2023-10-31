import React from "react";
import "../styles/pages/Landing.scss";
function Landing(props) {
  const { user, signInWithGoogle } = props;
  return (
    <div>
      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="logo">
              <img src={require("../assets/img/logo-cut.png")} alt="logo" />
              <h2>Language Master</h2>
            </div>
            <h3>Learn a New Language Today!</h3>
            <p>
              Start your language journey with us. Interactive lessons, expert
              tutors, and more.
            </p>
            <a href="#">
              <div className="languages-row">
                <div className="language-box">
                  <img src={require("../assets/img/en_us.png")} alt="English" />
                  <p>English</p>
                </div>
                <div className="language-box">
                  <img src={require("../assets/img/es.png")} alt="Spanish" />
                  <p>Spanish</p>
                </div>
                <div className="language-box">
                  <img src={require("../assets/img/de.png")} alt="German" />
                  <p>German</p>
                </div>
                <div className="language-box">
                  <img src={require("../assets/img/it.png")} alt="Italian" />
                  <p>Italian</p>
                </div>
                <div className="language-box">
                  <img src={require("../assets/img/ru.png")} alt="Russian" />
                  <p>Russian</p>
                </div>
                <div className="language-box">
                  <img
                    src={require("../assets/img/unknown.png")}
                    alt="Others"
                  />
                  <p>Others</p>
                </div>
              </div>
            </a>
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
        </section>
      </main>
    </div>
  );
}

export default Landing;
