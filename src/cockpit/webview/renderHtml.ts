import type * as vscode from "vscode";

import { cockpitClientScript } from "./clientScript";
import { buildCommandPreview } from "./commandPreview.js";
import { cockpitStyles } from "./styles";
import type {
  CockpitDashboardAction,
  CockpitDashboardDefinition,
  CockpitDashboardService,
  CommandPreview,
  ControlDefinition,
  EnvironmentGate,
  SectionDefinition,
  SettingsRowDefinition
} from "./types";

export interface RenderCockpitHtmlOptions {
  readonly codiconsCssUri: vscode.Uri;
  readonly componentScriptUri: vscode.Uri;
  readonly environmentGate?: EnvironmentGate;
  readonly nonce: string;
  readonly sections: readonly SectionDefinition[];
  readonly webview: vscode.Webview;
}

const defaultEnvironmentGate: EnvironmentGate = {
  ready: true,
  statusLabel: "Status: Running",
  message: "A WPMoo environment is active in this workspace.",
  setupSectionId: "environment-setup"
};

export function renderCockpitHtml(options: RenderCockpitHtmlOptions): string {
  const firstSection = options.sections[0];
  const firstSectionId = firstSection?.id;
  const environmentGate = options.environmentGate ?? defaultEnvironmentGate;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${options.webview.cspSource}; font-src ${options.webview.cspSource}; style-src ${options.webview.cspSource} 'unsafe-inline'; script-src ${options.webview.cspSource} 'nonce-${options.nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WPMoo: Odoo Settings</title>
  <link id="vscode-codicon-stylesheet" rel="stylesheet" nonce="${options.nonce}" href="${options.codiconsCssUri.toString()}">
  <script type="module" nonce="${options.nonce}" src="${options.componentScriptUri.toString()}"></script>
  <style>${cockpitStyles}</style>
</head>
<body>
  <div class="app">
    <header class="app-header">
      <p class="app-title">WPMoo: Odoo Settings</p>
    </header>
    <div class="settings-shell">
      <nav class="section-tabs" role="tablist" aria-label="Settings sections">
        ${options.sections.map((section) => renderSectionTab(section, section.id === firstSectionId)).join("")}
      </nav>
      <main class="content">
        <h1 class="main-heading">${firstSection ? escapeHtml(firstSection.title) : "Settings"}</h1>
        ${options.sections.map((section) => renderSectionPanel(section, section.id !== firstSectionId, environmentGate)).join("")}
      </main>
    </div>
  </div>
  <script nonce="${options.nonce}">${cockpitClientScript}</script>
</body>
</html>`;
}

function renderSectionTab(section: SectionDefinition, selected: boolean): string {
  const sectionId = escapeAttribute(section.id);
  const label = escapeAttribute(section.title);

  return `<button class="section-tab" id="tab-${sectionId}" type="button" role="tab" data-section-id="${sectionId}" aria-controls="section-${sectionId}" aria-selected="${String(selected)}" tabindex="${selected ? "0" : "-1"}" title="${label}">
    ${renderCodicon(section.icon)}
    <span class="section-tab-label">${escapeHtml(section.title)}</span>
  </button>`;
}

function renderSectionPanel(section: SectionDefinition, hidden: boolean, environmentGate: EnvironmentGate): string {
  const sectionId = escapeAttribute(section.id);
  const rows = section.rows.length
    ? `<div class="settings-rows">${section.rows.map((row) => renderSettingsRow(sectionId, row)).join("")}</div>`
    : "";

  return `<section class="section-panel" id="section-${sectionId}" role="tabpanel" data-section-id="${sectionId}" aria-labelledby="tab-${sectionId}"${hidden ? " hidden" : ""}>
    <div class="section-heading">
      <div class="section-heading-copy">
        ${renderCodicon(section.icon)}
        <h2>${escapeHtml(section.heading ?? section.title)}</h2>
      </div>
      <vscode-badge>Preview shell</vscode-badge>
    </div>
    ${section.description ? `<p class="section-description">${escapeHtml(section.description)}</p>` : ""}
    ${section.dashboard ? renderCockpitDashboard(section.dashboard, environmentGate) : ""}
    ${rows}
  </section>`;
}

function renderCockpitDashboard(dashboard: CockpitDashboardDefinition, environmentGate: EnvironmentGate): string {
  const services = environmentGate.ready ? dashboard.services : getUnavailableServices(dashboard.services);
  const recentLogs = environmentGate.ready
    ? dashboard.recentLogs
    : ["No active environment is available. Create or select an environment before streaming logs."];

  return `<div class="cockpit-dashboard">
    ${environmentGate.ready ? "" : renderEnvironmentGate(environmentGate)}
    <section class="cockpit-control-bar" aria-label="Service controls">
      <div class="cockpit-status">
        <span class="status-pill is-${escapeAttribute(environmentGate.ready ? dashboard.status.tone : "warning")}">${escapeHtml(environmentGate.ready ? dashboard.status.label : environmentGate.statusLabel)}</span>
      </div>
      <vscode-button-group class="cockpit-actions" aria-label="Service command previews">
        ${dashboard.actions.map((action) => renderDashboardAction(action, environmentGate.ready)).join("")}
      </vscode-button-group>
    </section>
    <section class="dashboard-block" aria-label="Services">
      <div class="dashboard-block-heading">
        <h3>Services</h3>
      </div>
      <div class="service-list">
        ${services.map(renderDashboardService).join("")}
      </div>
    </section>
    <section class="dashboard-block" aria-label="Last command">
      <div class="dashboard-block-heading">
        <h3>Last command</h3>
      </div>
      ${renderCommandPreview(dashboard.lastCommand, false)}
    </section>
    <section class="dashboard-block" aria-label="Recent logs">
      <div class="dashboard-block-heading">
        <h3>Recent logs</h3>
      </div>
      <pre class="log-preview">${recentLogs.map(escapeHtml).join("\n")}</pre>
    </section>
  </div>`;
}

function renderEnvironmentGate(environmentGate: EnvironmentGate): string {
  return `<section class="environment-gate" aria-label="Environment required">
    <div class="environment-gate-copy">
      <p class="environment-gate-title">No active environment</p>
      <p class="environment-gate-description">${escapeHtml(environmentGate.message)}</p>
    </div>
    <vscode-button data-section-target="${escapeAttribute(environmentGate.setupSectionId)}">Open setup section</vscode-button>
  </section>`;
}

function renderDashboardAction(action: CockpitDashboardAction, enabled: boolean): string {
  const runAttribute = enabled ? ` data-run-command="${escapeAttribute(action.id)}"` : "";
  const disabledAttribute = enabled ? "" : " disabled";

  return `<vscode-button class="compact-action${action.primary ? " is-primary" : ""}"${action.primary ? "" : " secondary"}${disabledAttribute}${runAttribute} title="${escapeAttribute(buildCommandPreview(action.commandPreview.argv))}">${escapeHtml(action.label)}</vscode-button>`;
}

function renderDashboardService(service: CockpitDashboardService): string {
  return `<div class="service-row">
    <div class="service-main">
      <span class="service-name">${escapeHtml(service.name)}</span>
      <span class="status-pill is-${escapeAttribute(service.tone)}">${escapeHtml(service.status)}</span>
    </div>
    <span class="service-detail">${escapeHtml(service.detail)}</span>
  </div>`;
}

function getUnavailableServices(services: readonly CockpitDashboardService[]): CockpitDashboardService[] {
  return services.map((service) => ({
    ...service,
    status: "Unavailable",
    detail: "environment required",
    tone: "unknown"
  }));
}

function renderSettingsRow(sectionId: string, row: SettingsRowDefinition): string {
  const rowId = `${sectionId}-${escapeAttribute(row.id)}`;
  const rowClasses = [
    "settings-row",
    row.tone ? `is-${row.tone}` : "",
    row.previewDisabled ? "is-preview-disabled" : ""
  ].filter(Boolean).join(" ");
  const rowDescription = row.description ? `<p class="row-description">${escapeHtml(row.description)}</p>` : "";
  const controls = row.controls?.length ? `<div class="control-grid">${row.controls.map(renderControl).join("")}</div>` : "";
  const preview = row.commandPreview ? renderCommandPreview(row.commandPreview, Boolean(row.previewDisabled), row.action) : "";
  const action = row.commandPreview ? "" : row.action ? renderRowAction(row.action) : "";

  return `<article class="${rowClasses}" id="${rowId}">
    <div class="row-copy">
      <div class="row-title-line">
        <p class="row-title">${escapeHtml(row.title)}</p>
        ${renderBadges(row.badges)}
      </div>
      ${rowDescription}
    </div>
    <div class="row-control">
      ${controls}
      ${preview}
      ${action}
    </div>
  </article>`;
}

function renderCodicon(icon: string): string {
  return `<span class="codicon codicon-${escapeAttribute(icon)}" aria-hidden="true"></span>`;
}

function renderControl(control: ControlDefinition): string {
  switch (control.type) {
    case "textfield":
      return renderControlField(
        control,
        `<vscode-textfield value="${escapeAttribute(control.value)}"${control.placeholder ? ` placeholder="${escapeAttribute(control.placeholder)}"` : ""}${control.readonly ? " readonly" : ""}${control.disabled ? " disabled" : ""}${renderCommandFieldAttribute(control.commandField)}></vscode-textfield>`
      );
    case "checkbox":
      return renderControlField(
        control,
        `<vscode-checkbox${control.checked ? " checked" : ""}${control.disabled ? " disabled" : ""}${renderCommandFieldAttribute(control.commandField)}>${escapeHtml(control.label)}</vscode-checkbox>`
      );
    case "select":
      return renderControlField(
        control,
        `<vscode-single-select value="${escapeAttribute(control.value)}"${control.disabled ? " disabled" : ""}${renderCommandFieldAttribute(control.commandField)}>
        ${control.options.map((option) => `<vscode-option value="${escapeAttribute(option.value)}"${option.value === control.value ? " selected" : ""}>${escapeHtml(option.label)}</vscode-option>`).join("")}
      </vscode-single-select>`
      );
    case "button":
      return `<vscode-button${control.secondary === false ? "" : " secondary"}${control.disabled ? " disabled" : ""}${control.icon ? ` icon="${escapeAttribute(control.icon)}"` : ""}>${escapeHtml(control.label)}</vscode-button>`;
    case "commandPreview":
      return renderCommandPreview(control.preview, false);
  }
}

function renderControlField(control: Extract<ControlDefinition, { readonly width?: "full" | "half" }>, html: string): string {
  const widthClass = control.width === "half" ? "control-field is-half" : "control-field";
  const label = "label" in control && control.label ? `<vscode-label>${escapeHtml(control.label)}</vscode-label>` : "";

  return `<label class="${widthClass}">
    ${label}
    ${html}
  </label>`;
}

function renderCommandFieldAttribute(commandField: string | undefined): string {
  return commandField ? ` data-command-field="${escapeAttribute(commandField)}"` : "";
}

function renderCommandPreview(
  preview: CommandPreview,
  disabled: boolean,
  action?: SettingsRowDefinition["action"]
): string {
  const command = buildCommandPreview(preview.argv);
  const previewId = preview.id ? escapeAttribute(preview.id) : "";
  const dynamicAttribute = preview.dynamic ? ` data-command-dynamic="${escapeAttribute(preview.dynamic)}"` : "";
  const idAttribute = previewId ? ` data-command-output="${previewId}"` : "";
  const copyAttribute = previewId
    ? ` data-copy-command="${previewId}"`
    : ` data-copy-inline="${escapeAttribute(command)}"`;

  return `<div class="command-preview-card${disabled ? " is-disabled" : ""}"${dynamicAttribute}>
    <div class="command-preview-label">Command preview</div>
    <div class="command-line">
      <div class="command-field${action ? " has-run-action" : ""}">
        <input class="command-preview" type="text" value="${escapeAttribute(command)}" readonly aria-label="Command preview"${idAttribute} data-command-value="${escapeAttribute(command)}">
        <div class="command-actions" aria-label="Command actions">
          <button class="command-icon-button command-copy-button" type="button" aria-label="Copy command" title="Copy command"${copyAttribute}>
            ${renderCodicon("copy")}
          </button>
          ${action ? renderInlineRowAction(action, preview, command) : ""}
        </div>
      </div>
    </div>
    ${preview.description ? `<p class="preview-description">${escapeHtml(preview.description)}</p>` : ""}
  </div>`;
}

function renderInlineRowAction(
  action: NonNullable<SettingsRowDefinition["action"]>,
  preview: CommandPreview,
  command: string
): string {
  const disabledAttribute = action.disabled ? ` disabled aria-disabled="true"` : "";
  const runAttribute = action.disabled
    ? ""
    : preview.id
      ? ` data-run-preview-command="${escapeAttribute(preview.id)}"`
      : ` data-run-inline-command="${escapeAttribute(command)}"`;
  const label = escapeAttribute(action.label);

  return `<button class="command-icon-button command-run-button" type="button" aria-label="${label}" title="${label}"${disabledAttribute}${runAttribute}>
    ${renderCodicon("debug-start")}
  </button>`;
}

function renderRowAction(action: NonNullable<SettingsRowDefinition["action"]>): string {
  return `<div class="row-actions">
    <vscode-button${action.disabled ? " disabled" : ""}>${escapeHtml(action.label)}</vscode-button>
  </div>`;
}

function renderBadges(badges: readonly string[] | undefined): string {
  if (!badges?.length) {
    return "";
  }

  return `<span class="row-badges">${badges.map((badge) => `<vscode-badge>${escapeHtml(badge)}</vscode-badge>`).join("")}</span>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}
