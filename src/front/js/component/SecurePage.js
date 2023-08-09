import React from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export function SecurePage(props) {
  const { store, actions } = React.useContext(Context);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!store.authToken) {
      navigate("/login");
    }
  }, [store.authToken]);

  return <>{props.children}</>;
}
