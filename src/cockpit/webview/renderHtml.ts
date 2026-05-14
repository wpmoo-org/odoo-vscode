import type * as vscode from "vscode";

import { cockpitClientScript } from "./clientScript";
import { buildCommandPreview } from "./commandPreview.js";
import { cockpitStyles } from "./styles";
import type { CommandPreview, ControlDefinition, SectionDefinition, SettingsRowDefinition } from "./types";

export interface RenderCockpitHtmlOptions {
  readonly componentScriptUri: vscode.Uri;
  readonly nonce: string;
  readonly sections: readonly SectionDefinition[];
  readonly webview: vscode.Webview;
}

export function renderCockpitHtml(options: RenderCockpitHtmlOptions): string {
  const firstSectionId = options.sections[0]?.id;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${options.webview.cspSource}; style-src ${options.webview.cspSource} 'unsafe-inline'; script-src ${options.webview.cspSource} 'nonce-${options.nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WPMoo: Odoo Settings</title>
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
        <h1 class="main-heading">Settings</h1>
        ${options.sections.map((section) => renderSectionPanel(section, section.id !== firstSectionId)).join("")}
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
    <vscode-icon name="${escapeAttribute(section.icon)}" aria-hidden="true"></vscode-icon>
    <span class="section-tab-label">${escapeHtml(section.title)}</span>
  </button>`;
}

function renderSectionPanel(section: SectionDefinition, hidden: boolean): string {
  const sectionId = escapeAttribute(section.id);

  return `<section class="section-panel" id="section-${sectionId}" role="tabpanel" data-section-id="${sectionId}" aria-labelledby="tab-${sectionId}"${hidden ? " hidden" : ""}>
    <div class="section-heading">
      <div class="section-heading-copy">
        <vscode-icon name="${escapeAttribute(section.icon)}" aria-hidden="true"></vscode-icon>
        <h2>${escapeHtml(section.title)}</h2>
      </div>
      <vscode-badge>Preview shell</vscode-badge>
    </div>
    ${section.description ? `<p class="section-description">${escapeHtml(section.description)}</p>` : ""}
    <div class="settings-rows">
      ${section.rows.map((row) => renderSettingsRow(sectionId, row)).join("")}
    </div>
  </section>`;
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
  const preview = row.commandPreview ? renderCommandPreview(row.commandPreview, Boolean(row.previewDisabled)) : "";
  const action = row.action ? renderRowAction(row.action) : "";

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

function renderCommandPreview(preview: CommandPreview, disabled: boolean): string {
  const command = buildCommandPreview(preview.argv);
  const previewId = preview.id ? escapeAttribute(preview.id) : "";
  const dynamicAttribute = preview.dynamic ? ` data-command-dynamic="${escapeAttribute(preview.dynamic)}"` : "";
  const idAttribute = previewId ? ` data-command-output="${previewId}"` : "";
  const copyAttribute = previewId
    ? ` data-copy-command="${previewId}"`
    : ` data-copy-inline="${escapeAttribute(command)}"`;

  return `<div class="command-preview-card${disabled ? " is-disabled" : ""}"${dynamicAttribute}>
    <div class="command-preview-toolbar">
      <span>Command preview</span>
      <vscode-button secondary${copyAttribute}>Copy command</vscode-button>
    </div>
    <code class="command-preview"${idAttribute} data-command-value="${escapeAttribute(command)}">${escapeHtml(command)}</code>
    ${preview.description ? `<p class="preview-description">${escapeHtml(preview.description)}</p>` : ""}
  </div>`;
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
