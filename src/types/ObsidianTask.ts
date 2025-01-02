import type { DvPage, FileLink } from "./dataview_types";
import type { Position } from "./Position";

export interface ObsidianTask {
  annotated: boolean;
  checked: boolean;
  children: unknown[];
  completed: boolean;
  fullyCompleted: boolean;
  header: FileLink;
  line: number;
  link: FileLink;
  outlinks: FileLink[];
  path: string;
  position: {
    start: Position;
    end: Position;
  };
  real: boolean;
  section: FileLink;
  status: string;
  subtasks: ObsidianTask[];
  symbol: string;
  tags: string[];
  task: boolean;
  text: string;
}

export interface ObsidianTaskWithLink extends ObsidianTask {
	withLinks: DvPage[];
}
