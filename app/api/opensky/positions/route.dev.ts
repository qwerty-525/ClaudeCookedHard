import { NextResponse } from "next/server"
import { promises as fs } from "node:fs"
import path from "node:path"
import { refreshPositions } from "@/lib/opensky"
import type { OpenSkySnapshot } from "@/lib/opensky"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST() {
  try {
    const snapshotPath = path.join(process.cwd(), "lib/opensky-snapshot.json")
    const raw = await fs.readFile(snapshotPath, "utf8")
    const existing = JSON.parse(raw) as OpenSkySnapshot
    const updated = await refreshPositions(existing)
    return NextResponse.json({ snapshot: updated })
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error"
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
