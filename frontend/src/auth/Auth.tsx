import { useState } from "react";

type Props = {
  onAuthSuccess: () => void;
};

export default function Auth({ onAuthSuccess }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  /* 🔹 RESET PASSWORD STATES (ADDED ONLY) */
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  /* 🔹 RESET PASSWORD FUNCTION (ADDED ONLY) */
  const resetPassword = async () => {
    setError("");

    const res = await fetch("http://localhost:5000/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: resetEmail,
        newPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Reset failed");
      return;
    }

    alert("Password reset successful. Please login.");
    setShowReset(false);
    setIsLogin(true);
    setResetEmail("");
    setNewPassword("");
  };

  const submit = async () => {
    setError("");

    const url = isLogin
      ? "http://localhost:5000/auth/login"
      : "http://localhost:5000/auth/register";

    const body = isLogin
      ? { email, password }
      : { name, email, password };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Authentication failed");
      return;
    }

    if (isLogin) {
      localStorage.setItem("token", data.token);
      onAuthSuccess();
    } else {
      alert("Registered successfully. Please login.");
      setIsLogin(true);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        {/* HEADER */}
        <div style={header}>
          <h1 style={title}>Welcome 👋</h1>
          <p style={subtitle}>
            I’m your collaborative task assistant — let’s get you started
          </p>
        </div>

        <h2 style={formTitle}>
          {showReset ? "Reset Password" : isLogin ? "Login" : "Create Account"}
        </h2>

        {/* 🔹 RESET PASSWORD VIEW */}
        {showReset ? (
          <>
            <input
              style={input}
              placeholder="Registered Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />

            <input
              style={input}
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            {error && <p style={errorText}>{error}</p>}

            <button style={primaryBtn} onClick={resetPassword}>
              Reset Password
            </button>

            <p style={toggleText}>
              <span
                style={toggleLink}
                onClick={() => setShowReset(false)}
              >
                Back to Login
              </span>
            </p>
          </>
        ) : (
          <>
            {/* REGISTER NAME */}
            {!isLogin && (
              <input
                style={input}
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              style={input}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              style={input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p style={errorText}>{error}</p>}

            <button style={primaryBtn} onClick={submit}>
              {isLogin ? "Login" : "Register"}
            </button>

            {/* 🔹 FORGOT PASSWORD LINK (LOGIN ONLY) */}
            {isLogin && (
              <p style={{ textAlign: "center", fontSize: 13 }}>
                <span
                  style={toggleLink}
                  onClick={() => setShowReset(true)}
                >
                  Forgot password?
                </span>
              </p>
            )}

            <p style={toggleText}>
              {isLogin ? "New here?" : "Already have an account?"}{" "}
              <span
                style={toggleLink}
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Create account" : "Login"}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "clamp(16px, 4vw, 40px)",
  backgroundImage:
    "linear-gradient(rgba(244,246,248,0.75), rgba(244,246,248,0.75)), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  fontFamily: "Segoe UI, system-ui, -apple-system",
};

const card = {
  background: "#ffffff",
  padding: "clamp(22px, 4vw, 28px)",
  borderRadius: 16,
  width: "100%",
  maxWidth: 380,
  display: "flex",
  flexDirection: "column" as const,
  gap: 14,
  boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
};

const header = {
  textAlign: "center" as const,
  marginBottom: 6,
};

const title = {
  fontSize: 26,
  margin: 0,
  color: "#000",
};

const subtitle = {
  fontSize: 14,
  color: "#555",
  marginTop: 6,
};

const formTitle = {
  textAlign: "center" as const,
  marginBottom: 8,
  color: "#000",
};

const input = {
  padding: "11px 12px",
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 14,
  outline: "none",
};

const primaryBtn = {
  padding: "11px",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontSize: 15,
  cursor: "pointer",
  marginTop: 6,
};

const errorText = {
  color: "#b00020",
  fontSize: 13,
  textAlign: "center" as const,
};

const toggleText = {
  textAlign: "center" as const,
  fontSize: 14,
  color: "#444",
};

const toggleLink = {
  color: "#000",
  fontWeight: 600,
  cursor: "pointer",
};
