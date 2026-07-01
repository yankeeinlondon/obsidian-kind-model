import type KindModelPlugin from "~/main";
import type { Task } from "~/types";
import { getAPI } from "obsidian-dataview";

const MAX = 50;

/**
 * Checks if the Dataview API index is initialized.
 * Returns false if dvApi is not available (e.g., in test environments).
 */
function isDataviewReady(p: KindModelPlugin): boolean {
  const api = p.dv ?? getAPI(p.app);
  if (api) {
    p.dv = api;
  }
  return (api as { index?: { initialized?: boolean } } | undefined)?.index?.initialized ?? false;
}

async function watchForChange(p: KindModelPlugin, attempts: number = 0) {
  if (isDataviewReady(p)) {
    p.dvStatus = "ready";
    p.info(`Dataview is ready. Starting Task Queue [${p.taskQueue.length}].`);

    const tasks = p.taskQueue.splice(0);
    for (const task of tasks) {
      try {
        await task();
      }
      catch (error) {
        p.error(`Deferred Dataview task failed`, error);
      }
    }
    p.dataviewWatcherRunning = false;
    p.info(`Task Queue has completed`);
  }
  else {
    if (attempts > MAX) {
      p.error(`Timed out waiting for Dataview API to become available!`);
      p.dataviewWatcherRunning = false;
      return;
    }

    const timer = setTimeout(() => {
      p.dataviewReadyTimers.delete(timer);
      watchForChange(p, attempts + 1);
    }, 250);
    p.dataviewReadyTimers.add(timer);
  }
}

export function deferUntilDataviewReady(p: KindModelPlugin) {
  if (isDataviewReady(p)) {
    p.dvStatus = "ready";
  }

  return async <T extends Task>(
    task: T,
  ) => {
    if (p.dvStatus === "ready") {
      // execute immediately as we're already in a
      // ready state
      try {
        await task();
      }
      catch (error) {
        p.error(`Deferred Dataview task failed`, error);
      }
    }
    else {
      p.taskQueue.push(task);
      if (!p.dataviewWatcherRunning) {
        p.dataviewWatcherRunning = true;
        watchForChange(p);
      }
    }
  };
}
