import * as vscode from "vscode";

import { runCockpitTerminalCommand } from "./terminalRunner.js";
import { detectWorkspaceSignals, workspaceMarkers } from "./workspaceDetection.js";
import { renderCockpitHtml } from "./webview/renderHtml";
import { cockpitSections } from "./webview/sections/index.js";
import type { EnvironmentGate } from "./webview/types.js";

interface RunCommandMessage {
  readonly type: "runCommand";
  readonly commandId: string;
}

export class CockpitViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "wpmooOdoo.cockpit";

  private environmentGate = getUnavailableEnvironmentGate(
    "No WPMoo environment is detected in this workspace. Create or select an environment before running service actions."
  );
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
    void this.refreshEnvironmentGate();
  }

  public refresh(): void {
    if (!this.view) {
      return;
    }

    void this.refreshEnvironmentGate();
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
      environmentGate: this.environmentGate,
      nonce,
      sections: cockpitSections,
      webview
    });
  }

  private async refreshEnvironmentGate(): Promise<void> {
    this.environmentGate = await detectEnvironmentGate();

    if (this.view) {
      this.view.webview.html = this.render(this.view.webview);
    }
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

async function detectEnvironmentGate(): Promise<EnvironmentGate> {
  const workspaceFolders = vscode.workspace.workspaceFolders ?? [];

  if (workspaceFolders.length === 0) {
    return getUnavailableEnvironmentGate("Open a WPMoo Odoo environment folder before running service actions.");
  }

  const markers = await collectWorkspaceMarkers(workspaceFolders);
  const detection = detectWorkspaceSignals(markers);

  if (detection.confidence === "strong") {
    return {
      ready: true,
      statusLabel: "Status: Ready",
      message: `Environment markers detected: ${detection.markers.join(", ")}.`,
      setupSectionId: "environment-setup"
    };
  }

  if (detection.confidence === "partial") {
    return getUnavailableEnvironmentGate(
      `This workspace only has partial environment markers (${detection.markers.join(", ")}). Open a generated WPMoo environment folder or finish setup first.`
    );
  }

  return getUnavailableEnvironmentGate(
    "No WPMoo environment is detected in this workspace. Create or select an environment before running service actions."
  );
}

async function collectWorkspaceMarkers(
  workspaceFolders: readonly vscode.WorkspaceFolder[]
): Promise<string[]> {
  const markers = await Promise.all(
    workspaceMarkers.map(async (marker) => {
      for (const folder of workspaceFolders) {
        if (await markerExists(folder.uri, marker)) {
          return marker;
        }
      }

      return undefined;
    })
  );

  const foundMarkers: string[] = [];
  for (const marker of markers) {
    if (marker) {
      foundMarkers.push(marker);
    }
  }

  return foundMarkers;
}

async function markerExists(workspaceUri: vscode.Uri, marker: string): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(vscode.Uri.joinPath(workspaceUri, ...marker.split("/")));
    return true;
  } catch {
    return false;
  }
}

function getUnavailableEnvironmentGate(message: string): EnvironmentGate {
  return {
    ready: false,
    statusLabel: "Status: Unavailable",
    message,
    setupSectionId: "environment-setup"
  };
}
