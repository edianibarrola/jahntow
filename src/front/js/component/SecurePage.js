import React from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export function SecurePage(props) {
  const { store, actions } = React.useContext(Context);

  if (!store.authToken) {
    return null;
  }

  return <>{props.children}</>;
}
