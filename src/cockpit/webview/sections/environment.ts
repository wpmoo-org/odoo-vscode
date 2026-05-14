import { buildCreateCommandArgv, type CreateCommandPreviewValues } from "../commandPreview.js";
import type { SectionDefinition } from "../types.js";

const defaultEnvironmentValues: Required<CreateCommandPreviewValues> = {
  product: "odoo_sample_module",
  odooVersion: "19.0",
  target: "./odoo_sample_module_dev",
  devRepoUrl: "https://github.com/example-org/odoo_sample_module_dev.git",
  sourceRepos: [
    {
      url: "https://github.com/example-org/odoo_sample_module.git",
      path: "odoo_sample_module",
      addons: "odoo_sample_module"
    }
  ],
  httpPort: "10019",
  geventPort: "20019",
  postgresVersion: "18",
  installAgentSkills: true,
  stage: true
};

export const environmentSection: SectionDefinition = {
  id: "environment-setup",
  title: "Environment Setup",
  icon: "settings-gear",
  description: "Prepare a WPMoo Odoo development overlay from safe form inputs and preview the generated command.",
  rows: [
    {
      id: "product",
      title: "Product identity",
      description: "Set the product slug, target folder, and optional development repository URL.",
      controls: [
        {
          type: "textfield",
          label: "Product slug",
          value: defaultEnvironmentValues.product,
          commandField: "product",
          placeholder: "odoo_sample_module",
          width: "half"
        },
        {
          type: "textfield",
          label: "Target directory",
          value: defaultEnvironmentValues.target,
          commandField: "target",
          placeholder: "./odoo_sample_module_dev",
          width: "half"
        },
        {
          type: "textfield",
          label: "Dev repo URL",
          value: defaultEnvironmentValues.devRepoUrl,
          commandField: "devRepoUrl",
          placeholder: "https://github.com/example-org/odoo_sample_module_dev.git",
          width: "full"
        }
      ]
    },
    {
      id: "odoo-runtime",
      title: "Odoo runtime",
      description: "Choose the Odoo, PostgreSQL, and exposed service port defaults for the future environment.",
      controls: [
        {
          type: "select",
          label: "Odoo version",
          value: defaultEnvironmentValues.odooVersion,
          commandField: "odooVersion",
          options: [
            { label: "19.0", value: "19.0" },
            { label: "18.0", value: "18.0" },
            { label: "17.0", value: "17.0" },
            { label: "16.0", value: "16.0" }
          ],
          width: "half"
        },
        {
          type: "select",
          label: "PostgreSQL version",
          value: defaultEnvironmentValues.postgresVersion,
          commandField: "postgresVersion",
          options: [
            { label: "18", value: "18" },
            { label: "17", value: "17" },
            { label: "16", value: "16" },
            { label: "15", value: "15" }
          ],
          width: "half"
        },
        {
          type: "textfield",
          label: "HTTP port",
          value: defaultEnvironmentValues.httpPort,
          commandField: "httpPort",
          placeholder: "10019",
          width: "half"
        },
        {
          type: "textfield",
          label: "Gevent port",
          value: defaultEnvironmentValues.geventPort,
          commandField: "geventPort",
          placeholder: "20019",
          width: "half"
        }
      ]
    },
    {
      id: "source-repo",
      title: "Source repository",
      description: "Attach one source repository or local path and define the addon folder list that belongs to it.",
      controls: [
        {
          type: "textfield",
          label: "Source repo URL or path",
          value: defaultEnvironmentValues.sourceRepos[0].url ?? "",
          commandField: "sourceRepoUrl",
          placeholder: "https://github.com/example-org/odoo_sample_module.git",
          width: "full"
        },
        {
          type: "textfield",
          label: "Source path",
          value: defaultEnvironmentValues.sourceRepos[0].path ?? "",
          commandField: "sourcePath",
          placeholder: "odoo_sample_module",
          width: "half"
        },
        {
          type: "textfield",
          label: "Source addons",
          value: defaultEnvironmentValues.sourceRepos[0].addons ?? "",
          commandField: "sourceAddons",
          placeholder: "odoo_sample_module",
          width: "half"
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced options",
      description: "Keep optional setup switches visible while the extension remains preview-only.",
      controls: [
        {
          type: "checkbox",
          label: "Install Agent Skills",
          checked: defaultEnvironmentValues.installAgentSkills,
          commandField: "installAgentSkills",
          width: "half"
        },
        {
          type: "checkbox",
          label: "Stage generated files",
          checked: defaultEnvironmentValues.stage,
          commandField: "stage",
          width: "half"
        }
      ]
    },
    {
      id: "create-preview",
      title: "Create command preview",
      description: "The command updates locally as form values change. It is not executed by this phase.",
      commandPreview: {
        id: "environment-create",
        dynamic: "environmentCreate",
        argv: buildCreateCommandArgv(defaultEnvironmentValues),
        description: "Copying is allowed; running the command from VS Code will be wired in a later phase."
      },
      action: {
        label: "Create environment",
        disabled: true
      },
      badges: ["Preview only"]
    }
  ]
};
