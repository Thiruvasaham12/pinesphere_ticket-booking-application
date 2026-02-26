import { useNavigate } from "react-router-dom";

export default function HeroBanner({ event }) {
  const navigate = useNavigate();

  return (
    <div style={styles.banner}>
      <div style={styles.bgLayer}>
        {/* Gradient overlay art */}
        <div style={styles.gradientLeft}></div>
        <div style={styles.gradientRight}></div>
        <div style={styles.particles}></div>
      </div>

      <div style={styles.content}>
        <div style={styles.tagline}>
          <span style={styles.tagBadge}>🔥 TRENDING NOW</span>
        </div>

        <h1 style={styles.title}>
          Book Your <span style={styles.highlight}>Perfect Experience</span>
        </h1>
        <p style={styles.subtitle}>
          Movies, events, shows — all in one place. Get the best seats at the best prices.
        </p>

        <div style={styles.stats}>
          <div style={styles.stat}>
            <span style={styles.statNum}>500+</span>
            <span style={styles.statLabel}>Events</span>
          </div>
          <div style={styles.divider}></div>
          <div style={styles.stat}>
            <span style={styles.statNum}>10K+</span>
            <span style={styles.statLabel}>Bookings</span>
          </div>
          <div style={styles.divider}></div>
          <div style={styles.stat}>
            <span style={styles.statNum}>50+</span>
            <span style={styles.statLabel}>Cities</span>
          </div>
        </div>

        {event && (
          <button
            style={styles.ctaBtn}
            onClick={() => navigate(`/movie/${event.id}`)}
            id="hero-cta"
          >
            🎬 Explore Now
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  banner: {
    position: "relative",
    minHeight: "420px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    marginBottom: "32px",
  },
  bgLayer: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #0a0e17 0%, #1a1040 40%, #2d1b4e 70%, #0a0e17 100%)",
  },
  gradientLeft: {
    position: "absolute",
    top: "-50%",
    left: "-20%",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(230,57,70,0.15) 0%, transparent 70%)",
    filter: "blur(60px)",
  },
  gradientRight: {
    position: "absolute",
    bottom: "-30%",
    right: "-10%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
    filter: "blur(60px)",
  },
  particles: {
    position: "absolute",
    inset: 0,
    backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
  },
  content: {
    position: "relative",
    zIndex: 2,
    maxWidth: "700px",
    padding: "50px 48px",
  },
  tagline: {
    marginBottom: "16px",
  },
  tagBadge: {
    background: "rgba(230,57,70,0.15)",
    color: "#ff7eb3",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    border: "1px solid rgba(230,57,70,0.2)",
  },
  title: {
    fontSize: "42px",
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    color: "#f1f5f9",
    lineHeight: 1.15,
    marginBottom: "16px",
  },
  highlight: {
    background: "linear-gradient(135deg, #e63946, #ff7eb3, #fbbf24)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "17px",
    lineHeight: 1.6,
    marginBottom: "28px",
    maxWidth: "500px",
  },
  stats: {
    display: "flex",
    gap: "28px",
    alignItems: "center",
    marginBottom: "32px",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
  },
  statNum: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#f1f5f9",
    fontFamily: "'Outfit', sans-serif",
  },
  statLabel: {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 500,
    marginTop: "2px",
  },
  divider: {
    width: "1px",
    height: "40px",
    background: "rgba(255,255,255,0.1)",
  },
  ctaBtn: {
    padding: "14px 32px",
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
};