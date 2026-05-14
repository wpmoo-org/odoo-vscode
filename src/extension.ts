import * as vscode from "vscode";

import { CockpitViewProvider } from "./cockpit/CockpitViewProvider";

interface CockpitCommand {
  readonly command: string;
  readonly title: string;
}

const cockpitCommands: readonly CockpitCommand[] = [
  {
    command: "wpmooOdoo.status",
    title: "Status"
  },
  {
    command: "wpmooOdoo.doctor",
    title: "Doctor"
  },
  {
    command: "wpmooOdoo.start",
    title: "Start"
  },
  {
    command: "wpmooOdoo.stop",
    title: "Stop"
  },
  {
    command: "wpmooOdoo.restart",
    title: "Restart"
  },
  {
    command: "wpmooOdoo.logs",
    title: "Logs"
  }
];

export function activate(context: vscode.ExtensionContext): void {
  const provider = new CockpitViewProvider(context.extensionUri);

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
