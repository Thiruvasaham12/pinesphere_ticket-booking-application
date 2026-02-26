import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { bookTicket } from "../services/api";

export default function Billing() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const eventId = Number(params.get("eventId"));
  const showId = Number(params.get("showId"));
  const seatsParam = params.get("seats") || "";
  const pricePerSeat = Number(params.get("price")) || 0;

  const selectedSeats = seatsParam ? seatsParam.split(",") : [];
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const baseTotal = selectedSeats.length * pricePerSeat;
  const convenienceFee = selectedSeats.length * 30;
  const gst = baseTotal * 0.18;
  const grandTotal = Math.floor(baseTotal + convenienceFee + gst);

  useEffect(() => {
    if (selectedSeats.length === 0) {
      navigate("/");
    }
  }, [selectedSeats, navigate]);

  const handleConfirmPayment = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await bookTicket({
        event_id: eventId,
        show_id: showId,
        seats: selectedSeats,
      });

      const bookingRef = res.data?.booking_reference || "";
      navigate(
        `/confirmation?seats=${selectedSeats.join(",")}&total=${grandTotal}&eventId=${eventId}&showId=${showId}&bookingRef=${bookingRef}`
      );
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
            ? detail.map((d) => d.msg || d).join(", ")
            : err.message || "Booking failed. Please retry.";
      setToast({ message: msg, type: "error" });
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Booking Summary</h1>
          <p style={styles.subtitle}>Review your ticket details and continue. No payment is required.</p>

          <div style={styles.splitLayout}>
            <div style={styles.leftCol}>
              <div style={styles.detailsBox}>
                <h3 style={styles.boxTitle}>Ticket Details</h3>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Seats Selected:</span>
                  <span style={styles.detailValue}>
                    {selectedSeats.join(", ")} ({selectedSeats.length} Tickets)
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Price per Seat:</span>
                  <span style={styles.detailValue}>Rs {pricePerSeat}</span>
                </div>
              </div>
            </div>

            <div style={styles.rightCol}>
              <div style={styles.billingBox}>
                <h3 style={styles.boxTitle}>Payment Breakdown</h3>

                <div style={styles.billRow}>
                  <span style={styles.billLineItem}>Base Ticket Price</span>
                  <span style={styles.billAmount}>Rs {baseTotal.toFixed(2)}</span>
                </div>

                <div style={styles.billRow}>
                  <span style={styles.billLineItem}>Convenience Fee</span>
                  <span style={styles.billAmount}>Rs {convenienceFee.toFixed(2)}</span>
                </div>

                <div style={styles.billRow}>
                  <span style={styles.billLineItem}>GST (18%)</span>
                  <span style={styles.billAmount}>Rs {gst.toFixed(2)}</span>
                </div>

                <div style={styles.divider}></div>

                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Grand Total</span>
                  <span style={styles.totalAmount}>Rs {grandTotal}</span>
                </div>

                <button
                  style={{ ...styles.payBtn, opacity: loading ? 0.7 : 1 }}
                  onClick={handleConfirmPayment}
                  id="confirm-payment-btn"
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Proceed to Pay - Rs ${grandTotal}`}
                </button>

                <div style={styles.secureBadge}>Booking will be confirmed instantly.</div>
              </div>
            </div>
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
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "60px 24px",
  },
  card: {
    background: "#1a2035",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },
  title: {
    fontSize: "32px",
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    color: "#f1f5f9",
    marginBottom: "8px",
    textAlign: "center",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "15px",
    textAlign: "center",
    marginBottom: "40px",
  },
  splitLayout: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
  },
  leftCol: {
    flex: "1",
    minWidth: "300px",
  },
  rightCol: {
    flex: "1",
    minWidth: "300px",
  },
  detailsBox: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "16px",
    padding: "24px",
    height: "100%",
  },
  billingBox: {
    background: "linear-gradient(180deg, rgba(230,57,70,0.05) 0%, rgba(230,57,70,0.01) 100%)",
    border: "1px solid rgba(230,57,70,0.15)",
    borderRadius: "16px",
    padding: "24px",
    height: "100%",
  },
  boxTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: "20px",
    fontFamily: "'Outfit', sans-serif",
  },
  detailRow: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "16px",
  },
  detailLabel: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "4px",
  },
  detailValue: {
    color: "#f1f5f9",
    fontSize: "16px",
    fontWeight: 600,
  },
  billRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "14px",
  },
  billLineItem: {
    color: "#94a3b8",
    fontSize: "15px",
  },
  billAmount: {
    color: "#f1f5f9",
    fontSize: "15px",
    fontWeight: 500,
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.08)",
    margin: "20px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  totalLabel: {
    color: "#f1f5f9",
    fontSize: "18px",
    fontWeight: 700,
  },
  totalAmount: {
    color: "#10b981",
    fontSize: "24px",
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
  },
  payBtn: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #e63946, #ff4d5a)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 700,
    boxShadow: "0 4px 20px rgba(230,57,70,0.35)",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },
  secureBadge: {
    textAlign: "center",
    marginTop: "16px",
    color: "#10b981",
    fontSize: "13px",
    fontWeight: 600,
  },
};
