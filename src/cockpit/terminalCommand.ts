import { buildCommandPreview } from "./webview/commandPreview.js";

export interface CockpitTerminalCommand {
  readonly id: string;
  readonly title: string;
  readonly terminalName: string;
  readonly argv: readonly string[];
}

const terminalName = "WPMoo Odoo";

const cockpitTerminalCommands = [
  {
    id: "status",
    title: "Status",
    terminalName,
    argv: ["npx", "@wpmoo/odoo", "status"]
  },
  {
    id: "doctor",
    title: "Doctor",
    terminalName,
    argv: ["npx", "@wpmoo/odoo", "doctor"]
  },
  {
    id: "start",
    title: "Start",
    terminalName,
    argv: ["npx", "@wpmoo/odoo", "start"]
  },
  {
    id: "stop",
    title: "Stop",
    terminalName,
    argv: ["npx", "@wpmoo/odoo", "stop"]
  },
  {
    id: "restart",
    title: "Restart",
    terminalName,
    argv: ["npx", "@wpmoo/odoo", "restart"]
  },
  {
    id: "logs",
    title: "Logs",
    terminalName,
    argv: ["npx", "@wpmoo/odoo", "logs", "odoo"]
  }
] as const satisfies readonly CockpitTerminalCommand[];

const cockpitTerminalCommandsById: ReadonlyMap<string, CockpitTerminalCommand> = new Map(
  cockpitTerminalCommands.map((command) => [command.id, command])
);

export function buildTerminalCommand(argv: readonly string[]): string {
  return buildCommandPreview(argv);
}

export function getCockpitTerminalCommand(id: string): CockpitTerminalCommand | undefined {
  return cockpitTerminalCommandsById.get(id);
}
