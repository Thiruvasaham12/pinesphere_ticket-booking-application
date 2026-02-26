import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { getBookedSeats } from "../services/api";

export default function SeatLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const eventId = Number(params.get("eventId")) || 1;
  const showId = Number(params.get("showId")) || 1;
  const maxSeatsAllowed = Number(params.get("count")) || 1;
  const pricePerSeat = Number(params.get("price")) || 100;

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 10;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const res = await getBookedSeats(showId);
        setBookedSeats(res.data.booked_seats || []);
      } catch (err) {
        console.error("Failed to fetch booked seats", err);
      }
    };

    fetchBookedSeats();
  }, [showId]);

  const getSeatCategory = (row) => {
    if (row === "A" || row === "B") return { label: "Premium", color: "#fbbf24" };
    if (row === "C" || row === "D" || row === "E") return { label: "Gold", color: "#10b981" };
    return { label: "Silver", color: "#3b82f6" };
  };

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      if (selectedSeats.length >= maxSeatsAllowed) {
        setToast({ message: `You can select only ${maxSeatsAllowed} seat(s)`, type: "warning" });
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalAmount = selectedSeats.length * pricePerSeat;

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setToast({ message: "Please select at least one seat", type: "warning" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setToast({ message: "You are not authenticated! Redirecting to login...", type: "error" });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    // Navigate to billing page
    navigate(`/billing?eventId=${eventId}&showId=${showId}&seats=${selectedSeats.join(",")}&price=${pricePerSeat}`);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Select Your Seats</h1>
        <p style={styles.pageSub}>Choose up to {maxSeatsAllowed} seat(s) • ₹{pricePerSeat}/seat</p>

        {/* Screen */}
        <div style={styles.screenWrapper}>
          <div style={styles.screen}>
            <span style={styles.screenText}>SCREEN</span>
          </div>
          <div style={styles.screenGlow}></div>
        </div>

        {/* Seat Grid */}
        <div style={styles.seatGrid}>
          {rows.map((row) => {
            const category = getSeatCategory(row);
            return (
              <div key={row} style={styles.seatRow}>
                <span style={styles.rowLabel}>{row}</span>
                <div style={styles.seatsInRow}>
                  {Array.from({ length: seatsPerRow }, (_, i) => {
                    const seat = `${row}${i + 1}`;
                    const isBooked = bookedSeats.includes(seat);
                    const isSelected = selectedSeats.includes(seat);

                    return (
                      <div
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        style={{
                          ...styles.seat,
                          background: isBooked
                            ? "rgba(255,255,255,0.05)"
                            : isSelected
                              ? category.color
                              : "rgba(255,255,255,0.08)",
                          border: isBooked
                            ? "1px solid rgba(255,255,255,0.05)"
                            : isSelected
                              ? `1px solid ${category.color}`
                              : "1px solid rgba(255,255,255,0.12)",
                          color: isBooked
                            ? "#333"
                            : isSelected
                              ? "#000"
                              : "#94a3b8",
                          cursor: isBooked ? "not-allowed" : "pointer",
                          transform: isSelected ? "scale(1.08)" : "scale(1)",
                          boxShadow: isSelected
                            ? `0 0 12px ${category.color}40`
                            : "none",
                        }}
                        id={`seat-${seat}`}
                        title={isBooked ? "Already booked" : seat}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
                <span style={styles.rowLabel}>{row}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendBox, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}></div>
            <span>Available</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendBox, background: "#10b981" }}></div>
            <span>Selected</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendBox, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)" }}></div>
            <span>Booked</span>
          </div>
        </div>

        {/* Category Legend */}
        <div style={styles.categories}>
          <span style={{ ...styles.catBadge, color: "#fbbf24", borderColor: "rgba(251,191,36,0.3)" }}>⭐ Premium</span>
          <span style={{ ...styles.catBadge, color: "#10b981", borderColor: "rgba(16,185,129,0.3)" }}>🟢 Gold</span>
          <span style={{ ...styles.catBadge, color: "#3b82f6", borderColor: "rgba(59,130,246,0.3)" }}>🔵 Silver</span>
        </div>

        {/* Footer */}
        {selectedSeats.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.footerInfo}>
              <div style={styles.footerSeats}>
                <span style={styles.footerLabel}>Selected Seats</span>
                <span style={styles.footerValue}>{selectedSeats.join(", ")}</span>
              </div>
              <div style={styles.footerTotal}>
                <span style={styles.footerLabel}>Total</span>
                <span style={styles.totalAmount}>₹{totalAmount}</span>
              </div>
            </div>
            <button
              style={{
                ...styles.payBtn,
                opacity: loading ? 0.7 : 1,
              }}
              onClick={handleBooking}
              disabled={loading}
              id="proceed-to-pay"
            >
              {loading ? "Booking..." : `Proceed to Pay - Rs ${totalAmount}`}
            </button>
          </div>
        )}
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
    maxWidth: "700px",
    margin: "0 auto",
    padding: "32px 24px 120px",
    textAlign: "center",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    color: "#f1f5f9",
    marginBottom: "6px",
  },
  pageSub: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "36px",
  },
  screenWrapper: {
    position: "relative",
    marginBottom: "40px",
  },
  screen: {
    width: "70%",
    margin: "0 auto",
    padding: "10px",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
    borderRadius: "4px 4px 50% 50%",
    textAlign: "center",
  },
  screenText: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "3px",
    textTransform: "uppercase",
  },
  screenGlow: {
    width: "60%",
    height: "30px",
    margin: "0 auto",
    background: "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)",
  },
  seatGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "32px",
  },
  seatRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "6px",
  },
  rowLabel: {
    width: "20px",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 700,
  },
  seatsInRow: {
    display: "flex",
    gap: "5px",
  },
  seat: {
    width: "34px",
    height: "34px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 600,
    transition: "all 0.2s ease",
  },
  legend: {
    display: "flex",
    justifyContent: "center",
    gap: "28px",
    marginBottom: "20px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#94a3b8",
    fontSize: "13px",
  },
  legendBox: {
    width: "16px",
    height: "16px",
    borderRadius: "4px",
  },
  categories: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "32px",
  },
  catBadge: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid",
    fontSize: "12px",
    fontWeight: 600,
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(17, 24, 39, 0.97)",
    backdropFilter: "blur(16px)",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100,
    animation: "slideUp 0.3s ease",
  },
  footerInfo: {
    display: "flex",
    gap: "40px",
  },
  footerSeats: {
    display: "flex",
    flexDirection: "column",
  },
  footerTotal: {
    display: "flex",
    flexDirection: "column",
  },
  footerLabel: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 500,
    marginBottom: "2px",
  },
  footerValue: {
    color: "#f1f5f9",
    fontSize: "14px",
    fontWeight: 600,
  },
  totalAmount: {
    color: "#10b981",
    fontSize: "22px",
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
  },
  payBtn: {
    padding: "14px 40px",
    background: "linear-gradient(135deg, #e63946, #ff4d5a)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(230,57,70,0.4)",
    transition: "all 0.2s ease",
    letterSpacing: "0.3px",
  },
};
