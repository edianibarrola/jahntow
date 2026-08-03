//import react into the bundle
import React from "react";
import { createRoot } from "react-dom/client";

// Bundled via npm instead of an external CDN link, so styling (including
// the CSS that react-bootstrap's Tabs/Accordion rely on to show/hide
// content) doesn't depend on a third-party CDN being reachable.
import "bootstrap/dist/css/bootstrap.min.css";

//include your index.scss file into the bundle
import "../styles/index.css";

//import your own components
import Layout from "./layout";

//render your react application
const root = createRoot(document.querySelector("#app"));
root.render(<Layout />);
