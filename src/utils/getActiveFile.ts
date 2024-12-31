import { app } from "~/globals";

/**
 * Get's the currently active file in the editor (if there is one)
 */
export function getActiveFile() {
  return app().workspace.activeEditor?.file ?? app().workspace.getActiveFile();
}
