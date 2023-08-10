import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Context } from "./store/appContext";

import { Home } from "./pages/home";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { LoginUser } from "./pages/LoginUser";
import { RegisterUser } from "./pages/RegisterUser";
import { SecurePage } from "./component/SecurePage";
import { Dashboard } from "./pages/Dashboard";

const RouteManager = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // Clear authToken from localStorage on page reload
  window.addEventListener("beforeunload", () => {
    localStorage.removeItem("authToken");
  });

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (!token) {
      if (currentPath !== "/login" && currentPath !== "/register") {
        navigate("/login");
      }
    } else {
      if (currentPath === "/login" || currentPath === "/register") {
        navigate("/dashboard"); // Redirect authenticated users to dashboard
      }
    }
  }, [token, navigate]);

  return (
    <>
      <Routes>
        <Route
          element={
            <SecurePage>
              <Home />
            </SecurePage>
          }
          path="/"
        />
        <Route element={<LoginUser />} path="/login" />
        <Route element={<RegisterUser />} path="/register" />
        <Route
          element={
            <SecurePage>
              <Dashboard />
            </SecurePage>
          }
          path="/dashboard"
        />
        <Route element={<Single />} path="/single/:theid" />
        <Route element={<h1>Not found!</h1>} />
      </Routes>
    </>
  );
};

const Layout = () => {
  const basename = process.env.BASENAME || "";

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "")
    return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <RouteManager />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
