import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const seats = params.get("seats") || "N/A";
  const total = params.get("total") || "0";
  const eventId = params.get("eventId") || "";
  const showId = params.get("showId") || "";
  const bookingRef = params.get("bookingRef") || `BMS-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>
            <span style={styles.checkmark}>OK</span>
          </div>

          <h1 style={styles.title}>Booking Confirmed!</h1>
          <p style={styles.subtitle}>Your tickets have been booked successfully</p>

          <div style={styles.divider}></div>

          <div style={styles.details}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Seats</span>
              <span style={styles.detailValue}>{seats}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Total Paid</span>
              <span style={styles.detailValueGreen}>Rs {total}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Event ID</span>
              <span style={styles.detailValue}>#{eventId}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Show ID</span>
              <span style={styles.detailValue}>#{showId}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Booked On</span>
              <span style={styles.detailValue}>
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.ticketId}>
            <span style={styles.ticketLabel}>Booking Reference</span>
            <span style={styles.ticketCode}>{bookingRef}</span>
          </div>

          <div style={styles.actions}>
            <button style={styles.homeBtn} onClick={() => navigate("/")} id="back-to-home">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0e17",
  },
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "60px 24px",
  },
  card: {
    background: "#1a2035",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "24px",
    padding: "48px 36px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },
  successIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981, #059669)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    boxShadow: "0 0 30px rgba(16,185,129,0.3)",
  },
  checkmark: {
    color: "#fff",
    fontSize: "26px",
    fontWeight: 900,
  },
  title: {
    fontSize: "28px",
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    color: "#f1f5f9",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "15px",
    marginBottom: "24px",
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.06)",
    margin: "24px 0",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: 500,
  },
  detailValue: {
    color: "#f1f5f9",
    fontSize: "14px",
    fontWeight: 600,
  },
  detailValueGreen: {
    color: "#10b981",
    fontSize: "18px",
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
  },
  ticketId: {
    background: "rgba(255,255,255,0.04)",
    border: "1px dashed rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  ticketLabel: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  ticketCode: {
    color: "#fbbf24",
    fontSize: "20px",
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: "2px",
  },
  actions: {
    marginTop: "28px",
  },
  homeBtn: {
    padding: "14px 36px",
    background: "linear-gradient(135deg, #e63946, #ff4d5a)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(230,57,70,0.35)",
    transition: "all 0.2s ease",
  },
};
