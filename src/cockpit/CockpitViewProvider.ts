import * as vscode from "vscode";

import { runCockpitTerminalCommand } from "./terminalRunner.js";
import { renderCockpitHtml } from "./webview/renderHtml";
import { cockpitSections } from "./webview/sections/index.js";

interface RunCommandMessage {
  readonly type: "runCommand";
  readonly commandId: string;
}

export class CockpitViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "wpmooOdoo.cockpit";

  private view?: vscode.WebviewView;
  private messageSubscription?: vscode.Disposable;

  public constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly runCommand: (commandId: string) => Promise<void> = runCockpitTerminalCommand
  ) {}

  public resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    this.messageSubscription?.dispose();
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, "media")]
    };

    this.messageSubscription = webviewView.webview.onDidReceiveMessage((message: unknown) => {
      if (isRunCommandMessage(message)) {
        void this.runCommand(message.commandId);
      }
    });

    webviewView.webview.html = this.render(webviewView.webview);
  }

  public refresh(): void {
    if (!this.view) {
      return;
    }

    this.view.webview.html = this.render(this.view.webview);
  }

  private render(webview: vscode.Webview): string {
    const nonce = getNonce();
    const componentScriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "vscode-elements.js")
    );
    const codiconsCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "media", "codicon.css")
    );

    return renderCockpitHtml({
      codiconsCssUri,
      componentScriptUri,
      nonce,
      sections: cockpitSections,
      webview
    });
  }
}

function getNonce(): string {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";

  for (let index = 0; index < 32; index += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function isRunCommandMessage(message: unknown): message is RunCommandMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    "commandId" in message &&
    message.type === "runCommand" &&
    typeof message.commandId === "string"
  );
}
