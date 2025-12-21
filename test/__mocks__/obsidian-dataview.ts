/**
 * Mock for the obsidian-dataview module used in tests.
 *
 * obsidian-dataview depends on obsidian and provides APIs for
 * querying vault data. This mock provides stubs for testing.
 */

import type { App } from "./obsidian";

// Mock Link type
export interface Link {
  path: string;
  display?: string;
  embed: boolean;
  type: "file" | "header" | "block";
  subpath?: string;
}

// Mock DateTime (from Luxon)
export interface DateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  toISO(): string;
  toFormat(format: string): string;
}

// Mock Query type
export interface Query {
  type: string;
  source: string;
}

// Mock Widget type
export interface Widget {
  $widget: string;
}

// Mock DataviewAPI
export interface DataviewAPI {
  page(path: string): any;
  pages(source?: string): any;
  pagePaths(source?: string): any;
  current(): any;
  array(raw: any[]): any;
  isArray(val: any): boolean;
  fileLink(path: string, embed?: boolean, display?: string): Link;
  sectionLink(path: string, section: string, embed?: boolean, display?: string): Link;
  blockLink(path: string, blockId: string, embed?: boolean, display?: string): Link;
  date(val: any): DateTime | null;
  duration(val: any): any;
  compare(a: any, b: any): number;
  equal(a: any, b: any): boolean;
  clone(val: any): any;
  parse(source: string): Query | string;
  evaluate(expr: string, context?: any): any;
  table(headers: string[], values: any[][], container: HTMLElement, component: any, sourcePath: string): void;
  taskList(tasks: any[], groupByFile: boolean, container: HTMLElement, component: any, sourcePath: string): void;
  list(values: any[], container: HTMLElement, component: any, sourcePath: string): void;
  paragraph(text: string, container: HTMLElement, component: any, sourcePath: string): void;
  span(text: string, container: HTMLElement, component: any, sourcePath: string): void;
  header(level: number, text: string, container: HTMLElement): void;
  el(tag: string, text: string, container?: HTMLElement): HTMLElement;
  renderValue(value: any, container: HTMLElement, component: any, sourcePath: string, inline?: boolean): void;
  execute(source: string): Promise<any>;
  executeJs(source: string, container: HTMLElement, component: any, sourcePath: string): Promise<void>;
  markdownTable(headers: string[], values: string[][], sourcePath: string): string;
  markdownTaskList(tasks: any[], sourcePath: string): string;
  markdownList(values: any[], sourcePath: string): string;
  luxon: any;
  io: any;
  index: any;
  func: any;
  value: any;
  widget: any;
}

/**
 * Mock getAPI function - returns a mock DataviewAPI or undefined
 */
export function getAPI(app?: App): DataviewAPI | undefined {
  // Return undefined to simulate Dataview not being ready
  return undefined;
}

// Default export for any default imports
export default {
  getAPI,
};
