import type { SectionDefinition } from "../types.js";

export const cockpitSection: SectionDefinition = {
  id: "cockpit-actions",
  title: "Cockpit",
  icon: "play-circle",
  heading: "WPMoo: Odoo Cockpit",
  description: "Daily service controls for the active WPMoo Odoo environment. Execution wiring comes in the next phase.",
  dashboard: {
    status: {
      label: "Status: Running",
      tone: "running"
    },
    actions: [
      {
        id: "start",
        label: "Start",
        icon: "debug-start",
        primary: true,
        commandPreview: {
          argv: ["npx", "@wpmoo/odoo", "start"]
        }
      },
      {
        id: "stop",
        label: "Stop",
        icon: "debug-stop",
        commandPreview: {
          argv: ["npx", "@wpmoo/odoo", "stop"]
        }
      },
      {
        id: "restart",
        label: "Restart",
        icon: "sync",
        commandPreview: {
          argv: ["npx", "@wpmoo/odoo", "restart"]
        }
      },
      {
        id: "logs",
        label: "Logs",
        icon: "output",
        commandPreview: {
          argv: ["npx", "@wpmoo/odoo", "logs", "odoo"]
        }
      },
      {
        id: "doctor",
        label: "Doctor",
        icon: "tools",
        commandPreview: {
          argv: ["npx", "@wpmoo/odoo", "doctor"]
        }
      }
    ],
    services: [
      {
        name: "Odoo Web",
        status: "Running",
        detail: "localhost:10019",
        tone: "running"
      },
      {
        name: "PostgreSQL",
        status: "Running",
        detail: "postgres:18",
        tone: "running"
      },
      {
        name: "Mailhog",
        status: "Stopped",
        detail: "smtp preview unavailable",
        tone: "stopped"
      }
    ],
    lastCommand: {
      argv: ["npx", "@wpmoo/odoo", "start"]
    },
    recentLogs: [
      "odoo  | 2026-05-14 20:51:01,123 INFO database: odoo_sample_module",
      "odoo  | 2026-05-14 20:51:02,412 INFO addons: loading 1 modules",
      "odoo  | 2026-05-14 20:51:03,008 INFO http: service ready on 0.0.0.0:8069"
    ]
  },
  rows: [
    {
      id: "preview-note",
      title: "Preview shell",
      description: "These controls show the intended daily workflow. Real terminal execution, status detection, and log streaming will be wired separately.",
      commandPreview: {
        argv: ["npx", "@wpmoo/odoo", "status"]
      },
      action: {
        label: "Run status",
        disabled: true
      },
      badges: ["Preview only"]
    }
  ]
};

export default cockpitSection;
