import type KindModelPlugin from "~/main";
// import { FileManager } from "obsidian";
import { obApp } from "~/globals";

export function obsidianApi(p: KindModelPlugin) {
  return obApp;
}
