import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Toast from "./Toast";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(userRole);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const source = new EventSource(
      `${API_BASE_URL}/notifications/stream?token=${encodeURIComponent(token)}`
    );

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.message) {
          setToast({ message: data.message, type: "success" });
        }
      } catch {
        // Ignore invalid payload
      }
    };

    source.onerror = () => {
      source.close();
    };

    return () => source.close();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/");
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <nav
        style={{
          ...styles.navbar,
          ...(scrolled ? styles.navbarScrolled : {}),
        }}
      >
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>BMS</span>
          <span style={styles.logoText}>BookMyShow</span>
        </Link>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>Home</Link>

          {isLoggedIn && role === "admin" && (
            <Link to="/admin" style={styles.navLink}>
              <span style={styles.adminBadge}>Admin</span>
            </Link>
          )}

          {isLoggedIn ? (
            <div style={styles.userSection}>
              <div style={styles.avatar} onClick={() => setMenuOpen(!menuOpen)} id="user-avatar">
                U
              </div>
              {menuOpen && (
                <div style={styles.dropdown}>
                  <Link to="/my-bookings" style={styles.dropdownLink} onClick={() => setMenuOpen(false)}>
                    My Bookings
                  </Link>
                  <button onClick={handleLogout} style={styles.logoutBtn}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.authBtns}>
              <Link to="/login" style={styles.loginBtn}>Sign In</Link>
              <Link to="/register" style={styles.registerBtn}>Sign Up</Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 32px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(10, 14, 23, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    transition: "all 0.3s ease",
  },
  navbarScrolled: {
    background: "rgba(10, 14, 23, 0.97)",
    boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
  },
  logoIcon: {
    fontSize: "18px",
    fontWeight: 800,
    color: "#fbbf24",
  },
  logoText: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "22px",
    fontWeight: 700,
    background: "linear-gradient(135deg, #e63946, #ff7eb3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  navLink: {
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
    transition: "color 0.2s",
    padding: "6px 12px",
    borderRadius: "8px",
  },
  adminBadge: {
    background: "linear-gradient(135deg, #fbbf24, #d97706)",
    color: "#000",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.5px",
  },
  userSection: {
    position: "relative",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1a2035, #2a3555)",
    border: "2px solid rgba(230,57,70,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
    color: "#f1f5f9",
    transition: "all 0.2s",
  },
  dropdown: {
    position: "absolute",
    top: "50px",
    right: 0,
    background: "#1a2035",
    borderRadius: "10px",
    padding: "8px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.08)",
    animation: "fadeIn 0.2s ease",
    minWidth: "140px",
  },
  dropdownLink: {
    display: "block",
    padding: "10px 16px",
    color: "#f1f5f9",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "6px",
    marginBottom: "4px",
    transition: "background 0.2s",
  },
  logoutBtn: {
    width: "100%",
    padding: "10px 16px",
    background: "transparent",
    color: "#ef4444",
    border: "none",
    borderRadius: "6px",
    fontWeight: 500,
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.2s",
  },
  authBtns: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  loginBtn: {
    color: "#f1f5f9",
    fontSize: "14px",
    fontWeight: 500,
    padding: "8px 18px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.1)",
    textDecoration: "none",
    transition: "all 0.2s",
  },
  registerBtn: {
    background: "linear-gradient(135deg, #e63946, #ff4d5a)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    padding: "8px 18px",
    borderRadius: "8px",
    textDecoration: "none",
    boxShadow: "0 0 15px rgba(230,57,70,0.3)",
    transition: "all 0.2s",
  },
};
