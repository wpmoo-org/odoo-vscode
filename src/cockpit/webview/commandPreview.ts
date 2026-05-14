export interface SourceRepoPreviewValues {
  readonly url?: string;
  readonly path?: string;
  readonly addons?: string;
}

export interface CreateCommandPreviewValues {
  readonly product?: string;
  readonly odooVersion?: string;
  readonly target?: string;
  readonly devRepoUrl?: string;
  readonly sourceRepos?: readonly SourceRepoPreviewValues[];
  readonly httpPort?: string;
  readonly geventPort?: string;
  readonly postgresVersion?: string;
  readonly installAgentSkills?: boolean;
  readonly stage?: boolean;
}

const safeShellArgPattern = /^[A-Za-z0-9_./:@%+=,-]+$/;

export function quoteCommandArg(arg: string): string {
  if (arg.length > 0 && safeShellArgPattern.test(arg)) {
    return arg;
  }

  return `'${arg.replaceAll("'", "'\\''")}'`;
}

export function buildCommandPreview(argv: readonly string[]): string {
  return argv.map(quoteCommandArg).join(" ");
}

export function buildCreateCommandPreview(values: CreateCommandPreviewValues): string {
  const argv = buildCreateCommandArgv(values);

  return buildCommandPreview(argv);
}

export function buildCreateCommandArgv(values: CreateCommandPreviewValues): string[] {
  const argv = ["npx", "@wpmoo/odoo", "create"];

  pushFlagValue(argv, "--product", values.product);
  pushFlagValue(argv, "--odoo-version", values.odooVersion);
  pushFlagValue(argv, "--target", values.target);
  pushFlagValue(argv, "--dev-repo-url", values.devRepoUrl);

  for (const sourceRepo of values.sourceRepos ?? []) {
    pushFlagValue(argv, "--source-repo-url", sourceRepo.url);
    pushFlagValue(argv, "--source-path", sourceRepo.path);
    pushFlagValue(argv, "--source-addons", sourceRepo.addons);
  }

  pushFlagValue(argv, "--postgres-version", values.postgresVersion);
  pushFlagValue(argv, "--http-port", values.httpPort);
  pushFlagValue(argv, "--gevent-port", values.geventPort);

  if (values.installAgentSkills) {
    argv.push("--agent-skills-template");
  }

  if (values.stage === false) {
    argv.push("--stage=false");
  }

  return argv;
}

function pushFlagValue(argv: string[], flag: string, value: string | undefined): void {
  const normalizedValue = value?.trim();
  if (!normalizedValue) {
    return;
  }

  argv.push(flag, normalizedValue);
}
