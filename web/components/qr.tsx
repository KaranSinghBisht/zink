"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function Qr({ value, size = 232 }: { value: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#0e1116", light: "#fbfaf6" },
    }).catch(() => {
      // Canvas rendering failure leaves the fallback text visible.
    });
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Payment QR code"
      className="rounded-sm"
    />
  );
}
