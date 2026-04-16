/**
 * Writes build/icon.png, build/icon.ico, and assets/logo.png (UI + favicon).
 * Uses the first existing source image, or a solid brand-colored PNG if none.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const pngToIco = require("png-to-ico");

const root = path.join(__dirname, "..");
const buildDir = path.join(root, "build");
const assetsDir = path.join(root, "assets");

const SOURCE_CANDIDATES = [
  path.join(root, "NAS logo.png"),
  path.join(root, "assets", "logo.png"),
  path.join(root, "assets", "app.png"),
  path.join(buildDir, "icon.png"),
];

/** PSD exports often use opaque black instead of alpha; make near-black pixels transparent for the UI header. */
async function keyOutNearBlack(pngBuffer, threshold = 34) {
  const { data, info } = await sharp(pngBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.channels !== 4) {
    return pngBuffer;
  }
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= threshold && g <= threshold && b <= threshold) {
      data[i + 3] = 0;
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

async function basePngBuffer() {
  for (const p of SOURCE_CANDIDATES) {
    if (fs.existsSync(p)) {
      const resized = await sharp(p)
        .resize(256, 256, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .ensureAlpha()
        .png()
        .toBuffer();
      return keyOutNearBlack(resized, 34);
    }
  }
  return sharp({
    create: {
      width: 256,
      height: 256,
      channels: 4,
      background: { r: 45, g: 122, b: 62, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
}

async function main() {
  fs.mkdirSync(buildDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });
  const base = await basePngBuffer();
  const pngPath = path.join(buildDir, "icon.png");
  fs.writeFileSync(pngPath, base);

  const logoPath = path.join(assetsDir, "logo.png");
  fs.writeFileSync(logoPath, base);

  const sizes = [16, 32, 48, 64, 128, 256];
  const pngBuffers = await Promise.all(
    sizes.map((s) => sharp(base).resize(s, s).png().toBuffer())
  );
  const icoBuffer = await pngToIco(pngBuffers);
  fs.writeFileSync(path.join(buildDir, "icon.ico"), icoBuffer);
  console.log("Wrote", pngPath, ",", path.join(buildDir, "icon.ico"), ",", logoPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
