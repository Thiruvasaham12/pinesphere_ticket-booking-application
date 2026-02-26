import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createEvent, createShow, getEvents, getEventWiseBookings, getTotalBookings } from "../services/api";
import Toast from "../components/Toast";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reports state
  const [totalBookings, setTotalBookings] = useState(0);
  const [eventReports, setEventReports] = useState([]);

  // Event form
  const [eventForm, setEventForm] = useState({
    title: "",
    event_type: "",
    location: "",
    date_time: "",
    total_seats: "",
    banner_url: "",
  });

  // Show form
  const [showForm, setShowForm] = useState({
    event_id: "",
    theater_name: "",
    show_time: "",
    price: "",
    total_seats: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/");
      return;
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  const fetchReports = async () => {
    try {
      const [totalRes, eventRes] = await Promise.all([
        getTotalBookings(),
        getEventWiseBookings()
      ]);
      setTotalBookings(totalRes.data.total_bookings);
      setEventReports(eventRes.data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "reports") {
      fetchReports();
    }
  }, [activeTab]);

  const handleEventChange = (e) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };

  const handleShowChange = (e) => {
    setShowForm({ ...showForm, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.event_type || !eventForm.location || !eventForm.date_time || !eventForm.total_seats) {
      setToast({ message: "Please fill in all required fields", type: "warning" });
      return;
    }

    setLoading(true);
    try {
      await createEvent({
        ...eventForm,
        total_seats: parseInt(eventForm.total_seats),
        banner_url: eventForm.banner_url || null,
      });
      setToast({ message: "Event created successfully! 🎬", type: "success" });
      setEventForm({ title: "", event_type: "", location: "", date_time: "", total_seats: "", banner_url: "" });
      fetchEvents();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to create event";
      setToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    if (!showForm.event_id || !showForm.theater_name || !showForm.show_time || !showForm.price || !showForm.total_seats) {
      setToast({ message: "Please fill in all fields", type: "warning" });
      return;
    }

    setLoading(true);
    try {
      await createShow({
        ...showForm,
        event_id: parseInt(showForm.event_id),
        price: parseInt(showForm.price),
        total_seats: parseInt(showForm.total_seats),
      });
      setToast({ message: "Show created successfully! 🎭", type: "success" });
      setShowForm({ event_id: "", theater_name: "", show_time: "", price: "", total_seats: "" });
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to create show";
      setToast({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <span style={styles.adminIcon}>⚡</span> Admin Dashboard
            </h1>
            <p style={styles.subtitle}>Manage events and shows</p>
          </div>
          <div style={styles.statCards}>
            <div style={styles.statCard}>
              <span style={styles.statNum}>{events.length}</span>
              <span style={styles.statLabel}>Events</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab("events")}
            style={{
              ...styles.tab,
              ...(activeTab === "events" ? styles.tabActive : {}),
            }}
            id="tab-events"
          >
            🎬 Create Event
          </button>
          <button
            onClick={() => setActiveTab("shows")}
            style={{
              ...styles.tab,
              ...(activeTab === "shows" ? styles.tabActive : {}),
            }}
            id="tab-shows"
          >
            🎭 Create Show
          </button>
          <button
            onClick={() => setActiveTab("list")}
            style={{
              ...styles.tab,
              ...(activeTab === "list" ? styles.tabActive : {}),
            }}
            id="tab-list"
          >
            📋 All Events
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            style={{
              ...styles.tab,
              ...(activeTab === "reports" ? styles.tabActive : {}),
            }}
            id="tab-reports"
          >
            📊 Reports
          </button>
        </div>

        {/* Create Event Form */}
        {activeTab === "events" && (
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Create New Event</h2>
            <form onSubmit={handleCreateEvent} style={styles.form} id="create-event-form">
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Title *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Avengers: Endgame"
                    value={eventForm.title}
                    onChange={handleEventChange}
                    style={styles.input}
                    id="event-title"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Event Type *</label>
                  <input
                    type="text"
                    name="event_type"
                    placeholder="e.g. Movie, Concert, Sports"
                    value={eventForm.event_type}
                    onChange={handleEventChange}
                    style={styles.input}
                    id="event-type"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Location *</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Mumbai, Delhi"
                    value={eventForm.location}
                    onChange={handleEventChange}
                    style={styles.input}
                    id="event-location"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="date_time"
                    value={eventForm.date_time}
                    onChange={handleEventChange}
                    style={styles.input}
                    id="event-datetime"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Total Seats *</label>
                  <input
                    type="number"
                    name="total_seats"
                    placeholder="e.g. 200"
                    value={eventForm.total_seats}
                    onChange={handleEventChange}
                    style={styles.input}
                    id="event-seats"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Banner URL (Optional)</label>
                  <input
                    type="url"
                    name="banner_url"
                    placeholder="https://..."
                    value={eventForm.banner_url}
                    onChange={handleEventChange}
                    style={styles.input}
                    id="event-banner"
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.7 : 1,
                }}
                disabled={loading}
                id="submit-event"
              >
                {loading ? "Creating..." : "🚀 Create Event"}
              </button>
            </form>
          </div>
        )}

        {/* Create Show Form */}
        {activeTab === "shows" && (
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Create New Show</h2>
            <form onSubmit={handleCreateShow} style={styles.form} id="create-show-form">
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Event *</label>
                  <select
                    name="event_id"
                    value={showForm.event_id}
                    onChange={handleShowChange}
                    style={styles.input}
                    id="show-event"
                  >
                    <option value="">Select an event</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title} ({event.event_type})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Theater Name *</label>
                  <input
                    type="text"
                    name="theater_name"
                    placeholder="e.g. PVR Cinemas"
                    value={showForm.theater_name}
                    onChange={handleShowChange}
                    style={styles.input}
                    id="show-theater"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Show Time *</label>
                  <input
                    type="datetime-local"
                    name="show_time"
                    value={showForm.show_time}
                    onChange={handleShowChange}
                    style={styles.input}
                    id="show-time"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="e.g. 250"
                    value={showForm.price}
                    onChange={handleShowChange}
                    style={styles.input}
                    id="show-price"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Total Seats *</label>
                  <input
                    type="number"
                    name="total_seats"
                    placeholder="e.g. 120"
                    value={showForm.total_seats}
                    onChange={handleShowChange}
                    style={styles.input}
                    id="show-seats"
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  ...styles.submitBtnPurple,
                  opacity: loading ? 0.7 : 1,
                }}
                disabled={loading}
                id="submit-show"
              >
                {loading ? "Creating..." : "🎭 Create Show"}
              </button>
            </form>
          </div>
        )}

        {/* Events List */}
        {activeTab === "list" && (
          <div style={styles.listSection}>
            <h2 style={styles.formTitle}>All Events</h2>
            {events.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={{ fontSize: "48px" }}>📭</span>
                <p style={{ color: "#64748b" }}>No events created yet</p>
              </div>
            ) : (
              <div style={styles.eventsList}>
                {events.map((event) => (
                  <div key={event.id} style={styles.eventItem}>
                    <div style={styles.eventItemLeft}>
                      <div style={styles.eventId}>#{event.id}</div>
                      <div>
                        <h4 style={styles.eventItemTitle}>{event.title}</h4>
                        <p style={styles.eventItemMeta}>
                          {event.event_type} • {event.location} • {event.total_seats} seats
                        </p>
                      </div>
                    </div>
                    <div style={styles.eventItemDate}>
                      {new Date(event.date_time).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Reports & Summaries</h2>

            <div style={styles.metricsGrid}>
              <div style={styles.metricCard}>
                <h3 style={styles.metricLabel}>Total Bookings</h3>
                <p style={styles.metricValue}>{totalBookings}</p>
              </div>
            </div>

            <h3 style={{ ...styles.formTitle, marginTop: '32px', fontSize: '18px' }}>Event-wise Bookings</h3>

            {eventReports.length === 0 ? (
              <p style={{ color: "#64748b" }}>No booking data available yet</p>
            ) : (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Event ID</th>
                      <th style={styles.th}>Event Title</th>
                      <th style={styles.th}>Total Seats Booked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventReports.map((report) => (
                      <tr key={report.event_id} style={styles.tr}>
                        <td style={styles.td}>#{report.event_id}</td>
                        <td style={styles.td}>{report.title}</td>
                        <td style={styles.td}>
                          <span style={styles.badge}>{report.total_booked}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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
    maxWidth: "900px",
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
    fontSize: "32px",
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    color: "#f1f5f9",
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  adminIcon: {
    fontSize: "28px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "15px",
  },
  statCards: {
    display: "flex",
    gap: "12px",
  },
  statCard: {
    background: "#1a2035",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "14px",
    padding: "16px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "80px",
  },
  statNum: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#e63946",
    fontFamily: "'Outfit', sans-serif",
  },
  statLabel: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 500,
    marginTop: "2px",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },
  tab: {
    padding: "10px 22px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "transparent",
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  tabActive: {
    background: "linear-gradient(135deg, #e63946, #ff4d5a)",
    color: "#fff",
    border: "1px solid transparent",
    boxShadow: "0 2px 12px rgba(230,57,70,0.3)",
  },
  formCard: {
    background: "#1a2035",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "20px",
    padding: "36px",
    animation: "fadeIn 0.3s ease",
  },
  formTitle: {
    fontSize: "22px",
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    color: "#f1f5f9",
    marginBottom: "24px",
  },
  form: {},
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginBottom: "28px",
  },
  inputGroup: {},
  label: {
    display: "block",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
    letterSpacing: "0.3px",
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#f1f5f9",
    fontSize: "14px",
    boxSizing: "border-box",
    transition: "all 0.2s",
  },
  submitBtn: {
    padding: "14px 36px",
    background: "linear-gradient(135deg, #e63946, #ff4d5a)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(230,57,70,0.35)",
    transition: "all 0.2s ease",
    letterSpacing: "0.3px",
  },
  submitBtnPurple: {
    padding: "14px 36px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
    transition: "all 0.2s ease",
    letterSpacing: "0.3px",
  },
  listSection: {
    animation: "fadeIn 0.3s ease",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },
  eventsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  eventItem: {
    background: "#1a2035",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "14px",
    padding: "18px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s ease",
  },
  eventItemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  eventId: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "rgba(230,57,70,0.12)",
    color: "#e63946",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 700,
  },
  eventItemTitle: {
    color: "#f1f5f9",
    fontSize: "16px",
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    margin: 0,
  },
  eventItemMeta: {
    color: "#64748b",
    fontSize: "13px",
    marginTop: "2px",
  },
  eventItemDate: {
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: 500,
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  metricCard: {
    background: "rgba(230,57,70,0.1)",
    border: "1px solid rgba(230,57,70,0.2)",
    borderRadius: "14px",
    padding: "24px",
    textAlign: "center",
  },
  metricLabel: {
    color: "#e63946",
    fontSize: "14px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "8px",
  },
  metricValue: {
    color: "#fff",
    fontSize: "36px",
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
  },
  tableContainer: {
    overflowX: "auto",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: 600,
    padding: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tr: {
    transition: "background 0.2s",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
  },
  td: {
    padding: "16px",
    color: "#f1f5f9",
    fontSize: "14px",
  },
  badge: {
    background: "rgba(16,185,129,0.15)",
    color: "#10b981",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 600,
  }
};