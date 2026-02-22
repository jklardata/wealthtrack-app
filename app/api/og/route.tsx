import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "SoloFI";
  const category = searchParams.get("category") ?? "Financial Planning";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f8fafc",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Emerald accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            backgroundColor: "#059669",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "60px 72px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "28px", fontWeight: 700, color: "#059669" }}>
              Solo
            </span>
            <span style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a" }}>
              FI
            </span>
          </div>

          {/* Title area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                backgroundColor: "#ecfdf5",
                border: "1px solid #a7f3d0",
                borderRadius: "8px",
                padding: "8px 16px",
                width: "fit-content",
              }}
            >
              <span style={{ fontSize: "16px", color: "#059669", fontWeight: 600 }}>
                {category}
              </span>
            </div>
            <div
              style={{
                fontSize: title.length > 60 ? "44px" : "54px",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.15,
                maxWidth: "900px",
              }}
            >
              {title}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "18px", color: "#64748b" }}>
              solofi.io
            </span>
            <span
              style={{
                fontSize: "16px",
                color: "#64748b",
                backgroundColor: "#f1f5f9",
                padding: "8px 20px",
                borderRadius: "24px",
              }}
            >
              For self-employed professionals
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
