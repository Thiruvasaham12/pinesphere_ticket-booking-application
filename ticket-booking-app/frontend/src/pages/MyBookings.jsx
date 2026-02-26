import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyBookings } from "../services/api";

export default function MyBookings() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            const res = await getMyBookings();
            setBookings(res.data);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <Navbar />

            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>🎟️ My Bookings</h1>
                    <p style={styles.subtitle}>View your ticket history</p>
                </div>

                {loading ? (
                    <div style={styles.loader}>Loading...</div>
                ) : bookings.length === 0 ? (
                    <div style={styles.emptyState}>
                        <span style={styles.emptyIcon}>🎫</span>
                        <h3 style={styles.emptyTitle}>No bookings yet</h3>
                        <p style={styles.emptyDesc}>You haven't booked any tickets. Explore our events and grab yours!</p>
                        <Link to="/" style={styles.exploreBtn}>Explore Events</Link>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {bookings.map((booking) => (
                            <div key={booking.id} style={styles.card}>
                                <div style={styles.cardTop}>
                                    <div style={styles.idBadge}>Ticket #{booking.id}</div>
                                    <div style={styles.date}>
                                        {booking.date !== "Unknown"
                                            ? new Date(booking.date).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "short", year: "numeric"
                                            })
                                            : "TBA"}
                                    </div>
                                </div>

                                <h3 style={styles.eventTitle}>{booking.event_title}</h3>
                                <p style={styles.location}>📍 {booking.location}</p>

                                <div style={styles.divider}></div>

                                <div style={styles.seatInfo}>
                                    <span style={styles.seatLabel}>Seat Number</span>
                                    <span style={styles.seatValue}>{booking.seat_number}</span>
                                </div>
                            </div>
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
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px 24px 80px",
    },
    header: {
        marginBottom: "40px",
    },
    title: {
        fontSize: "36px",
        fontWeight: 800,
        fontFamily: "'Outfit', sans-serif",
        color: "#f1f5f9",
        marginBottom: "8px",
    },
    subtitle: {
        color: "#64748b",
        fontSize: "16px",
    },
    loader: {
        textAlign: "center",
        color: "#64748b",
        padding: "40px",
    },
    emptyState: {
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(255,255,255,0.1)",
        borderRadius: "20px",
        padding: "60px 20px",
        textAlign: "center",
    },
    emptyIcon: {
        fontSize: "48px",
        marginBottom: "16px",
        display: "block",
    },
    emptyTitle: {
        color: "#f1f5f9",
        fontSize: "20px",
        fontWeight: 600,
        fontFamily: "'Outfit', sans-serif",
        marginBottom: "8px",
    },
    emptyDesc: {
        color: "#94a3b8",
        marginBottom: "24px",
    },
    exploreBtn: {
        display: "inline-block",
        padding: "12px 28px",
        background: "linear-gradient(135deg, #e63946, #ff4d5a)",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "10px",
        fontWeight: 600,
        transition: "all 0.2s",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "24px",
    },
    card: {
        background: "#1a2035",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "20px",
        padding: "24px",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    },
    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
    },
    idBadge: {
        background: "rgba(255,255,255,0.05)",
        color: "#94a3b8",
        padding: "4px 10px",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: 600,
    },
    date: {
        color: "#e63946",
        fontSize: "13px",
        fontWeight: 600,
    },
    eventTitle: {
        color: "#f1f5f9",
        fontSize: "20px",
        fontWeight: 700,
        fontFamily: "'Outfit', sans-serif",
        marginBottom: "6px",
    },
    location: {
        color: "#64748b",
        fontSize: "14px",
    },
    divider: {
        height: "1px",
        background: "rgba(255,255,255,0.06)",
        margin: "20px 0",
    },
    seatInfo: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(16,185,129,0.1)",
        border: "1px solid rgba(16,185,129,0.2)",
        padding: "12px 16px",
        borderRadius: "12px",
    },
    seatLabel: {
        color: "#10b981",
        fontSize: "13px",
        fontWeight: 600,
        textTransform: "uppercase",
    },
    seatValue: {
        color: "#fff",
        fontSize: "22px",
        fontWeight: 800,
        fontFamily: "'Outfit', sans-serif",
    },
};
