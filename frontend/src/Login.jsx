import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid username or password");
        return;
      }

      localStorage.setItem("crmToken", data.token);
      onLogin();
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          C
        </div>

        <h1>ClientFlow</h1>

        <p className="login-subtitle">
          Admin Login
        </p>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;