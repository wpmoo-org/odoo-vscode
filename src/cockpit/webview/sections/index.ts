import { cockpitSection } from "./cockpit.js";
import { environmentSection } from "./environment.js";
import { maintenanceSection } from "./maintenance.js";
import { sourceRepositoriesSection } from "./sourceRepositories.js";
import type { SectionDefinition } from "../types.js";

export const cockpitSections: readonly SectionDefinition[] = [
  cockpitSection,
  environmentSection,
  sourceRepositoriesSection,
  maintenanceSection
];
