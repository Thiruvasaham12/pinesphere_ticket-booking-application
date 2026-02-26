import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getEvents, getShowsForEvent } from "../services/api";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await getEvents();
      const found = res.data.find((e) => e.id === parseInt(id));
      setEvent(found || null);
    } catch (err) {
      console.error("Failed to fetch event:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.loaderContainer}>
          <div style={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.notFound}>
          <span style={{ fontSize: "64px" }}>🎭</span>
          <h2 style={{ color: "#f1f5f9", fontFamily: "'Outfit', sans-serif" }}>
            Event Not Found
          </h2>
          <button onClick={() => navigate("/")} style={styles.backBtn}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />

      {/* Hero Banner */}
      <div style={styles.heroBanner}>
        <img
          src={event.banner_url || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=500&fit=crop"}
          alt={event.title}
          style={styles.heroImage}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=500&fit=crop";
          }}
        />
        <div style={styles.heroOverlay}>
          <div style={styles.heroContent}>
            <div style={styles.typeBadge}>{event.event_type}</div>
            <h1 style={styles.heroTitle}>{event.title}</h1>

            <div style={styles.metaRow}>
              <span style={styles.metaItem}>📍 {event.location}</span>
              <span style={styles.metaDivider}>•</span>
              <span style={styles.metaItem}>📅 {formatDate(event.date_time)}</span>
              <span style={styles.metaDivider}>•</span>
              <span style={styles.metaItem}>🕐 {formatTime(event.date_time)}</span>
            </div>

            <div style={styles.seatsInfo}>
              <span style={styles.seatsBadge}>🎫 {event.total_seats} Total Seats</span>
            </div>

            <button
              style={styles.bookBtn}
              onClick={() => navigate(`/booking/${id}`)}
              id="book-tickets-btn"
            >
              🎟️ Book Tickets
            </button>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div style={styles.detailsContainer}>
        <div style={styles.detailsGrid}>
          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>📌 Event Details</h3>
            <div style={styles.infoList}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Type</span>
                <span style={styles.infoValue}>{event.event_type}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Location</span>
                <span style={styles.infoValue}>{event.location}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Date</span>
                <span style={styles.infoValue}>{formatDate(event.date_time)}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Time</span>
                <span style={styles.infoValue}>{formatTime(event.date_time)}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Total Seats</span>
                <span style={styles.infoValue}>{event.total_seats}</span>
              </div>
            </div>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.cardTitle}>🎬 About</h3>
            <p style={styles.aboutText}>
              Experience the best of entertainment with <strong>{event.title}</strong>.
              This {event.event_type?.toLowerCase()} event is happening at {event.location}.
              Grab your tickets before they sell out!
            </p>
            <div style={styles.ctaCard}>
              <p style={styles.ctaText}>Ready to book?</p>
              <button
                style={styles.ctaBtn}
                onClick={() => navigate(`/booking/${id}`)}
              >
                View Available Shows →
              </button>
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
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(255,255,255,0.08)",
    borderTopColor: "#e63946",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  notFound: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "16px",
  },
  backBtn: {
    padding: "10px 20px",
    background: "transparent",
    color: "#e63946",
    border: "1px solid rgba(230,57,70,0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
  heroBanner: {
    position: "relative",
    height: "450px",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(10,14,23,1) 0%, rgba(10,14,23,0.8) 40%, rgba(10,14,23,0.3) 100%)",
    display: "flex",
    alignItems: "flex-end",
  },
  heroContent: {
    padding: "40px 48px",
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
  },
  typeBadge: {
    display: "inline-block",
    background: "linear-gradient(135deg, #e63946, #ff4d5a)",
    color: "#fff",
    padding: "5px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: "14px",
    boxShadow: "0 2px 10px rgba(230,57,70,0.4)",
  },
  heroTitle: {
    fontSize: "40px",
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    color: "#f1f5f9",
    marginBottom: "14px",
    lineHeight: 1.15,
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
    flexWrap: "wrap",
  },
  metaItem: {
    color: "#94a3b8",
    fontSize: "15px",
  },
  metaDivider: {
    color: "#4a5568",
  },
  seatsInfo: {
    marginBottom: "22px",
  },
  seatsBadge: {
    background: "rgba(16,185,129,0.15)",
    color: "#10b981",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 600,
    border: "1px solid rgba(16,185,129,0.2)",
  },
  bookBtn: {
    padding: "14px 36px",
    background: "linear-gradient(135deg, #e63946, #ff4d5a)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(230,57,70,0.4)",
    transition: "all 0.3s ease",
    letterSpacing: "0.3px",
  },
  detailsContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 48px 60px",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  infoCard: {
    background: "#1a2035",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "28px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    color: "#f1f5f9",
    marginBottom: "20px",
  },
  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  infoLabel: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: 500,
  },
  infoValue: {
    color: "#f1f5f9",
    fontSize: "14px",
    fontWeight: 600,
  },
  aboutText: {
    color: "#94a3b8",
    fontSize: "15px",
    lineHeight: 1.7,
    marginBottom: "24px",
  },
  ctaCard: {
    background: "rgba(230,57,70,0.08)",
    border: "1px solid rgba(230,57,70,0.15)",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
  },
  ctaText: {
    color: "#f1f5f9",
    fontWeight: 600,
    marginBottom: "12px",
  },
  ctaBtn: {
    padding: "10px 24px",
    background: "transparent",
    color: "#e63946",
    border: "1px solid rgba(230,57,70,0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.2s",
  },
};