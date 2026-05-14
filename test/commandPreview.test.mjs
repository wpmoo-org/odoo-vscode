import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildCommandPreview,
  buildCreateCommandPreview,
  quoteCommandArg
} from "../dist/cockpit/webview/commandPreview.js";

test("quotes shell command arguments safely", () => {
  assert.equal(quoteCommandArg("plain"), "plain");
  assert.equal(quoteCommandArg("two words"), "'two words'");
  assert.equal(quoteCommandArg("can't"), "'can'\\''t'");
});

test("builds command previews from argv arrays", () => {
  assert.equal(
    buildCommandPreview(["npx", "@wpmoo/odoo", "logs", "odoo service"]),
    "npx @wpmoo/odoo logs 'odoo service'"
  );
});

test("builds create command preview from environment setup values", () => {
  const command = buildCreateCommandPreview({
    product: "odoo_sample_module",
    odooVersion: "19.0",
    target: "./odoo_sample_module_dev",
    devRepoUrl: "https://github.com/example-org/odoo_sample_module_dev.git",
    sourceRepos: [
      {
        url: "https://github.com/example-org/odoo_sample_module.git",
        path: "odoo_sample_module",
        addons: "odoo_sample_module_base,odoo_sample_module_sale"
      }
    ],
    httpPort: "10019",
    geventPort: "20019",
    postgresVersion: "18",
    installAgentSkills: true,
    stage: false
  });

  assert.equal(
    command,
    [
      "npx",
      "@wpmoo/odoo",
      "create",
      "--product",
      "odoo_sample_module",
      "--odoo-version",
      "19.0",
      "--target",
      "./odoo_sample_module_dev",
      "--dev-repo-url",
      "https://github.com/example-org/odoo_sample_module_dev.git",
      "--source-repo-url",
      "https://github.com/example-org/odoo_sample_module.git",
      "--source-path",
      "odoo_sample_module",
      "--source-addons",
      "odoo_sample_module_base,odoo_sample_module_sale",
      "--postgres-version",
      "18",
      "--http-port",
      "10019",
      "--gevent-port",
      "20019",
      "--agent-skills-template",
      "--stage=false"
    ].join(" ")
  );
});
