# WPMoo Odoo for VS Code

WPMoo Odoo is a VS Code service cockpit for existing
[`@wpmoo/odoo`](https://www.npmjs.com/package/@wpmoo/odoo) environments.

The extension is intended to provide a GUI wrapper around the daily WPMoo Odoo
workflow: service control, logs, diagnostics, module actions, database snapshots,
and recovery commands.

## MVP Scope

This repository starts with the service cockpit extension shell:

- Activity Bar entry for WPMoo Odoo.
- Cockpit webview with quick action buttons.
- Placeholder commands for `status`, `doctor`, `start`, `stop`, `restart`, and
  `logs`.

Command execution, workspace detection, and richer status rendering will be added
after the scaffold is stable.

## Development

Install dependencies:

```bash
npm install
```

Compile the extension:

```bash
npm run compile
```

Watch TypeScript during development:

```bash
npm run watch
```

Package a local VSIX after `@vscode/vsce` is installed:

```bash
npm run package
```

## Relationship To `@wpmoo/odoo`

This extension lives in a separate repository from the CLI package. The first MVP
will call the existing CLI commands through VS Code terminals. A later version can
use structured JSON output or a public API from `@wpmoo/odoo` for richer GUI
state.
