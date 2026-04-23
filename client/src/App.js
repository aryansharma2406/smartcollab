import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";

function App() {
  const [user, setUser] = useState(localStorage.getItem("token"));

  return user ? <Dashboard /> : <Auth setUser={setUser} />;
}

export default App;