import type { SectionDefinition } from "../types.js";

export const cockpitSection: SectionDefinition = {
  id: "cockpit-actions",
  title: "Cockpit Actions",
  icon: "play-circle",
  description: "Preview common service cockpit commands without executing them from the extension host.",
  rows: [
    {
      id: "environment-status",
      title: "Environment Status",
      description: "Inspect the current WPMoo Odoo environment state without changing services.",
      commandPreview: {
        argv: ["npx", "@wpmoo/odoo", "status"]
      },
      action: {
        label: "Status",
        disabled: true
      },
      badges: ["Preview only"]
    },
    {
      id: "doctor",
      title: "Doctor",
      description: "Run diagnostics for Docker, generated metadata, repository layout, and local tooling.",
      commandPreview: {
        argv: ["npx", "@wpmoo/odoo", "doctor"]
      },
      action: {
        label: "Doctor",
        disabled: true
      },
      badges: ["Preview only"]
    },
    {
      id: "services-start",
      title: "Start Services",
      description: "Preview the service startup command for the active environment.",
      commandPreview: {
        argv: ["npx", "@wpmoo/odoo", "start"]
      },
      action: {
        label: "Start",
        disabled: true
      },
      badges: ["Preview only"]
    },
    {
      id: "services-stop",
      title: "Stop Services",
      description: "Stopping services can interrupt active local work, so execution stays disabled in this shell.",
      commandPreview: {
        argv: ["npx", "@wpmoo/odoo", "stop"]
      },
      action: {
        label: "Stop",
        disabled: true
      },
      badges: ["Risky", "Disabled"],
      previewDisabled: true,
      tone: "risky"
    },
    {
      id: "services-restart",
      title: "Restart Services",
      description: "Preview the restart command for Odoo development services.",
      commandPreview: {
        argv: ["npx", "@wpmoo/odoo", "restart"]
      },
      action: {
        label: "Restart",
        disabled: true
      },
      badges: ["Preview only"]
    },
    {
      id: "logs",
      title: "Logs",
      description: "Preview the command that follows Odoo service logs.",
      commandPreview: {
        argv: ["npx", "@wpmoo/odoo", "logs", "odoo"]
      },
      action: {
        label: "Open logs",
        disabled: true
      },
      badges: ["Preview only"]
    },
    {
      id: "future-shell",
      title: "Shell",
      description: "A container shell launcher belongs in the next execution phase after terminal routing exists.",
      action: {
        label: "Planned",
        disabled: true
      },
      badges: ["Planned"],
      tone: "planned"
    }
  ]
};

export default cockpitSection;
