// raw-images доторх зургуудыг Gallery-д зориулж WebP болгон шахна.
// Ажиллуулах: npm run compress
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const inputDir = path.join(root, "raw-images");
const outputDir = path.join(root, "public", "gallery");
const manifestPath = path.join(root, "lib", "gallery-images.json");

const extensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic"]);
const maxWidth = 1600;
const startQuality = 75;
const minQuality = 40;
const qualityStep = 10;
const maxBytes = 300 * 1024;

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

// sharp-ийн бэлэн build HEIC (HEVC)-ийг задалж чаддаггүй тул macOS дээр sips-ээр JPEG болгоно.
async function readInput(file) {
  if (path.extname(file).toLowerCase() !== ".heic") return readFile(file);
  if (process.platform !== "darwin") {
    throw new Error("HEIC-ийг зөвхөн macOS дээр хөрвүүлнэ. Зургаа JPEG болгоод дахин оролдоно уу.");
  }
  const tempDir = await mkdtemp(path.join(tmpdir(), "merit-heic-"));
  const tempFile = path.join(tempDir, "image.jpg");
  try {
    await promisify(execFile)("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "95", file, "--out", tempFile]);
    return await readFile(tempFile);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function encode(input, quality) {
  return sharp(input)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer({ resolveWithObject: true });
}

async function main() {
  await mkdir(inputDir, { recursive: true });
  await mkdir(outputDir, { recursive: true });

  const files = (await readdir(inputDir))
    .filter((name) => extensions.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (!files.length) {
    console.log("raw-images хавтас хоосон байна. Зургаа тийш хийгээд дахин ажиллуулна уу.");
    return;
  }

  // Өмнөх ажиллуулалтын зургууд үлдэж, дугаар холилдохгүйн тулд хуучныг цэвэрлэнэ.
  for (const name of await readdir(outputDir)) {
    if (/^zurag-\d+\.webp$/.test(name)) await rm(path.join(outputDir, name));
  }

  const manifest = [];
  let failed = 0;

  for (const name of files) {
    try {
      const input = await readInput(path.join(inputDir, name));
      let quality = startQuality;
      let result = await encode(input, quality);

      while (result.data.length > maxBytes && quality - qualityStep >= minQuality) {
        quality -= qualityStep;
        result = await encode(input, quality);
      }

      const outName = `zurag-${manifest.length + 1}.webp`;
      await writeFile(path.join(outputDir, outName), result.data);
      manifest.push({ src: `/gallery/${outName}`, source: name, width: result.info.width, height: result.info.height });

      const note = result.data.length > maxBytes ? " ⚠ 300KB-аас том хэвээр" : "";
      console.log(`✓ ${name} → ${outName}  ${kb(result.data.length)} (quality ${quality}, ${result.info.width}×${result.info.height})${note}`);
    } catch (error) {
      failed += 1;
      console.error(`✗ ${name}: ${error instanceof Error ? error.message : error}`);
    }
  }

  // Gallery хэсэг энэ жагсаалтаас зургуудаа уншина (edge runtime дээр fs ашиглах боломжгүй).
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\n${manifest.length} зураг public/gallery-д хадгалагдлаа${failed ? `, ${failed} алдаатай` : ""}.`);
  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
