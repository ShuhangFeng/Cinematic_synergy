// TopBar.js

import React from "react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();

  const handleTopBarClick = () => {
    navigate("/"); // Change '/' to '/home' if you want to navigate to '/home'
  };

  return (
    <div
      style={{
        backgroundColor: "navy",
        color: "white",
        padding: "10px",
        textAlign: "center",
      }}
      onClick={handleTopBarClick}
    >
      <h1>Cinematic Synergy</h1>
    </div>
  );
};

export default TopBar;
