# WPMoo Tool for VS Code

WPMoo Tool is a VS Code service cockpit for existing
[`@wpmoo/odoo`](https://www.npmjs.com/package/@wpmoo/odoo) environments.

The extension is intended to provide a GUI wrapper around the daily WPMoo Tool
workflow for Odoo development: service control, logs, diagnostics, module
actions, database snapshots, and recovery commands.

WPMoo Tool is an independent project and is not affiliated with, endorsed by,
or sponsored by Odoo S.A. Odoo is a trademark of Odoo S.A.

## MVP Scope

This repository starts with the service cockpit extension shell:

- Activity Bar entry for WPMoo Tool.
- Cockpit webview built with `@vscode-elements/elements` web components.
- Placeholder commands for `status`, `doctor`, `start`, `stop`, `restart`, and
  `logs`.

Command execution, workspace detection, and richer status rendering will be added
after the scaffold is stable.

## Webview UI

The extension uses `@vscode-elements/elements` for native-looking VS Code
webview controls. Microsoft archived the original
`@vscode/webview-ui-toolkit`, so this project uses a maintained web component
library instead of hand-rolling controls.

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
