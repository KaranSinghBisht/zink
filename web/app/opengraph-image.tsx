import { ImageResponse } from "next/og";

export const alt = "Zink — private Zcash payment links that reconcile themselves";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        color: "#f2ead8",
        background:
          "radial-gradient(circle at 78% 18%, #6d4c24 0%, #2a2015 37%, #16110c 72%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800 }}>
          zink<span style={{ color: "#f4b728" }}>.</span>
        </div>
        <div
          style={{
            display: "flex",
            border: "1px solid rgba(242,234,216,.35)",
            borderRadius: 999,
            padding: "9px 16px",
            fontSize: 16,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(242,234,216,.72)",
          }}
        >
          Zcash · view-only · non-custodial
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            maxWidth: 980,
            fontSize: 82,
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: -5,
          }}
        >
          payment links that never link back.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 25,
            color: "rgba(242,234,216,.72)",
          }}
        >
          Fresh Orchard address per invoice. Automatic reconciliation. No
          spending key on the server.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 17,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "#f4b728",
        }}
      >
        <span>ZecHub Hackathon · Accounting</span>
        <span>Mainnet + testnet</span>
      </div>
    </div>,
    size,
  );
}
