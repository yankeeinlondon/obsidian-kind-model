import type KindModelPlugin from "~/main";
import { dvApi } from "~/globals";

const MAX = 50;
let watcherRunning: boolean = false;

/**
 * Checks if the Dataview API index is initialized.
 * Returns false if dvApi is not available (e.g., in test environments).
 */
function isDataviewReady(): boolean {
  return dvApi?.index?.initialized ?? false;
}

async function watchForChange(p: KindModelPlugin, attempts: number = 0) {
  if (isDataviewReady()) {
    p.dvStatus = "ready";
    p.info(`Dataview is ready. Starting Task Queue [${p.taskQueue.length}].`);

    for (const task of p.taskQueue) {
      await task();
    }
    p.info(`Task Queue has completed`);
  }
  else {
    if (attempts > MAX) {
      p.error(`Timed out waiting for Dataview API to become available!`);
      return;
    }

    setTimeout(() => {
      watchForChange(p, attempts + 1);
    }, 250);
  }
}

export function deferUntilDataviewReady(p: KindModelPlugin) {
  if (isDataviewReady()) {
    p.dvStatus = "ready";
  }

  return async <T extends Task>(
    task: T,
  ) => {
    if (p.dvStatus === "ready") {
      // execute immediately as we're already in a
      // ready state
      await task();
    }
    else {
      p.taskQueue.push(task);
      if (!watcherRunning) {
        watcherRunning = true;
        watchForChange(p);
      }
    }
  };
}
