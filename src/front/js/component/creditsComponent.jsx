import React from "react";

const CreditsComponent = ({ credits }) => {
  return (
    <span className="stat-chip">
      Credits: {Math.floor(credits).toLocaleString()}
    </span>
  );
};

export default CreditsComponent;
