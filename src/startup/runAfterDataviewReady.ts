import type KindModelPlugin from "~/main";
import type { Task } from "~/types";
import { dvApi } from "~/globals";

const MAX = 50;
const TASK_QUEUE: Task[] = [];
let watcherRunning: boolean = false;

async function watchForChange(p: KindModelPlugin, attempts: number = 0) {
  if (dvApi.index.initialized) {
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
  if (dvApi.index.initialized) {
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
