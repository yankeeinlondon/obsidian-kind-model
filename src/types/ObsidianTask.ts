import { ObsidianLink } from "./ObsidianLink";
import { Position } from "./Position";

export interface ObsidianTask {
  annotated: boolean;
  checked: boolean;
  children: unknown[];
  completed: boolean;
  fullyCompleted: boolean;
  header: ObsidianLink;
  line: number;
  link: ObsidianLink;
  outlinks: ObsidianLink[];
  path: string;
  position: {
    start: Position;
    end: Position;
  };
  real: boolean;
  section: ObsidianLink;
  status: string;
  subtasks: ObsidianTask[];
  symbol: string;
  tags: string[];
  task: boolean;
  text: string;
}
