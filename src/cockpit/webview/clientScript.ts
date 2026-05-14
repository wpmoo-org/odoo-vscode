export const cockpitClientScript = `
const tabs = Array.from(document.querySelectorAll('[role="tab"][data-section-id]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"][data-section-id]'));
const mainHeading = document.querySelector(".main-heading");

function selectSection(sectionId, options = {}) {
  for (const tab of tabs) {
    const isSelected = tab.dataset.sectionId === sectionId;
    tab.setAttribute("aria-selected", String(isSelected));
    tab.setAttribute("tabindex", isSelected ? "0" : "-1");

    if (isSelected && mainHeading) {
      const label = tab.querySelector(".section-tab-label")?.textContent?.trim();
      if (label) {
        mainHeading.textContent = label;
      }
    }

    if (isSelected && options.focus) {
      tab.focus();
    }
  }

  for (const panel of panels) {
    panel.hidden = panel.dataset.sectionId !== sectionId;
  }
}

function moveSelection(currentTab, offset) {
  const currentIndex = tabs.indexOf(currentTab);
  if (currentIndex < 0) {
    return;
  }

  const nextIndex = (currentIndex + offset + tabs.length) % tabs.length;
  selectSection(tabs[nextIndex].dataset.sectionId, { focus: true });
}

for (const tab of tabs) {
  tab.addEventListener("click", () => {
    selectSection(tab.dataset.sectionId);
  });

  tab.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      moveSelection(tab, 1);
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      moveSelection(tab, -1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      selectSection(tabs[0].dataset.sectionId, { focus: true });
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      selectSection(tabs[tabs.length - 1].dataset.sectionId, { focus: true });
    }
  });
}

if (tabs.length > 0) {
  const selectedTab = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") ?? tabs[0];
  selectSection(selectedTab.dataset.sectionId);
}

const safeShellArgPattern = /^[A-Za-z0-9_./:@%+=,-]+$/;

function quoteCommandArg(arg) {
  if (arg.length > 0 && safeShellArgPattern.test(arg)) {
    return arg;
  }

  return "'" + arg.replaceAll("'", "'\\\\''") + "'";
}

function buildCommandPreview(argv) {
  return argv.map(quoteCommandArg).join(" ");
}

function readCommandField(name) {
  const field = document.querySelector('[data-command-field="' + name + '"]');
  if (!field) {
    return "";
  }

  if (field.tagName.toLowerCase() === "vscode-checkbox") {
    return Boolean(field.checked);
  }

  return typeof field.value === "string" ? field.value : field.getAttribute("value") ?? "";
}

function pushFlagValue(argv, flag, value) {
  const normalizedValue = String(value ?? "").trim();
  if (!normalizedValue) {
    return;
  }

  argv.push(flag, normalizedValue);
}

function buildEnvironmentCreateCommand() {
  const argv = ["npx", "@wpmoo/odoo", "create"];

  pushFlagValue(argv, "--product", readCommandField("product"));
  pushFlagValue(argv, "--odoo-version", readCommandField("odooVersion"));
  pushFlagValue(argv, "--target", readCommandField("target"));
  pushFlagValue(argv, "--dev-repo-url", readCommandField("devRepoUrl"));
  pushFlagValue(argv, "--source-repo-url", readCommandField("sourceRepoUrl"));
  pushFlagValue(argv, "--source-path", readCommandField("sourcePath"));
  pushFlagValue(argv, "--source-addons", readCommandField("sourceAddons"));
  pushFlagValue(argv, "--postgres-version", readCommandField("postgresVersion"));
  pushFlagValue(argv, "--http-port", readCommandField("httpPort"));
  pushFlagValue(argv, "--gevent-port", readCommandField("geventPort"));

  if (readCommandField("installAgentSkills")) {
    argv.push("--agent-skills-template");
  }

  if (!readCommandField("stage")) {
    argv.push("--stage=false");
  }

  return buildCommandPreview(argv);
}

function setCommandPreview(previewId, command) {
  const output = document.querySelector('[data-command-output="' + previewId + '"]');
  if (!output) {
    return;
  }

  output.textContent = command;
  output.dataset.commandValue = command;
}

function syncEnvironmentCreatePreview() {
  setCommandPreview("environment-create", buildEnvironmentCreateCommand());
}

for (const field of document.querySelectorAll("[data-command-field]")) {
  field.addEventListener("input", syncEnvironmentCreatePreview);
  field.addEventListener("change", syncEnvironmentCreatePreview);
}

syncEnvironmentCreatePreview();

for (const copyButton of document.querySelectorAll("[data-copy-command], [data-copy-inline]")) {
  copyButton.addEventListener("click", async () => {
    const commandId = copyButton.dataset.copyCommand;
    const output = commandId ? document.querySelector('[data-command-output="' + commandId + '"]') : undefined;
    const command = output?.dataset.commandValue ?? output?.textContent ?? copyButton.dataset.copyInline ?? "";

    if (!command) {
      return;
    }

    await navigator.clipboard.writeText(command);
    const previousText = copyButton.textContent;
    copyButton.textContent = "Copied";
    window.setTimeout(() => {
      copyButton.textContent = previousText || "Copy command";
    }, 1200);
  });
}
`;
