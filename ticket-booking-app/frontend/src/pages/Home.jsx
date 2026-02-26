import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import MovieCard from "../components/MovieCard";
import { getEvents } from "../services/api";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique event types for filter tabs
  const eventTypes = ["All", ...new Set(events.map((e) => e.event_type))];

  const filtered = filter === "All"
    ? events
    : events.filter((e) => e.event_type === filter);

  return (
    <div style={styles.page}>
      <Navbar />
      <HeroBanner event={events[0]} />

      <div style={styles.container}>
        {/* Section Header */}
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>🎬 Now Showing</h2>
            <p style={styles.sectionSub}>Browse events and book your tickets</p>
          </div>
        </div>

        {/* Filter Tabs */}
        {eventTypes.length > 1 && (
          <div style={styles.filterRow}>
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  ...styles.filterBtn,
                  ...(filter === type ? styles.filterBtnActive : {}),
                }}
                id={`filter-${type}`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div style={styles.loaderContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading events...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>🎭</span>
            <h3 style={styles.emptyTitle}>No Events Found</h3>
            <p style={styles.emptyText}>
              {events.length === 0
                ? "No events available at the moment. Check back soon!"
                : "No events match this filter."}
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((event) => (
              <MovieCard key={event.id} {...event} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2026 BookMyShow. All rights reserved. Made with ❤️
        </p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0e17",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 32px 60px",
  },
  sectionHeader: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#f1f5f9",
    fontFamily: "'Outfit', sans-serif",
    marginBottom: "6px",
  },
  sectionSub: {
    color: "#64748b",
    fontSize: "15px",
  },
  filterRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "8px 20px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    textTransform: "capitalize",
  },
  filterBtnActive: {
    background: "linear-gradient(135deg, #e63946, #ff4d5a)",
    color: "#fff",
    border: "1px solid transparent",
    boxShadow: "0 2px 12px rgba(230,57,70,0.35)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "24px",
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
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.06)",
    padding: "24px 32px",
    textAlign: "center",
  },
  footerText: {
    color: "#4a5568",
    fontSize: "13px",
  },
};