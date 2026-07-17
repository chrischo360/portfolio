import { type NextRequest, NextResponse } from "next/server";
import { codeToHtml } from "shiki";

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src");
  const lang = request.nextUrl.searchParams.get("lang") ?? "bash";

  if (!src?.startsWith("https://raw.githubusercontent.com/")) {
    return NextResponse.json({ error: "Invalid src" }, { status: 400 });
  }

  try {
    const res = await fetch(src, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Upstream fetch failed: ${res.status}`);

    const text = await res.text();
    const html = await codeToHtml(text, { lang, theme: "min-light" });

    return NextResponse.json({ html }, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load file" },
      { status: 502 },
    );
  }
}
