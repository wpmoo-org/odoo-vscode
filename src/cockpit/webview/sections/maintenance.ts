import type { SectionDefinition } from "../types.js";

export const maintenanceSection: SectionDefinition = {
  id: "maintenance",
  title: "Maintenance",
  icon: "database",
  description: "Preview database and environment maintenance commands with destructive paths clearly disabled.",
  rows: [
    {
      id: "snapshot",
      title: "Create snapshot",
      description: "Prepare a database snapshot command without running it.",
      controls: [
        {
          type: "textfield",
          label: "Database",
          value: "odoo_sample_module",
          placeholder: "Database name",
          width: "half"
        },
        {
          type: "textfield",
          label: "Snapshot name",
          value: "before_module_update",
          placeholder: "Snapshot name",
          width: "half"
        }
      ],
      commandPreview: {
        argv: ["npx", "@wpmoo/odoo", "snapshot", "odoo_sample_module", "before_module_update"]
      },
      action: {
        label: "Create snapshot",
        disabled: true
      },
      badges: ["Preview only"]
    },
    {
      id: "restore-snapshot",
      title: "Restore snapshot",
      description: "Restoring a snapshot can overwrite current data. Future execution must require an explicit confirmation.",
      controls: [
        {
          type: "textfield",
          label: "Snapshot name",
          value: "before_module_update",
          placeholder: "Snapshot name",
          disabled: true,
          width: "half"
        },
        {
          type: "textfield",
          label: "Database",
          value: "odoo_sample_module",
          placeholder: "Database name",
          disabled: true,
          width: "half"
        }
      ],
      commandPreview: {
        argv: ["npx", "@wpmoo/odoo", "restore-snapshot", "before_module_update", "odoo_sample_module"]
      },
      action: {
        label: "Restore snapshot",
        disabled: true
      },
      badges: ["Risky", "Disabled"],
      previewDisabled: true,
      tone: "risky"
    },
    {
      id: "resetdb",
      title: "Reset database",
      description: "Resetting a database can replace current state and must stay disabled until confirmation rules exist.",
      controls: [
        {
          type: "textfield",
          label: "Database",
          value: "odoo_sample_module",
          placeholder: "Database name",
          disabled: true,
          width: "half"
        },
        {
          type: "textfield",
          label: "Modules",
          value: "odoo_sample_module_base",
          placeholder: "module_a,module_b",
          disabled: true,
          width: "half"
        }
      ],
      commandPreview: {
        argv: ["npx", "@wpmoo/odoo", "resetdb", "odoo_sample_module", "odoo_sample_module_base"]
      },
      action: {
        label: "Reset database",
        disabled: true
      },
      badges: ["Risky", "Disabled"],
      previewDisabled: true,
      tone: "risky"
    },
    {
      id: "safe-reset",
      title: "Safe reset environment",
      description: "Refresh generated environment files while preserving source repositories. It is still disabled in preview mode.",
      commandPreview: {
        argv: ["npx", "@wpmoo/odoo", "reset"]
      },
      action: {
        label: "Safe reset",
        disabled: true
      },
      badges: ["Risky", "Disabled"],
      previewDisabled: true,
      tone: "risky"
    }
  ]
};

export default maintenanceSection;
