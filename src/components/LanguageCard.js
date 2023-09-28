import React from "react";
import "../styles/components/LanguageCard.scss";

function LanguageCard({ language }) {
  return (
    <div className="card-div">
      <div className="gow-img-div img-div">
        <img
          src="https://c8.alamy.com/zooms/9/7dc164d7ae494b308363a758306993ea/twjdyd.jpg"
          alt="god-of-war-figurine"
        />
      </div>
      <div className="text-container">
        <h2 className="item-name">{language.data.title}</h2>
        <p className="date">
          English is the most spoken language in the world!
          <br />
          Learning it is a must!
        </p>
        <div className="pricing-and-cart">
          <div className="pricing">
            <p className="current-price">4 levels</p>
          </div>
          <i className="fas fa-shopping-cart"></i>
        </div>
      </div>
    </div>
  );
}

export default LanguageCard;
