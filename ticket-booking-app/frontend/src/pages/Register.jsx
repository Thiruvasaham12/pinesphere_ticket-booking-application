import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import Toast from "../components/Toast";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            setToast({ message: "Please fill in all fields", type: "warning" });
            return;
        }

        if (formData.password.length < 4) {
            setToast({ message: "Password must be at least 4 characters", type: "warning" });
            return;
        }

        if (formData.password !== confirmPassword) {
            setToast({ message: "Passwords do not match", type: "error" });
            return;
        }

        setLoading(true);
        try {
            await registerUser(formData);
            setToast({ message: "Registration successful! Redirecting to login...", type: "success" });
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            const msg = err.response?.data?.detail || "Registration failed. Try again.";
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
                        <div style={styles.brandIcon}>🎟️</div>
                        <h1 style={styles.brandTitle}>Join BookMyShow</h1>
                        <p style={styles.brandSub}>
                            Create your free account and start booking the best events around you.
                        </p>

                        <div style={styles.features}>
                            <div style={styles.feature}>
                                <span style={styles.featureIcon}>✨</span>
                                <span>Personalized recommendations</span>
                            </div>
                            <div style={styles.feature}>
                                <span style={styles.featureIcon}>📱</span>
                                <span>Book from anywhere</span>
                            </div>
                            <div style={styles.feature}>
                                <span style={styles.featureIcon}>🏷️</span>
                                <span>Exclusive deals & offers</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Form */}
                <div style={styles.rightPanel}>
                    <form onSubmit={handleRegister} style={styles.form} id="register-form">
                        <h2 style={styles.formTitle}>Create Account</h2>
                        <p style={styles.formSub}>Fill in your details to get started</p>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                                id="register-name"
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                style={styles.input}
                                id="register-email"
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
                                id="register-password"
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={styles.input}
                                id="register-confirm-password"
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                ...styles.submitBtn,
                                opacity: loading ? 0.7 : 1,
                            }}
                            disabled={loading}
                            id="register-submit"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>

                        <p style={styles.switchText}>
                            Already have an account?{" "}
                            <Link to="/login" style={styles.switchLink}>
                                Sign In
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
        minHeight: "620px",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.06)",
        margin: "20px",
    },
    leftPanel: {
        flex: 1,
        background: "linear-gradient(135deg, #0a1628 0%, #1b2a4a 50%, #0a0e17 100%)",
        padding: "48px 40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    brandContent: {},
    backLink: {
        color: "#94a3b8",
        fontSize: "13px",
        textDecoration: "none",
        marginBottom: "28px",
        display: "inline-block",
    },
    brandIcon: {
        fontSize: "48px",
        marginBottom: "12px",
    },
    brandTitle: {
        fontSize: "28px",
        fontWeight: 800,
        fontFamily: "'Outfit', sans-serif",
        background: "linear-gradient(135deg, #3b82f6, #a78bfa)",
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
    rightPanel: {
        flex: 1,
        background: "#111827",
        padding: "40px 40px",
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
        marginBottom: "28px",
    },
    inputGroup: {
        marginBottom: "18px",
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
        background: "linear-gradient(135deg, #3b82f6, #6366f1)",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
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
        color: "#3b82f6",
        fontWeight: 600,
        textDecoration: "none",
    },
};
