import React from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export function RegisterUser() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const { store, actions } = React.useContext(Context);

  return (
    <div className="container vh-100 charactersand">
      <h3>Register User</h3>
      {store.authError && (
        <div className="alert alert-danger">{store.authError}</div>
      )}

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          actions.registerUser(email, password, () => {
            navigate("/login");
          });
        }}
      >
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
        <button className="btn btn-primary mt-3" type="submit">
          Register
        </button>
      </form>
      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate("/login")}
      >
        Back to Login
      </button>
    </div>
  );
}
