import React from "react";

const Dark = ({ children }) => <span className="bg-dark text-white px-1 rounded">{children}</span>;

export const BackendURL = () => (
  <div className="mt-5 pt-5 w-50 mx-auto">
    <h2>Missing BACKEND_URL env variable</h2>
    <p>
      Set <Dark>BACKEND_URL</Dark> in your <Dark>.env</Dark> file to the address the
      Flask backend is running on (e.g. <Dark>http://localhost:3001</Dark> for local
      development), then restart the frontend. See the README for the full list of
      environment variables.
    </p>
  </div>
);
