import assert from "node:assert/strict";
import { test } from "node:test";

import { renderCockpitHtml } from "../dist/cockpit/webview/renderHtml.js";
import { cockpitSections } from "../dist/cockpit/webview/sections/index.js";

const fakeUri = {
  toString() {
    return "vscode-resource://asset";
  }
};

const fakeWebview = {
  cspSource: "vscode-resource:",
  asWebviewUri(uri) {
    return uri;
  }
};

test("renders Cockpit as the default compact dashboard", () => {
  const html = renderCockpitHtml({
    codiconsCssUri: fakeUri,
    componentScriptUri: fakeUri,
    nonce: "test-nonce",
    sections: cockpitSections,
    webview: fakeWebview
  });

  assert.match(html, /<h1 class="main-heading">Cockpit<\/h1>/);
  assert.match(html, /class="cockpit-control-bar"/);
  assert.match(html, /Status: Running/);
  assert.match(html, /class="compact-action[^"]*"[^>]*>Start<\/vscode-button>/);
  assert.match(html, /class="compact-action[^"]*"[^>]*>Stop<\/vscode-button>/);
  assert.match(html, /class="compact-action[^"]*"[^>]*>Restart<\/vscode-button>/);
  assert.match(html, /class="compact-action[^"]*"[^>]*>Logs<\/vscode-button>/);
  assert.match(html, /class="compact-action[^"]*"[^>]*>Doctor<\/vscode-button>/);
  assert.match(html, /data-run-command="start"/);
  assert.match(html, /data-run-command="logs"/);
  assert.match(html, /Odoo Web/);
  assert.match(html, /Recent logs/);
});
