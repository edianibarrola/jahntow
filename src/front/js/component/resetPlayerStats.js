import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";

const ResetPlayerStats = () => {
  const { actions } = useContext(Context);

  return (
    <div>
      <button onClick={actions.resetPlayer}>Reset Player Stats</button>
    </div>
  );
};

export default ResetPlayerStats;
