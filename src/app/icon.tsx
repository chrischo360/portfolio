import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og-font";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: -0.5,
          borderRadius: "25%",
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
