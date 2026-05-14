import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildTerminalCommand,
  getCockpitTerminalCommand,
  isAllowedTerminalCommandText
} from "../dist/cockpit/terminalCommand.js";

test("builds shell-safe terminal command strings from argv arrays", () => {
  assert.equal(
    buildTerminalCommand(["npx", "@wpmoo/odoo", "logs", "odoo service"]),
    "npx @wpmoo/odoo logs 'odoo service'"
  );
});

test("resolves cockpit command ids to terminal commands", () => {
  assert.deepEqual(getCockpitTerminalCommand("start"), {
    id: "start",
    title: "Start",
    terminalName: "WPMoo Odoo",
    argv: ["npx", "@wpmoo/odoo", "start"]
  });

  assert.deepEqual(getCockpitTerminalCommand("logs")?.argv, [
    "npx",
    "@wpmoo/odoo",
    "logs",
    "odoo"
  ]);
  assert.equal(getCockpitTerminalCommand("unknown"), undefined);
});

test("allows only WPMoo Odoo command preview text", () => {
  assert.equal(isAllowedTerminalCommandText("npx @wpmoo/odoo create --product sample"), true);
  assert.equal(isAllowedTerminalCommandText(" npx @wpmoo/odoo status "), true);
  assert.equal(isAllowedTerminalCommandText("npm exec @wpmoo/odoo status"), false);
  assert.equal(isAllowedTerminalCommandText("rm -rf generated"), false);
  assert.equal(isAllowedTerminalCommandText("npx @wpmoo/odoo status\nrm -rf generated"), false);
});
