import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const backendRoot = process.cwd();
const projectRoot = path.resolve(backendRoot, "..");

const frontendPath = path.join(projectRoot, "Frontend");
const distPath = path.join(frontendPath, "dist");
const backendPublicPath = path.join(backendRoot, "public");

console.log("Build frontend (Vite)...");
execSync("npm run build", {
  cwd: frontendPath,
  stdio: "inherit",
  shell: true
});

console.log("Clean Backend/public...");
fs.rmSync(backendPublicPath, { recursive: true, force: true });

console.log("Copy Frontend/dist → Backend/public...");
fs.cpSync(distPath, backendPublicPath, { recursive: true });

console.log("Deploy frontend completed");