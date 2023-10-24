import React, { useState, useEffect, useRef } from "react";
import "../../styles/components/OverlayBox.scss"
const OverlayBox = ({ icon, content }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef(null);

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  const handleClickOutside = (event) => {
    if (overlayRef.current && !overlayRef.current.contains(event.target)) {
      setShowOverlay(false);
    }
  };

  useEffect(() => {
    if (showOverlay) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [showOverlay]);

  return (
    <div className="overlay-container" ref={overlayRef}>
      <button className="icons" onClick={toggleOverlay}>
        {icon}
      </button>
      {showOverlay && <div className="overlay-content">{content}</div>}
    </div>
  );
};

export default OverlayBox;
