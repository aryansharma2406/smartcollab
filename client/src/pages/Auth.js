import React, { useState } from "react";
import API from "../api";

const Auth = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async () => {
    try {
      const url = isSignup ? "/auth/signup" : "/auth/login";

      const res = await API.post(url, {
        email,
        password,
        name: email.split("@")[0],
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", email);
      const payload = JSON.parse(atob(res.data.token.split(".")[1]));
localStorage.setItem("userId", payload.id);

setUser(true);

      setUser(true);
    } catch (err) {
      alert(err.response?.data?.msg || "Auth error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 SmartCollab</h1>
        <h3 style={styles.subtitle}>
          {isSignup ? "Create Account" : "Welcome Back"}
        </h3>

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
  style={styles.button}
  onClick={handleSubmit}
  onMouseOver={(e) => (e.target.style.background = "#2563eb")}
  onMouseOut={(e) => (e.target.style.background = "#3b82f6")}
>
          {isSignup ? "Signup" : "Login"}
        </button>

        <p style={styles.toggle} onClick={() => setIsSignup(!isSignup)}>
          {isSignup
            ? "Already have an account? Login"
            : "Create a new account"}
        </p>
      </div>
    </div>
  );
};

export default Auth;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(15px)",
    padding: "40px",
    borderRadius: "15px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },

  title: {
    marginBottom: "5px",
  },

  subtitle: {
    marginBottom: "20px",
    color: "#aaa",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },

  toggle: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#aaa",
    cursor: "pointer",
  },
};