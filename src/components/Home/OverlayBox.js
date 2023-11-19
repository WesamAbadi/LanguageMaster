import React, { useState, useEffect, useRef } from "react";
import "../../styles/components/OverlayBox.scss";
const OverlayBox = ({ icon, content, setShowOverlay2 }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef(null);

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
    setShowOverlay2(!showOverlay);
  };

  const handleClickOutside = (event) => {
    if (overlayRef.current && !overlayRef.current.contains(event.target)) {
      setShowOverlay(false);
    }

    if (
      overlayRef.current &&
      !overlayRef.current.contains(event.target) &&
      !event.target.closest(".icons")
    ) {
      setShowOverlay2(false);
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
    // eslint-disable-next-line
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
