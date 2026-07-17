// Fetches a Google Font file at request time so next/og's ImageResponse can
// render it. ImageResponse (Satori) can't use `next/font` directly and only
// ships a generic sans-serif fallback, so favicon/apple-icon routes need to
// load the real font bytes themselves to match the site's serif type.
export async function loadGoogleFont(
  family: string,
  text: string,
  italic = false,
  weight = 600,
) {
  const params = new URLSearchParams({
    family: `${family}:ital,wght@${italic ? 1 : 0},${weight}`,
    text,
  });
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?${params.toString()}`)
  ).text();
  const match = css.match(/src: url\(([^)]+)\)/);
  if (!match) {
    throw new Error(`Could not find font source for ${family}`);
  }
  const response = await fetch(match[1]);
  if (!response.ok) {
    throw new Error(`Failed to fetch font data for ${family}`);
  }
  return response.arrayBuffer();
}
