import React from "react";
import "../styles/pages/Landing.scss";
function Landing() {
  return (
    <div>
      <main>
        <section class="hero">
          <div class="hero-content">
            <h1>Learn a New Language Today</h1>
            <p>
              Start your language journey with us. Interactive lessons, expert
              tutors, and more.
            </p>
            <a href="/home" class="cta-button">
              Get Started
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Landing;
