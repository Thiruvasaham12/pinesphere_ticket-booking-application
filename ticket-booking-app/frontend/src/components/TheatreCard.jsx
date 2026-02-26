import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SeatCountModal from "./SeatCountModal";

export default function TheatreCard({ theaterName, shows, eventId }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const navigate = useNavigate();

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSeatSelect = (count) => {
    navigate(`/seats?showId=${selectedShow.id}&eventId=${eventId}&count=${count}&price=${selectedShow.price}`);
    setShowModal(false);
  };

  const handleTimeClick = (show) => {
    setSelectedShow(show);
    setShowModal(true);
  };

  return (
    <>
      <div style={styles.card}>
        <div style={styles.cardTop}>
          <div style={styles.theaterInfo}>
            <div style={styles.theaterTitleRow}>
              <span style={styles.heartIcon}>🤍</span>
              <h3 style={styles.theaterName}>{theaterName}</h3>
              <span style={styles.infoIcon}>ⓘ</span>
            </div>
            <div style={styles.facilities}>
              <span title="M-Ticket" style={styles.facilityIcon}>📱 M-Ticket</span>
              <span title="Food & Beverage" style={styles.facilityIcon}>🍔 F&B</span>
            </div>
          </div>
        </div>

        <div style={styles.timesSection}>
          {shows.map((show) => (
            <div key={show.id} style={styles.timeWrapper}>
              <button
                style={styles.timeBtn}
                onClick={() => handleTimeClick(show)}
              >
                {formatTime(show.show_time)}
              </button>
              <div style={styles.timeSubtext}>
                {show.price ? `₹${show.price}` : "Cancellation Available"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedShow && (
        <SeatCountModal
          onClose={() => setShowModal(false)}
          onSelect={handleSeatSelect}
          maxSeats={selectedShow.total_seats}
        />
      )}
    </>
  );
}

const styles = {
  card: {
    background: "#1a2035",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    animation: "fadeIn 0.4s ease forwards",
  },
  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
  },
  theaterInfo: {
    flex: "1",
  },
  theaterTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },
  theaterName: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#f1f5f9",
    fontFamily: "'Outfit', sans-serif",
    margin: 0,
  },
  heartIcon: {
    color: "#64748b",
    cursor: "pointer",
    fontSize: "16px",
  },
  infoIcon: {
    color: "#64748b",
    fontSize: "14px",
    cursor: "pointer",
  },
  facilities: {
    display: "flex",
    gap: "12px",
    color: "#10b981",
  },
  facilityIcon: {
    fontSize: "12px",
    opacity: 0.8,
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "rgba(16,185,129,0.1)",
    padding: "4px 8px",
    borderRadius: "12px",
  },
  timesSection: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    paddingTop: "16px",
    borderTop: "1px dashed rgba(255,255,255,0.06)",
  },
  timeWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },
  timeBtn: {
    background: "transparent",
    border: "1px solid #10b981",
    color: "#10b981",
    padding: "8px 24px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  timeSubtext: {
    fontSize: "11px",
    color: "#64748b",
  }
};