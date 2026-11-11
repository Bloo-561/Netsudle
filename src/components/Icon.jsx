// Character portrait. Uses the small thumbnail when one exists and falls back
// to the full-size icon (for characters added without a thumbnail).
export default function Icon({ char, className, alt = "", style }) {
  return (
    <img
      src={char.thumb}
      alt={alt}
      loading="lazy"
      className={className}
      style={style}
      onError={(e) => {
        if (!e.currentTarget.dataset.fallback) {
          e.currentTarget.dataset.fallback = "1";
          e.currentTarget.src = char.icon;
        }
      }}
    />
  );
}
