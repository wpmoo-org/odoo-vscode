import * as vscode from "vscode";

import { CockpitViewProvider } from "./cockpit/CockpitViewProvider";
import { runCockpitTerminalCommand } from "./cockpit/terminalRunner.js";

interface CockpitCommand {
  readonly command: string;
  readonly commandId: string;
}

const cockpitCommands: readonly CockpitCommand[] = [
  {
    command: "wpmooOdoo.status",
    commandId: "status"
  },
  {
    command: "wpmooOdoo.doctor",
    commandId: "doctor"
  },
  {
    command: "wpmooOdoo.start",
    commandId: "start"
  },
  {
    command: "wpmooOdoo.stop",
    commandId: "stop"
  },
  {
    command: "wpmooOdoo.restart",
    commandId: "restart"
  },
  {
    command: "wpmooOdoo.logs",
    commandId: "logs"
  }
];

export function activate(context: vscode.ExtensionContext): void {
  const provider = new CockpitViewProvider(context.extensionUri, runCockpitTerminalCommand);

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
        await runCockpitTerminalCommand(cockpitCommand.commandId);
      })
    );
  }
}

export function deactivate(): void {
  // No teardown is needed for the scaffold.
}
