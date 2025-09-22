import { Link } from "react-router-dom";
import styles from "./CamperCard.module.css";

function getCoverImage(camper) {
  const first = camper?.gallery?.[0];
  if (first?.thumb) return first.thumb;          // Catalog için thumb
  if (first?.original) return first.original;    // fallback
  return "https://via.placeholder.com/400x300?text=No+Image";
}

function formatPrice(value) {
  const n = Number(value);
  return isNaN(n) ? "0.00" : n.toFixed(2);
}

export default function CamperCard({ camper }) {
  if (!camper) return null;

  const imageUrl = getCoverImage(camper);
  const reviewCount = camper?.reviews?.length || 0;
  const rating = camper?.rating ?? 0;

  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <img src={imageUrl} alt={camper.name || "Camper"} />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{camper.name}</h3>
          <div className={styles.price}>€{formatPrice(camper.price)}</div>
          <button className={styles.favorite} aria-label="Add to favorites">♡</button>
        </div>

        <div className={styles.meta}>
          <span>★ {rating} ({reviewCount} Reviews)</span>
          <span>📍 {camper.location}</span>
        </div>

        <p className={styles.description}>
          {camper.description}
        </p>

        <div className={styles.features}>
          <span className={styles.tag}>{camper.transmission}</span>
          <span className={styles.tag}>{camper.engine}</span>
          {camper.kitchen && <span className={styles.tag}>Kitchen</span>}
          {camper.AC && <span className={styles.tag}>AC</span>}
          {camper.bathroom && <span className={styles.tag}>Bathroom</span>}
          {camper.TV && <span className={styles.tag}>TV</span>}
          {camper.radio && <span className={styles.tag}>Radio</span>}
          {camper.refrigerator && <span className={styles.tag}>Refrigerator</span>}
          {camper.microwave && <span className={styles.tag}>Microwave</span>}
          {camper.gas && <span className={styles.tag}>Gas</span>}
          {camper.water && <span className={styles.tag}>Water</span>}
        </div>

        <Link
          to={`/catalog/${camper.id}`}
          target="_blank"
          rel="noopener"
          className={styles.button}
        >
          Show more
        </Link>
      </div>
    </div>
  );
}
