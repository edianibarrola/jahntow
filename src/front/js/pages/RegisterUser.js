import React from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export function RegisterUser() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const { store, actions } = React.useContext(Context);

  return (
    <div className="container">
      <h3>Register User</h3>
      {store.authError && (
        <div className="alert alert-danger">Authentication Error</div>
      )}

      <div className=" mb-3">
        <input
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          type="email"
          className="form-control"
          placeholder="name@example.com"
        />
      </div>
      <div className="mb-3">
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          type="password"
          className="form-control"
          placeholder="Enter your password here"
        />
      </div>
      <button
        className="btn btn-primary mt-3"
        onClick={() =>
          actions.registerUser(email, password, () => {
            navigate("/login");
          })
        }
      >
        Register
      </button>
    </div>
  );
}
