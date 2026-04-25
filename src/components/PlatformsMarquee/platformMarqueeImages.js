/**
 * Fallback when manifest.json fetch fails.
 */
const platformMarqueeImages = Array.from({ length: 16 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `/images/smiles-stories/smiles-${n}.png`;
});

export default platformMarqueeImages;
