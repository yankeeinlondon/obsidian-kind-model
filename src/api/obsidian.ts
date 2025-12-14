import type KindModelPlugin from "~/main";
// import { FileManager } from "obsidian";
import { obApp } from "~/globals";

export function obsidianApi(_p: KindModelPlugin) {
  return obApp;
}
