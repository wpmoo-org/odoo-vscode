import * as vscode from "vscode";

import { renderCockpitHtml } from "./webview/renderHtml";
import { cockpitSections } from "./webview/sections/index.js";

export class CockpitViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "wpmooOdoo.cockpit";

  private view?: vscode.WebviewView;

  public constructor(private readonly extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, "media")]
    };

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
