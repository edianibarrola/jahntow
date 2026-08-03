import React from "react";

const CreditsComponent = ({ credits }) => {
  return <div className="col-4">Credits: {credits.toFixed(2)}</div>;
};

export default CreditsComponent;
