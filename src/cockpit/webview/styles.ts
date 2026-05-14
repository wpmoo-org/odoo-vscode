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
  grid-template-columns: 44px minmax(0, 1fr);
  min-height: calc(100vh - 34px);
}

.section-tabs {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
  padding: 8px 4px;
  background: var(--vscode-sideBar-background);
  border-right: 1px solid var(--vscode-sideBar-border);
  box-sizing: border-box;
}

.section-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  color: var(--vscode-icon-foreground);
  background: var(--vscode-sideBar-background);
  border: 1px solid var(--vscode-sideBar-background);
  border-radius: 4px;
  cursor: pointer;
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
  padding: 18px 20px 28px;
  box-sizing: border-box;
}

.main-heading {
  margin: 0 0 18px;
  color: var(--vscode-foreground);
  font-size: 22px;
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
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
}

.section-description {
  max-width: 720px;
  margin: 0 0 14px;
  color: var(--vscode-descriptionForeground);
  line-height: 1.45;
}

.settings-rows {
  display: grid;
  max-width: 820px;
  border-top: 1px solid var(--vscode-panel-border);
}

.settings-row {
  display: grid;
  grid-template-columns: minmax(180px, 0.86fr) minmax(260px, 1.14fr);
  gap: 18px;
  align-items: start;
  padding: 13px 0;
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 12px;
}

.control-field {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.control-field.is-half {
  grid-column: auto;
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
  gap: 6px;
  margin-top: 10px;
}

.control-grid + .command-preview-card,
.command-preview-card:first-child {
  margin-top: 0;
}

.command-preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--vscode-descriptionForeground);
  font-size: 11px;
  line-height: 1.4;
  text-transform: uppercase;
}

.command-preview {
  display: block;
  padding: 7px 8px;
  overflow-x: hidden;
  overflow-wrap: anywhere;
  color: var(--vscode-textPreformat-foreground);
  background: var(--vscode-textCodeBlock-background);
  border: 1px solid var(--vscode-panel-border);
  border-radius: 4px;
  box-sizing: border-box;
  font-family: var(--vscode-editor-font-family);
  font-size: var(--vscode-editor-font-size);
  line-height: 1.45;
  white-space: pre-wrap;
}

.command-preview-card.is-disabled .command-preview {
  color: var(--vscode-disabledForeground);
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
  .settings-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }

  .content {
    padding: 16px 14px 24px;
  }

  .control-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .control-field.is-half {
    grid-column: 1 / -1;
  }

  .command-preview-toolbar,
  .row-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
`;
