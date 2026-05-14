import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = resolve(root, "node_modules/@vscode-elements/elements/dist/bundled.js");
const target = resolve(root, "media/vscode-elements.js");

await mkdir(dirname(target), { recursive: true });
await copyFile(source, target);
