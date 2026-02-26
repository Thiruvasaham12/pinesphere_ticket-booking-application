export default function PosterCard({ title, image }) {
  return (
    <div style={styles.card}>
      <img src={image} alt={title} style={styles.image} />
      <p style={styles.title}>{title}</p>
    </div>
  );
}

const styles = {
  card: {
    width: "160px",
    marginRight: "16px",
    cursor: "pointer",
  },
  image: {
    width: "160px",
    height: "240px",
    objectFit: "cover",
    borderRadius: "12px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
  },
  title: {
    marginTop: "8px",
    fontSize: "14px",
    fontWeight: "500",
  },
};