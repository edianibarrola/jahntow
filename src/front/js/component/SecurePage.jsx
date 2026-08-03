import React from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export function SecurePage(props) {
  const { store, actions } = React.useContext(Context);
  const token = localStorage.getItem("authToken");
  if (!token) {
    return null;
  }

  return <>{props.children}</>;
}
