import * as vscode from "vscode";

type CockpitAction = "status" | "doctor" | "start" | "stop" | "restart" | "logs";

interface CockpitCommand {
  readonly action: CockpitAction;
  readonly command: string;
  readonly title: string;
  readonly description: string;
}

const cockpitCommands: readonly CockpitCommand[] = [
  {
    action: "status",
    command: "wpmooOdoo.status",
    title: "Status",
    description: "Inspect the current WPMoo Odoo environment status."
  },
  {
    action: "doctor",
    command: "wpmooOdoo.doctor",
    title: "Doctor",
    description: "Run deeper diagnostics for Docker, metadata, and tooling."
  },
  {
    action: "start",
    command: "wpmooOdoo.start",
    title: "Start",
    description: "Start local Odoo services."
  },
  {
    action: "stop",
    command: "wpmooOdoo.stop",
    title: "Stop",
    description: "Stop local Odoo services."
  },
  {
    action: "restart",
    command: "wpmooOdoo.restart",
    title: "Restart",
    description: "Restart local Odoo services."
  },
  {
    action: "logs",
    command: "wpmooOdoo.logs",
    title: "Logs",
    description: "Open service logs in a VS Code terminal."
  }
];

export function activate(context: vscode.ExtensionContext): void {
  const provider = new CockpitViewProvider();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(CockpitViewProvider.viewType, provider),
    vscode.commands.registerCommand("wpmooOdoo.openCockpit", async () => {
      await vscode.commands.executeCommand("workbench.view.extension.wpmooOdoo");
    }),
    vscode.commands.registerCommand("wpmooOdoo.refresh", () => provider.refresh())
  );

  for (const cockpitCommand of cockpitCommands) {
    context.subscriptions.push(
      vscode.commands.registerCommand(cockpitCommand.command, async () => {
        await vscode.window.showInformationMessage(
          `${cockpitCommand.title} is registered. Command execution will be implemented in the service cockpit MVP.`
        );
      })
    );
  }
}

export function deactivate(): void {
  // No teardown is needed for the scaffold.
}

class CockpitViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "wpmooOdoo.cockpit";

  private view?: vscode.WebviewView;

  public resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true
    };

    webviewView.webview.html = this.render(webviewView.webview);
    webviewView.webview.onDidReceiveMessage(async (message: unknown) => {
      if (!isCockpitMessage(message)) {
        return;
      }

      const command = cockpitCommands.find((item) => item.action === message.action);
      if (!command) {
        return;
      }

      await vscode.commands.executeCommand(command.command);
    });
  }

  public refresh(): void {
    if (!this.view) {
      return;
    }

    this.view.webview.html = this.render(this.view.webview);
  }

  private render(webview: vscode.Webview): string {
    const nonce = getNonce();
    const buttons = cockpitCommands
      .map(
        (command) => `
          <button class="action" data-action="${command.action}">
            <span class="action-title">${escapeHtml(command.title)}</span>
            <span class="action-description">${escapeHtml(command.description)}</span>
          </button>
        `
      )
      .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WPMoo Odoo</title>
  <style>
    :root {
      color-scheme: light dark;
    }

    body {
      margin: 0;
      padding: 16px;
      color: var(--vscode-foreground);
      background: var(--vscode-sideBar-background);
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
    }

    h1 {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 600;
    }

    p {
      margin: 0 0 16px;
      color: var(--vscode-descriptionForeground);
      line-height: 1.45;
    }

    .actions {
      display: grid;
      gap: 8px;
    }

    .action {
      width: 100%;
      min-height: 64px;
      padding: 10px 12px;
      border: 1px solid var(--vscode-button-border, transparent);
      border-radius: 6px;
      color: var(--vscode-button-foreground);
      background: var(--vscode-button-background);
      text-align: left;
      cursor: pointer;
    }

    .action:hover {
      background: var(--vscode-button-hoverBackground);
    }

    .action-title {
      display: block;
      margin-bottom: 4px;
      font-weight: 600;
    }

    .action-description {
      display: block;
      color: var(--vscode-button-secondaryForeground, var(--vscode-button-foreground));
      font-size: 12px;
      line-height: 1.35;
    }
  </style>
</head>
<body>
  <h1>WPMoo Odoo</h1>
  <p>Service cockpit scaffold for existing WPMoo Odoo environments.</p>
  <div class="actions">
    ${buttons}
  </div>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    document.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        vscode.postMessage({ action: button.dataset.action });
      });
    });
  </script>
</body>
</html>`;
  }
}

function isCockpitMessage(message: unknown): message is { action: CockpitAction } {
  if (!message || typeof message !== "object" || !("action" in message)) {
    return false;
  }

  const action = (message as { action: unknown }).action;
  return cockpitCommands.some((command) => command.action === action);
}

function getNonce(): string {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";

  for (let index = 0; index < 32; index += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
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
