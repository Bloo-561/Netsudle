// Shows a zoomed-in piece of an image and zooms out a little with each wrong guess.
// Starts very close and opens up with each wrong guess. Edit to tune difficulty.
const SCALES = [11, 8, 5.5, 3.8, 2.5, 1.6];
const BOX = 3 / 4; // width / height of the frame

export default function ZoomImage({ src, fx, fy, w, h, step, revealed, alt }) {
  // The image is letterboxed inside the frame; turn the focal point (given in
  // percent of the image) into percent of the frame.
  const ratio = w && h ? w / h : BOX;
  let ox = fx;
  let oy = fy;
  if (ratio > BOX) {
    const used = (BOX / ratio) * 100;
    oy = (100 - used) / 2 + (fy * used) / 100;
  } else {
    const used = (ratio / BOX) * 100;
    ox = (100 - used) / 2 + (fx * used) / 100;
  }
  const scale = revealed ? 1 : SCALES[Math.min(step, SCALES.length - 1)];

  return (
    <div
      className="relative overflow-hidden rounded-md bg-neutral-900 border-4 border-[#6e3343] mx-auto w-full max-w-xs"
      style={{ aspectRatio: "3 / 4" }}
    >
      <img
        src={src}
        alt={revealed ? alt : "Zoomed-in art of the mystery character"}
        draggable={false}
        className="w-full h-full object-contain select-none pointer-events-none"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: `${ox}% ${oy}%`,
          transition: "transform 0.7s ease",
        }}
      />
    </div>
  );
}
