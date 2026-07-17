import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-font";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const text = "cc";
  const fontData = await loadGoogleFont("Source Serif 4", text, true, 600);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#4a3829",
          color: "#fbfaf7",
          fontFamily: "Source Serif 4",
          fontSize: 92,
          fontWeight: 600,
          letterSpacing: -3,
        }}
      >
        {text}
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Source Serif 4",
          data: fontData,
          style: "italic",
          weight: 600,
        },
      ],
    },
  );
}
