export default function SeatCountModal({ onClose, onSelect, maxSeats = 10 }) {
  const numbers = Array.from({ length: Math.min(maxSeats, 10) }, (_, i) => i + 1);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>How many seats?</h2>
          <p style={styles.subtitle}>Select the number of tickets</p>
        </div>

        <div style={styles.numbers}>
          {numbers.map((num) => (
            <button
              key={num}
              style={styles.numberBtn}
              onClick={() => onSelect(num)}
              id={`seat-count-${num}`}
              onMouseEnter={(e) => {
                e.target.style.background = "linear-gradient(135deg, #e63946, #ff4d5a)";
                e.target.style.color = "#fff";
                e.target.style.border = "1px solid transparent";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.04)";
                e.target.style.color = "#f1f5f9";
                e.target.style.border = "1px solid rgba(255,255,255,0.1)";
                e.target.style.transform = "scale(1)";
              }}
            >
              {num}
            </button>
          ))}
        </div>

        <button style={styles.closeBtn} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    animation: "fadeIn 0.2s ease",
  },
  modal: {
    background: "#1a2035",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "32px",
    borderRadius: "20px",
    width: "360px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    animation: "fadeInScale 0.3s ease",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#f1f5f9",
    fontFamily: "'Outfit', sans-serif",
    marginBottom: "6px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "14px",
  },
  numbers: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "10px",
    marginBottom: "24px",
  },
  numberBtn: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "16px",
    background: "rgba(255,255,255,0.04)",
    color: "#f1f5f9",
    transition: "all 0.2s ease",
  },
  closeBtn: {
    padding: "12px 28px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    background: "transparent",
    cursor: "pointer",
    color: "#94a3b8",
    fontWeight: 500,
    fontSize: "14px",
    transition: "all 0.2s",
  },
};