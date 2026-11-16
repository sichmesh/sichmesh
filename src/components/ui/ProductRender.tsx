/**
 * Flat BFU SICH product render (`public/device.webp`, rendered from the 3D model).
 *
 * Used as a decorative image in page sections and as the fallback for
 * `Device3D` when WebGL is unavailable.
 */
export default function ProductRender({
  className = "",
  alt = "BFU SICH device",
  priority = false,
}: {
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/device.webp"
      width={625}
      height={1400}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
    />
  );
}
