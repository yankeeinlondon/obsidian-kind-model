// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes

import { TAbstractFile, TFile } from "obsidian";
import { TextInputSuggest } from "./Suggest";
import { get_tfiles_from_folder } from "utils/Utils";
import TemplaterPlugin from "main";
import { errorWrapperSync } from "utils/Error";
import { KindModelSettings } from "types/settings-types";
import { Logger, logger } from "utils/logging";

export enum FileSuggestMode {
    TemplateFiles,
    ScriptFiles,
}

export class FileSuggest extends TextInputSuggest<TFile> {
    private debug: Logger["debug"];
    private info: Logger["info"];
    private warn: Logger["warn"];
    private error: Logger["error"];
    
    constructor(
        public inputEl: HTMLInputElement,
        private plugin: KindModelSettings,
        private folders: string[],
        
    ) {
        const {warn, error, debug, info} = logger(plugin.log_level);
        super(inputEl);
    }

    // get_folder(mode: FileSuggestMode): string {
    //     switch (mode) {
    //         case FileSuggestMode.TemplateFiles:
    //             return this.plugin.settings.templates_folder;
    //         case FileSuggestMode.ScriptFiles:
    //             return this.plugin.settings.user_scripts_folder;
    //     }
    // }

    get_error_msg(mode: FileSuggestMode): string {
        switch (mode) {
            case FileSuggestMode.TemplateFiles:
                return `Templates folder doesn't exist`;
            case FileSuggestMode.ScriptFiles:
                return `User Scripts folder doesn't exist`;
        }
    }

    getSuggestions(input_str: string): TFile[] {
        const all_files = [
            ...this.folders.map(f => {
                try {
                    return get_tfiles_from_folder(f);
                } catch {
                    this.warn(`Folder missing!`, `the folder "${f}" was request from the FileSuggest class but this file does not exist!`)
                    return [];
                }
            }).flat()
        ];

        const files: TFile[] = [];
        const lower_input_str = input_str.toLowerCase();

        all_files.forEach((file: TAbstractFile) => {
            if (
                file instanceof TFile &&
                file.extension === "md" &&
                file.path.toLowerCase().contains(lower_input_str)
            ) {
                files.push(file);
            }
        });

        return files;
    }

    renderSuggestion(file: TFile, el: HTMLElement): void {
        el.setText(file.path);
    }

    selectSuggestion(file: TFile): void {
        this.inputEl.value = file.path;
        this.inputEl.trigger("input");
        this.close();
    }
}
