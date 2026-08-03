import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";

const ResetPlayerStats = () => {
  const { actions } = useContext(Context);

  const handleReset = () => {
    if (
      window.confirm(
        "This will permanently reset your level, credits, inventory, equipment, and story progress. Are you sure?"
      )
    ) {
      actions.resetPlayer();
    }
  };

  return (
    <div>
      <button onClick={handleReset}>Reset Player Stats</button>
    </div>
  );
};

export default ResetPlayerStats;
