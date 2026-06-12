import puppeteer from "puppeteer-core"
import fs from "node:fs"

const label = process.argv[2] ?? "iter00"
const mobile = process.argv.includes("--mobile")
const VIEW = mobile ? { width: 390, height: 844 } : { width: 1680, height: 940 }
const outDir = new URL("../iterations/", import.meta.url).pathname
fs.mkdirSync(outDir, { recursive: true })

// progress points through the teardown section: intro, mid-explode, exploded
// overview, the 7 tour stops, reassembly, finale
const STOPS = [
  ["intro", 0.02],
  ["explode", 0.13],
  ["exploded", 0.2],
  ["s0-fan", 0.245],
  ["s1-lpc", 0.335],
  ["s2-hpc", 0.42],
  ["s3-burner", 0.51],
  ["s4-hpt", 0.6],
  ["s5-lpt", 0.69],
  ["s6-nozzle", 0.78],
  ["reasm", 0.87],
  ["finale", 0.97],
]

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: "new",
  args: [
    "--no-sandbox",
    `--window-size=${VIEW.width},${VIEW.height}`,
    "--enable-unsafe-swiftshader",
    "--hide-scrollbars",
  ],
})

const page = await browser.newPage()
await page.setViewport({ ...VIEW, deviceScaleFactor: 1 })

const errors = []
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text())
})
page.on("pageerror", (err) => errors.push(String(err)))

await page.goto("http://localhost:3000/engines", { waitUntil: "networkidle2", timeout: 90000 })
await new Promise((r) => setTimeout(r, 3000))

const bounds = await page.evaluate(() => {
  const el = document.getElementById("teardown")
  if (!el) return null
  const rect = el.getBoundingClientRect()
  return { top: rect.top + window.scrollY, height: el.offsetHeight, vh: window.innerHeight }
})
if (!bounds) {
  console.error("teardown section not found")
  await browser.close()
  process.exit(1)
}

for (const [name, frac] of STOPS) {
  const y = bounds.top + frac * (bounds.height - bounds.vh)
  await page.evaluate((py) => window.scrollTo(0, py), y)
  await new Promise((r) => setTimeout(r, 900))
  // nudge so framer-motion re-emits a scroll event even if the jump got starved
  await page.evaluate((py) => window.scrollTo(0, py + 1), y)
  await new Promise((r) => setTimeout(r, 1100))
  await page.screenshot({ path: `${outDir}${label}-${name}.png` })
  const dbg = await page.evaluate(() => {
    const intro = document.querySelector('[data-overlay="intro"]')
    return intro ? getComputedStyle(intro).opacity : "no-intro-el"
  })
  console.log(`saved ${label}-${name}.png  introOpacity=${dbg}`)
}

if (errors.length) {
  console.log("\nCONSOLE ERRORS:")
  for (const e of [...new Set(errors)].slice(0, 12)) console.log("  " + e.slice(0, 300))
}
await browser.close()
