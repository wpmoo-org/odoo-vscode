import type { SectionDefinition } from "../types.js";

export const sourceRepositoriesSection: SectionDefinition = {
  id: "source-repositories",
  title: "Source Repositories",
  icon: "repo",
  description: "Preview source repository and module management commands while all file-changing actions remain disabled.",
  rows: [
    {
      id: "add-source-repo",
      title: "Add source repo",
      description: "Preview adding a Git source repository as an environment submodule.",
      controls: [
        {
          type: "textfield",
          label: "Repository URL",
          value: "https://github.com/example-org/odoo_sample_module_reports.git",
          placeholder: "Repository URL",
          width: "full"
        },
        {
          type: "textfield",
          label: "Source path",
          value: "odoo_sample_module_reports",
          placeholder: "Optional source path",
          width: "half"
        },
        {
          type: "checkbox",
          label: "Initialize empty repository",
          checked: true,
          width: "half"
        }
      ],
      commandPreview: {
        argv: [
          "npx",
          "@wpmoo/odoo",
          "add-repo",
          "--repo-url",
          "https://github.com/example-org/odoo_sample_module_reports.git",
          "--init-empty-repos"
        ]
      },
      action: {
        label: "Add repo",
        disabled: true
      },
      badges: ["Preview only"]
    },
    {
      id: "remove-source-repo",
      title: "Remove source repo",
      description: "Preview removing a source repository submodule. Execution needs future confirmation safeguards.",
      controls: [
        {
          type: "textfield",
          label: "Source repo path",
          value: "odoo_sample_module_reports",
          placeholder: "Source repo path",
          disabled: true,
          width: "full"
        }
      ],
      commandPreview: {
        argv: ["npx", "@wpmoo/odoo", "remove-repo", "--repo", "odoo_sample_module_reports"]
      },
      action: {
        label: "Remove repo",
        disabled: true
      },
      badges: ["Risky", "Disabled"],
      previewDisabled: true,
      tone: "risky"
    },
    {
      id: "add-module",
      title: "Add module",
      description: "Preview adding a minimal Odoo module folder to a selected source repository.",
      controls: [
        {
          type: "textfield",
          label: "Source repo path",
          value: "odoo_sample_module",
          placeholder: "Source repo path",
          width: "half"
        },
        {
          type: "textfield",
          label: "Module technical name",
          value: "odoo_sample_module_base",
          placeholder: "Module technical name",
          width: "half"
        }
      ],
      commandPreview: {
        argv: [
          "npx",
          "@wpmoo/odoo",
          "add-module",
          "--repo",
          "odoo_sample_module",
          "--module",
          "odoo_sample_module_base"
        ]
      },
      action: {
        label: "Add module",
        disabled: true
      },
      badges: ["Preview only"]
    },
    {
      id: "remove-module",
      title: "Remove module",
      description: "Preview removing a module registration. File deletion is intentionally disabled in this shell.",
      controls: [
        {
          type: "textfield",
          label: "Source repo path",
          value: "odoo_sample_module",
          placeholder: "Source repo path",
          disabled: true,
          width: "half"
        },
        {
          type: "textfield",
          label: "Module technical name",
          value: "odoo_sample_module_base",
          placeholder: "Module technical name",
          disabled: true,
          width: "half"
        },
        {
          type: "checkbox",
          label: "Delete module files",
          checked: false,
          disabled: true,
          width: "full"
        }
      ],
      commandPreview: {
        argv: [
          "npx",
          "@wpmoo/odoo",
          "remove-module",
          "--repo",
          "odoo_sample_module",
          "--module",
          "odoo_sample_module_base"
        ]
      },
      action: {
        label: "Remove module",
        disabled: true
      },
      badges: ["Risky", "Disabled"],
      previewDisabled: true,
      tone: "risky"
    }
  ]
};

export default sourceRepositoriesSection;
