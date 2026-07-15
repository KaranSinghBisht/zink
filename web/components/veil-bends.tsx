"use client";

import dynamic from "next/dynamic";

const ColorBends = dynamic(() => import("./color-bends"), { ssr: false });

/**
 * Full-bleed animated backdrop for dark surfaces: the Zink gold/ember
 * palette flowing as slow shader bands over the night base. Rendered
 * client-only; the .veil base color paints first so there is no flash.
 */
export function VeilBends({
  intensity = 1.15,
  speed = 0.14,
  className = "",
}: {
  intensity?: number;
  speed?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      // Inline position wins over the `.veil > *` stacking rule, keeping this
      // layer out of normal flow; z-index 1 sits under the content (z 2) and
      // under the grain overlay pseudo-element.
      style={{ position: "absolute", inset: 0, zIndex: 1 }}
      className={`pointer-events-none ${className}`}
    >
      <ColorBends
        colors={["#f4b728", "#b97f2a", "#f2ead8", "#6b4a1f"]}
        rotation={62}
        autoRotate={1.5}
        speed={speed}
        scale={1.3}
        frequency={0.9}
        warpStrength={1.15}
        mouseInfluence={0.6}
        parallax={0.45}
        noise={0.1}
        iterations={2}
        intensity={intensity}
        bandWidth={7}
        transparent
        className="opacity-60 mix-blend-screen"
      />
    </div>
  );
}
