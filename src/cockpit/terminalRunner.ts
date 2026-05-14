import * as vscode from "vscode";

import { buildTerminalCommand, getCockpitTerminalCommand } from "./terminalCommand.js";

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

function getOrCreateTerminal(name: string): vscode.Terminal {
  return vscode.window.terminals.find((terminal) => terminal.name === name) ?? vscode.window.createTerminal(name);
}
