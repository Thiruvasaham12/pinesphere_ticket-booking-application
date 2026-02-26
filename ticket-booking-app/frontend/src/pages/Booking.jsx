import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TheatreCard from "../components/TheatreCard";
import { getShowsForEvent, getEvents } from "../services/api";

export default function Booking() {
  const { id } = useParams();
  const [shows, setShows] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [showsRes, eventsRes] = await Promise.all([
        getShowsForEvent(id),
        getEvents(),
      ]);
      setShows(showsRes.data);
      const found = eventsRes.data.find((e) => e.id === parseInt(id));
      setEvent(found || null);
    } catch (err) {
      console.error("Failed to fetch shows:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              {event ? `Shows for "${event.title}"` : "Select a Show"}
            </h1>
            <p style={styles.subtitle}>
              {event
                ? `📍 ${event.location} • Choose a showtime and book your seats`
                : "Pick a showtime that works for you"}
            </p>
          </div>
          {shows.length > 0 && (
            <div style={styles.countBadge}>
              {shows.length} show{shows.length > 1 ? "s" : ""} available
            </div>
          )}
        </div>

        {/* Shows List */}
        {loading ? (
          <div style={styles.loaderContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading shows...</p>
          </div>
        ) : shows.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>🎭</span>
            <h3 style={styles.emptyTitle}>No Shows Available</h3>
            <p style={styles.emptyText}>
              There are no shows scheduled for this event yet. Check back later!
            </p>
          </div>
        ) : (
          <div style={styles.showsList}>
            {Object.entries(
              shows.reduce((acc, show) => {
                if (!acc[show.theater_name]) acc[show.theater_name] = [];
                acc[show.theater_name].push(show);
                return acc;
              }, {})
            ).map(([theaterName, theaterShows]) => (
              <TheatreCard
                key={theaterName}
                theaterName={theaterName}
                shows={theaterShows}
                eventId={id}
              />
            ))}
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
    maxWidth: "800px",
    margin: "0 auto",
    padding: "32px 24px 60px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    color: "#f1f5f9",
    marginBottom: "6px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "15px",
  },
  countBadge: {
    background: "rgba(16,185,129,0.12)",
    color: "#10b981",
    padding: "8px 18px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 600,
    border: "1px solid rgba(16,185,129,0.2)",
    whiteSpace: "nowrap",
  },
  showsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "300px",
    gap: "16px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(255,255,255,0.08)",
    borderTopColor: "#e63946",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    color: "#64748b",
    fontSize: "14px",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
  },
  emptyIcon: {
    fontSize: "64px",
    display: "block",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#f1f5f9",
    fontFamily: "'Outfit', sans-serif",
    marginBottom: "8px",
  },
  emptyText: {
    color: "#64748b",
    fontSize: "15px",
  },
};