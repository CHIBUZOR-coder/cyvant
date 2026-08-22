import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          background: "#0a0f1e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontWeight: 900,
            fontSize: 28,
            letterSpacing: "-1px",
            color: "#ffffff",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#ffffff" }}>CY</span>
          <span style={{ color: "#007dff" }}>V</span>
        </span>
      </div>
    ),
    { ...size }
  );
}
