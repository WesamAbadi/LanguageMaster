import React from "react";
import "../styles/components/LanguageCard.scss";

function LanguageCard({ language, style }) {
  return (
    <div className="card-div" style={style}>
      <div className="gow-img-div img-div">
        <img src={language.data.image} />
      </div>
      <div className="text-container">
        <h2 className="language-name">{language.data.title}</h2>
        <p className="description">{language.data.description}</p>
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
