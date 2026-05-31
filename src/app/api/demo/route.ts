import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// In docker-compose: BACKEND_URL=http://detectvision-backend:8000
// In local dev (next dev outside compose): falls back to localhost
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: Request) {
  let body: { sku?: string; scene?: string; fileName?: string; lang?: "fr" | "en" } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const sku = typeof body.sku === "string" ? body.sku.trim().slice(0, 50) : "";
  const scene = typeof body.scene === "string" ? body.scene.trim().slice(0, 200) : "";
  const fileName = typeof body.fileName === "string" ? body.fileName.trim().slice(0, 120) : "";
  const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

  if (!sku) {
    return NextResponse.json(
      {
        error: lang === "fr" ? "Indiquez le SKU produit a inspecter." : "Provide the product SKU to inspect.",
      },
      { status: 400 }
    );
  }

  try {
    const r = await fetch(`${BACKEND_URL}/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku, scene, image_filename: fileName, lang }),
      cache: "no-store",
    });
    const j = await r.json();
    if (!r.ok) {
      return NextResponse.json({ error: j.detail || "backend_error" }, { status: r.status });
    }
    return NextResponse.json({
      brief: j.brief,
      model: j.model,
      generatedAt: j.generated_at,
      staticMode: Boolean(j.static_mode),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown_error";
    return NextResponse.json({ error: `backend_unreachable: ${msg}` }, { status: 502 });
  }
}
