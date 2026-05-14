import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const assets = [
  {
    source: resolve(root, "node_modules/@vscode-elements/elements/dist/bundled.js"),
    target: resolve(root, "media/vscode-elements.js")
  },
  {
    source: resolve(root, "node_modules/@vscode/codicons/dist/codicon.css"),
    target: resolve(root, "media/codicon.css")
  },
  {
    source: resolve(root, "node_modules/@vscode/codicons/dist/codicon.ttf"),
    target: resolve(root, "media/codicon.ttf")
  }
];

await mkdir(resolve(root, "media"), { recursive: true });

for (const asset of assets) {
  await mkdir(dirname(asset.target), { recursive: true });
  await copyFile(asset.source, asset.target);
}
