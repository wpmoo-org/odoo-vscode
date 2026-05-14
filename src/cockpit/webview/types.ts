export interface CommandPreview {
  readonly argv: readonly string[];
  readonly description?: string;
  readonly id?: string;
  readonly dynamic?: "environmentCreate";
}

export interface CockpitDashboardAction {
  readonly id: string;
  readonly label: string;
  readonly commandPreview: CommandPreview;
  readonly icon?: string;
  readonly primary?: boolean;
}

export interface CockpitDashboardService {
  readonly name: string;
  readonly status: string;
  readonly detail: string;
  readonly tone: "running" | "stopped" | "warning" | "unknown";
}

export interface CockpitDashboardDefinition {
  readonly status: {
    readonly label: string;
    readonly tone: "running" | "stopped" | "warning" | "unknown";
  };
  readonly actions: readonly CockpitDashboardAction[];
  readonly services: readonly CockpitDashboardService[];
  readonly lastCommand: CommandPreview;
  readonly recentLogs: readonly string[];
}

export type ControlDefinition =
  | {
      readonly type: "textfield";
      readonly value: string;
      readonly label?: string;
      readonly placeholder?: string;
      readonly readonly?: boolean;
      readonly disabled?: boolean;
      readonly commandField?: string;
      readonly width?: "full" | "half";
    }
  | {
      readonly type: "checkbox";
      readonly label: string;
      readonly checked: boolean;
      readonly disabled?: boolean;
      readonly commandField?: string;
      readonly width?: "full" | "half";
    }
  | {
      readonly type: "select";
      readonly value: string;
      readonly label?: string;
      readonly options: readonly {
        readonly label: string;
        readonly value: string;
      }[];
      readonly disabled?: boolean;
      readonly commandField?: string;
      readonly width?: "full" | "half";
    }
  | {
      readonly type: "button";
      readonly label: string;
      readonly icon?: string;
      readonly disabled?: boolean;
      readonly secondary?: boolean;
    }
  | {
      readonly type: "commandPreview";
      readonly preview: CommandPreview;
    };

export interface SettingsRowDefinition {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly controls?: readonly ControlDefinition[];
  readonly commandPreview?: CommandPreview;
  readonly badges?: readonly string[];
  readonly previewDisabled?: boolean;
  readonly action?: {
    readonly label: string;
    readonly disabled?: boolean;
  };
  readonly tone?: "default" | "risky" | "planned";
}

export interface SectionDefinition {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly heading?: string;
  readonly description?: string;
  readonly dashboard?: CockpitDashboardDefinition;
  readonly rows: readonly SettingsRowDefinition[];
}

export type WebviewMessage =
  | {
      readonly type: "sectionSelected";
      readonly sectionId: string;
    }
  | {
      readonly type: "runCommand";
      readonly commandId: string;
    };
