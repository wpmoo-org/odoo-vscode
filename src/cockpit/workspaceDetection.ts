export type WorkspaceDetectionConfidence = "none" | "partial" | "strong";

export interface WorkspaceDetectionResult {
  readonly detected: boolean;
  readonly confidence: WorkspaceDetectionConfidence;
  readonly markers: string[];
}

export const workspaceMarkers = [
  "docker-compose.yml",
  "compose.yml",
  ".wpmoo/odoo.json",
  "package.json"
] as const;

export function detectWorkspaceSignals(fileNames: readonly string[]): WorkspaceDetectionResult {
  const fileNameSet = new Set(fileNames);
  const markers = workspaceMarkers.filter((marker) => fileNameSet.has(marker));
  const hasDockerCompose = fileNameSet.has("docker-compose.yml");
  const hasCompose = fileNameSet.has("compose.yml");
  const hasGeneratedMetadata = fileNameSet.has(".wpmoo/odoo.json");
  const hasPackageJson = fileNameSet.has("package.json");

  if (hasGeneratedMetadata || ((hasDockerCompose || hasCompose) && hasPackageJson)) {
    return {
      detected: true,
      confidence: "strong",
      markers
    };
  }

  if (markers.length > 0) {
    return {
      detected: true,
      confidence: "partial",
      markers
    };
  }

  return {
    detected: false,
    confidence: "none",
    markers: []
  };
}
