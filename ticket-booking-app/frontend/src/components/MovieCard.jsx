import { useNavigate } from "react-router-dom";

export default function MovieCard({ title, banner_url, event_type, location, total_seats, id, date_time }) {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/movie/${id}`)}
      id={`event-card-${id}`}
    >
      <div style={styles.imageWrapper}>
        <img
          src={banner_url || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop"}
          alt={title}
          style={styles.image}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop";
          }}
        />
        <div style={styles.overlay}>
          <div style={styles.badge}>{event_type || "Movie"}</div>
        </div>
        <div style={styles.bottomGradient}>
          <span style={styles.seats}>🎫 {total_seats} seats</span>
        </div>
      </div>

      <div style={styles.info}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.meta}>
          📍 {location}
        </p>
        <p style={styles.date}>
          📅 {formatDate(date_time)}
        </p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: "220px",
    minWidth: "220px",
    cursor: "pointer",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#1a2035",
    border: "1px solid rgba(255,255,255,0.06)",
    transition: "all 0.35s ease",
    animation: "fadeIn 0.5s ease forwards",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: "300px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  overlay: {
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: 2,
  },
  badge: {
    background: "linear-gradient(135deg, #e63946, #ff4d5a)",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    boxShadow: "0 2px 8px rgba(230,57,70,0.4)",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
    padding: "20px 12px 10px",
    display: "flex",
    justifyContent: "flex-end",
  },
  seats: {
    color: "#fbbf24",
    fontSize: "12px",
    fontWeight: 600,
  },
  info: {
    padding: "14px 14px 16px",
  },
  title: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: "6px",
    fontFamily: "'Outfit', sans-serif",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  meta: {
    color: "#94a3b8",
    fontSize: "13px",
    marginBottom: "3px",
  },
  date: {
    color: "#64748b",
    fontSize: "12px",
  },
};