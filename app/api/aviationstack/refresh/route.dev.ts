import { NextResponse } from "next/server"
import { promises as fs } from "node:fs"
import path from "node:path"
import { buildOpenSkySnapshot } from "@/lib/opensky"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST() {
  try {
    const snapshot = await buildOpenSkySnapshot()
    const outPath = path.join(process.cwd(), "lib/opensky-snapshot.json")
    await fs.writeFile(outPath, JSON.stringify(snapshot, null, 2) + "\n", "utf8")
    return NextResponse.json({ ok: true, snapshot })
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
