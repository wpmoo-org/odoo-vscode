import assert from "node:assert/strict";
import { test } from "node:test";

import { detectWorkspaceSignals } from "../dist/cockpit/workspaceDetection.js";

test("detects a strong workspace when compose and package markers are present", () => {
  assert.deepEqual(
    detectWorkspaceSignals(["README.md", "docker-compose.yml", "package.json"]),
    {
      detected: true,
      confidence: "strong",
      markers: ["docker-compose.yml", "package.json"]
    }
  );
});

test("detects generated WPMoo metadata as a strong workspace marker", () => {
  assert.deepEqual(detectWorkspaceSignals([".wpmoo/odoo.json"]), {
    detected: true,
    confidence: "strong",
    markers: [".wpmoo/odoo.json"]
  });
});

test("detects partial workspaces from a single known marker", () => {
  const cases = [
    ["docker-compose.yml", "docker-compose.yml"],
    ["compose.yml", "compose.yml"],
    ["package.json", "package.json"]
  ];

  for (const [fileName, marker] of cases) {
    assert.deepEqual(detectWorkspaceSignals([fileName]), {
      detected: true,
      confidence: "partial",
      markers: [marker]
    });
  }
});

test("does not detect a workspace when no known markers are present", () => {
  assert.deepEqual(detectWorkspaceSignals(["README.md", "src"]), {
    detected: false,
    confidence: "none",
    markers: []
  });
});
