import { App, PluginManifest } from "obsidian";
import KindModelPlugin from "../../src/main";

export const mockPluginManifest: PluginManifest = {
    id: "mock-plugin",
    name: "Mock Plugin",
    author: "Mock Author",
    version: "1.0.0",
    minAppVersion: "0.15.0",
    description: "A mock plugin for testing.",
    dir: "mock-plugin-dir",
    authorUrl: "https://mockauthor.dev",
    isDesktopOnly: false,
};

const mockApp = {
    keymap: {
        // Mock methods or properties if necessary
    },
    scope: {
        // Mock methods or properties if necessary
    },
    workspace: {
        // Mock methods or properties if necessary
    },
    vault: {
        // Mock methods or properties if necessary
    },
    metadataCache: {
        // Mock methods or properties if necessary
    },
    fileManager: {
        // Mock methods or properties if necessary
    },
    lastEvent: null,
} as unknown as App;

export const createInstance = () => new KindModelPlugin(mockApp, mockPluginManifest);
