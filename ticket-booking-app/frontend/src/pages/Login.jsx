import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import Toast from "../components/Toast";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setToast({ message: "Please fill in all fields", type: "warning" });
      return;
    }

    setLoading(true);

    // Login via API for both users and admins.
    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);

      setToast({ message: "Login successful! Redirecting...", type: "success" });

      setTimeout(() => {
        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid email or password";
      setToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div style={styles.container}>
        {/* Left - Branding */}
        <div style={styles.leftPanel}>
          <div style={styles.brandContent}>
            <Link to="/" style={styles.backLink}>← Back to Home</Link>
            <div style={styles.brandIcon}>🎬</div>
            <h1 style={styles.brandTitle}>BookMyShow</h1>
            <p style={styles.brandSub}>
              Your one-stop destination for booking movies, events, and shows.
            </p>

            <div style={styles.features}>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>🎫</span>
                <span>Instant ticket booking</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>💺</span>
                <span>Choose your seats</span>
              </div>
              <div style={styles.feature}>
                <span style={styles.featureIcon}>🔒</span>
                <span>Secure payments</span>
              </div>
            </div>

            {/* Admin hint */}
            <div style={styles.adminHint}>
              <p style={styles.adminHintTitle}>Admin Access</p>
              <p style={styles.adminHintText}>Email: admin1@gmail.com</p>
              <p style={styles.adminHintText}>Password: admin1234</p>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div style={styles.rightPanel}>
          <form onSubmit={handleLogin} style={styles.form} id="login-form">
            <h2 style={styles.formTitle}>Welcome Back</h2>
            <p style={styles.formSub}>Sign in to continue booking</p>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                id="login-email"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                id="login-password"
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
              id="login-submit"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p style={styles.switchText}>
              Don't have an account?{" "}
              <Link to="/register" style={styles.switchLink}>
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0e17",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    display: "flex",
    width: "100%",
    maxWidth: "900px",
    minHeight: "560px",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.06)",
    margin: "20px",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #1a1040 0%, #2d1b4e 50%, #0a0e17 100%)",
    padding: "48px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  brandContent: {
    position: "relative",
    zIndex: 2,
  },
  backLink: {
    color: "#94a3b8",
    fontSize: "13px",
    textDecoration: "none",
    marginBottom: "28px",
    display: "inline-block",
    transition: "color 0.2s",
  },
  brandIcon: {
    fontSize: "48px",
    marginBottom: "12px",
    filter: "drop-shadow(0 0 12px rgba(230,57,70,0.4))",
  },
  brandTitle: {
    fontSize: "32px",
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    background: "linear-gradient(135deg, #e63946, #ff7eb3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "10px",
  },
  brandSub: {
    color: "#94a3b8",
    fontSize: "15px",
    lineHeight: 1.6,
    marginBottom: "32px",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginBottom: "28px",
  },
  feature: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#cbd5e1",
    fontSize: "14px",
  },
  featureIcon: {
    fontSize: "18px",
  },
  adminHint: {
    background: "rgba(251,191,36,0.08)",
    border: "1px solid rgba(251,191,36,0.2)",
    borderRadius: "10px",
    padding: "12px 16px",
  },
  adminHintTitle: {
    color: "#fbbf24",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "4px",
  },
  adminHintText: {
    color: "#94a3b8",
    fontSize: "12px",
    fontFamily: "monospace",
  },
  rightPanel: {
    flex: 1,
    background: "#111827",
    padding: "48px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: "100%",
    maxWidth: "340px",
  },
  formTitle: {
    fontSize: "26px",
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    color: "#f1f5f9",
    marginBottom: "6px",
  },
  formSub: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "32px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
    letterSpacing: "0.3px",
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#f1f5f9",
    fontSize: "14px",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #e63946, #ff4d5a)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(230,57,70,0.35)",
    transition: "all 0.2s ease",
    marginBottom: "20px",
    letterSpacing: "0.3px",
  },
  switchText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  },
  switchLink: {
    color: "#e63946",
    fontWeight: 600,
    textDecoration: "none",
  },
};
