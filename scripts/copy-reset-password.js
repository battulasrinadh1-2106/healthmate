import fs from "fs";
import path from "path";

const distDir = path.resolve("dist");
const source = path.join(distDir, "index.html");
const targetDir = path.join(distDir, "reset-password");
const target = path.join(targetDir, "index.html");

if (!fs.existsSync(source)) {
  throw new Error("dist/index.html was not found. Run vite build before copying reset-password route.");
}

fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(source, target);
