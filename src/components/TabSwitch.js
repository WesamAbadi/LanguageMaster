import React from "react";
import "../styles/components/TabSwithch.scss";

function TabSwitch({ activeTab, onTabChange, tabs }) {
  document.documentElement.style.setProperty("--num-tabs", tabs.length);
  const handleTabClick = (tabIndex) => {
    onTabChange(tabIndex);
  };

  return (
    <div className="tabs-container">
      <div className={`tab-switch ${activeTab}`}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab ${activeTab === index ? "active" : ""}`}
            onClick={() => handleTabClick(index)}
            tab-direction={index}
          >
            {tab}
          </div>
        ))}
        <div
          className={`tab-indicator`}
          style={{
            transform: `translateX(calc(${activeTab} * 100%))`,
          }}
        />
      </div>
    </div>
  );
}

export default TabSwitch;
