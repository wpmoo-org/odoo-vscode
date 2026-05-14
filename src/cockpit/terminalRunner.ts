import * as vscode from "vscode";

import { buildTerminalCommand, getCockpitTerminalCommand, isAllowedTerminalCommandText } from "./terminalCommand.js";

const defaultTerminalName = "WPMoo Odoo";

export async function runCockpitTerminalCommand(commandId: string): Promise<void> {
  const terminalCommand = getCockpitTerminalCommand(commandId);

  if (!terminalCommand) {
    await vscode.window.showWarningMessage(`Unknown WPMoo Odoo command: ${commandId}`);
    return;
  }

  const terminal = getOrCreateTerminal(terminalCommand.terminalName ?? defaultTerminalName);
  terminal.show();
  terminal.sendText(buildTerminalCommand(terminalCommand.argv), true);
}

export async function runTerminalCommandText(commandText: string): Promise<void> {
  if (!isAllowedTerminalCommandText(commandText)) {
    await vscode.window.showWarningMessage("Only WPMoo Odoo command previews can be run from this view.");
    return;
  }

  const terminal = getOrCreateTerminal(defaultTerminalName);
  terminal.show();
  terminal.sendText(commandText.trim(), true);
}

function getOrCreateTerminal(name: string): vscode.Terminal {
  return vscode.window.terminals.find((terminal) => terminal.name === name) ?? vscode.window.createTerminal(name);
}
