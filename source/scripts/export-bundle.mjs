import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const viteOutput = resolve(sourceRoot, "dist", "public");
const repositoryDist = resolve(sourceRoot, "..", "dist");

const html = await readFile(resolve(viteOutput, "index.html"), "utf8");
const scriptSources = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi)]
  .map((match) => match[1])
  .filter((value) => value.startsWith("/assets/"));
const styleSources = [...html.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi)]
  .map((match) => match[1])
  .filter((value) => value.startsWith("/assets/"));

if (scriptSources.length !== 1 || styleSources.length !== 1) {
  throw new Error(
    `Expected one built JS and one built CSS asset; found JS=${scriptSources.length}, CSS=${styleSources.length}`,
  );
}

function localAssetPath(publicPath) {
  if (publicPath.includes("..") || !publicPath.startsWith("/assets/")) {
    throw new Error(`Unsafe build asset path: ${publicPath}`);
  }
  return resolve(viteOutput, publicPath.slice(1));
}

await mkdir(repositoryDist, { recursive: true });
await copyFile(localAssetPath(scriptSources[0]), resolve(repositoryDist, "bundle.js"));
await copyFile(localAssetPath(styleSources[0]), resolve(repositoryDist, "bundle.css"));

console.log(`Exported ${scriptSources[0]} -> dist/bundle.js`);
console.log(`Exported ${styleSources[0]} -> dist/bundle.css`);
