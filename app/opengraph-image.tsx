import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CYVANT";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0f1e",
            borderRadius: 40,
            width: 280,
            height: 280,
            marginRight: 60,
          }}
        >
          <span
            style={{
              fontFamily: "sans-serif",
              fontWeight: 900,
              fontSize: 140,
              letterSpacing: -6,
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            C
          </span>
          <span
            style={{
              fontFamily: "sans-serif",
              fontWeight: 900,
              fontSize: 140,
              letterSpacing: -6,
              color: "#007dff",
              lineHeight: 1,
            }}
          >
            V
          </span>
        </div>

        {/* Wordmark + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span
            style={{
              fontFamily: "sans-serif",
              fontWeight: 900,
              fontSize: 96,
              color: "#0a0f1e",
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            CYVANT
          </span>
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: 32,
              color: "#007dff",
              letterSpacing: 2,
            }}
          >
            AI &amp; Cybersecurity Education
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
