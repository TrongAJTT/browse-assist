import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT_DIR = path.resolve(__dirname, "..")
const SVG_PATH = path.join(ROOT_DIR, "assets", "icon.svg")
const PNG_PATH = path.join(ROOT_DIR, "assets", "icon.png")

async function generatePng() {
  console.log("Reading SVG from:", SVG_PATH)
  const svgBuffer = await fs.readFile(SVG_PATH)

  console.log("Rendering 1000x1000 PNG with sharp...")
  await sharp(svgBuffer)
    .resize(1000, 1000, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true
    })
    .toFile(PNG_PATH)

  const stats = await fs.stat(PNG_PATH)
  console.log(`Successfully generated ${PNG_PATH} (${stats.size} bytes)`)
}

generatePng().catch((err) => {
  console.error("Failed to generate icon PNG:", err)
  process.exit(1)
})
