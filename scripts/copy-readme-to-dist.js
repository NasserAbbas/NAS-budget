/**
 * Copy README next to the installer under dist/ (after electron-builder).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const distDir = path.join(root, "dist");
const src = path.join(root, "README.md");
const dest = path.join(distDir, "README.md");

if (!fs.existsSync(distDir)) {
  console.warn("dist/ not found — run electron-builder first. Skipping README copy.");
  process.exit(0);
}

fs.copyFileSync(src, dest);
console.log("Copied README.md to dist/");
