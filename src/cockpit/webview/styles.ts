export const cockpitStyles = `
:root {
  color-scheme: light dark;
}

body {
  margin: 0;
  color: var(--vscode-foreground);
  background: var(--vscode-editor-background);
  font-family: var(--vscode-font-family);
  font-size: var(--vscode-font-size);
}

button {
  font-family: inherit;
  font-size: inherit;
}

.app {
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  color: var(--vscode-sideBarTitle-foreground);
  background: var(--vscode-sideBar-background);
  border-bottom: 1px solid var(--vscode-sideBar-border);
  box-sizing: border-box;
}

.app-title {
  margin: 0;
  overflow: hidden;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.settings-shell {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  min-height: calc(100vh - 34px);
}

.section-tabs {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
  padding: 8px 5px;
  background: var(--vscode-sideBar-background);
  border-right: 1px solid var(--vscode-sideBar-border);
  box-sizing: border-box;
}

.section-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  color: var(--vscode-icon-foreground);
  background: var(--vscode-sideBar-background);
  border: 1px solid var(--vscode-sideBar-background);
  border-radius: 4px;
  cursor: pointer;
}

.section-tab .codicon {
  font-size: 17px;
}

.section-tab:hover {
  color: var(--vscode-list-hoverForeground);
  background: var(--vscode-list-hoverBackground);
}

.section-tab:focus-visible {
  outline: 1px solid var(--vscode-focusBorder);
  outline-offset: -1px;
}

.section-tab[aria-selected="true"] {
  color: var(--vscode-list-activeSelectionForeground);
  background: var(--vscode-list-activeSelectionBackground);
  border-color: var(--vscode-list-focusOutline);
}

.section-tab-label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.content {
  min-width: 0;
  padding: 14px 16px 22px;
  box-sizing: border-box;
}

.main-heading {
  margin: 0 0 14px;
  color: var(--vscode-foreground);
  font-size: 19px;
  font-weight: 600;
  line-height: 1.25;
}

.section-panel[hidden] {
  display: none;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.section-heading-copy {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
}

.section-heading h2 {
  margin: 0;
  color: var(--vscode-foreground);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
}

.section-description {
  max-width: 720px;
  margin: 0 0 12px;
  color: var(--vscode-descriptionForeground);
  line-height: 1.45;
}

.settings-rows {
  display: grid;
  max-width: 820px;
  border-top: 1px solid var(--vscode-panel-border);
}

.cockpit-dashboard {
  display: grid;
  max-width: 820px;
  gap: 12px;
  margin-bottom: 12px;
}

.environment-gate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  background: var(--vscode-inputValidation-warningBackground);
  border: 1px solid var(--vscode-inputValidation-warningBorder);
  border-radius: 4px;
  box-sizing: border-box;
}

.environment-gate-copy {
  display: grid;
  min-width: 0;
  gap: 3px;
}

.environment-gate-title {
  margin: 0;
  color: var(--vscode-foreground);
  font-weight: 600;
  line-height: 1.35;
}

.environment-gate-description {
  margin: 0;
  color: var(--vscode-descriptionForeground);
  line-height: 1.45;
}

.cockpit-control-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 0 10px;
  border-top: 1px solid var(--vscode-panel-border);
  border-bottom: 1px solid var(--vscode-panel-border);
}

.cockpit-status {
  display: flex;
  min-width: 0;
  align-items: center;
}

.cockpit-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.compact-action {
  min-width: 0;
}

.compact-action[disabled] {
  cursor: not-allowed;
}

.dashboard-block {
  display: grid;
  gap: 7px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vscode-panel-border);
}

.dashboard-block-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.dashboard-block-heading h3 {
  margin: 0;
  color: var(--vscode-foreground);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
}

.service-list {
  display: grid;
  gap: 1px;
  border: 1px solid var(--vscode-panel-border);
  border-radius: 4px;
  overflow: hidden;
}

.service-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 8px;
  background: var(--vscode-sideBar-background);
}

.service-row + .service-row {
  border-top: 1px solid var(--vscode-panel-border);
}

.service-main {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
}

.service-name {
  overflow: hidden;
  color: var(--vscode-foreground);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-detail {
  overflow: hidden;
  color: var(--vscode-descriptionForeground);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 18px;
  padding: 0 7px;
  color: var(--vscode-badge-foreground);
  background: var(--vscode-badge-background);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  white-space: nowrap;
}

.status-pill.is-running {
  color: var(--vscode-editor-background);
  background: var(--vscode-charts-green);
}

.status-pill.is-stopped,
.status-pill.is-unknown {
  color: var(--vscode-badge-foreground);
  background: var(--vscode-badge-background);
}

.status-pill.is-warning {
  color: var(--vscode-editor-background);
  background: var(--vscode-charts-yellow);
}

.command-preview.is-compact {
  max-height: 84px;
}

.log-preview {
  max-height: 132px;
  margin: 0;
  padding: 7px 8px;
  overflow: auto;
  color: var(--vscode-terminal-foreground);
  background: var(--vscode-terminal-background);
  border: 1px solid var(--vscode-panel-border);
  border-radius: 4px;
  box-sizing: border-box;
  font-family: var(--vscode-editor-font-family);
  font-size: var(--vscode-editor-font-size);
  line-height: 1.45;
  white-space: pre-wrap;
}

.settings-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
  align-items: start;
  padding: 11px 0;
  border-bottom: 1px solid var(--vscode-panel-border);
}

.settings-row.is-risky {
  border-left: 2px solid var(--vscode-inputValidation-warningBorder);
  padding-left: 10px;
}

.settings-row.is-planned,
.settings-row.is-preview-disabled {
  opacity: 0.86;
}

.row-title-line {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.row-title {
  min-width: 0;
  margin: 0;
  color: var(--vscode-foreground);
  font-weight: 600;
  line-height: 1.35;
}

.row-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.row-description {
  margin: 0;
  color: var(--vscode-descriptionForeground);
  line-height: 1.45;
}

.row-control {
  min-width: 0;
}

.control-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
}

.control-field {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.control-field.is-half {
  grid-column: 1 / -1;
}

.control-field:not(.is-half) {
  grid-column: 1 / -1;
}

.control-field vscode-label {
  color: var(--vscode-foreground);
  font-weight: 600;
}

.row-control vscode-textfield,
.row-control vscode-single-select,
.row-control vscode-checkbox {
  width: 100%;
}

.command-preview-card {
  display: grid;
  gap: 5px;
  margin-top: 10px;
}

.control-grid + .command-preview-card,
.command-preview-card:first-child {
  margin-top: 0;
}

.command-preview-label {
  color: var(--vscode-descriptionForeground);
  font-size: 11px;
  line-height: 1.4;
  text-transform: uppercase;
}

.command-line {
  display: flex;
  align-items: stretch;
  gap: 8px;
  min-width: 0;
}

.command-field {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
}

.command-preview {
  width: 100%;
  font-family: var(--vscode-editor-font-family);
  font-size: var(--vscode-editor-font-size);
}

.command-copy-button,
.command-run-button {
  color: var(--vscode-icon-foreground);
  flex: 0 0 auto;
}

.command-preview-card.is-disabled .command-preview {
  color: var(--vscode-disabledForeground);
}

.command-run-button[aria-disabled="true"],
.command-preview-card.is-disabled .command-run-button {
  opacity: 0.5;
  pointer-events: none;
}

.preview-description {
  margin: 6px 0 0;
  color: var(--vscode-descriptionForeground);
  line-height: 1.4;
}

.row-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

@media (max-width: 560px) {
  .content {
    padding: 12px 12px 20px;
  }

  .cockpit-control-bar,
  .dashboard-block-heading,
  .environment-gate,
  .service-row {
    align-items: stretch;
    flex-direction: column;
  }

  .cockpit-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .service-main {
    justify-content: space-between;
  }

  .command-line,
  .row-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
`;
