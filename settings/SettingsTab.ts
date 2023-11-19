import KindModel from "main";
import { App, PluginSettingTab } from "obsidian";
import { LOG_LEVELS,  CLASSIFICATION, DEFAULT_KIND, TAG_HANDLING } from "utils/Constants";
import { KindModal } from "./KindModal";
import { UiBuilder } from "helpers/UiBuilder";
import { logger } from "utils/logging";
import { ClassificationMeta, KindClassification } from "types/settings-types";


const ClassificationLookup: Record<KindClassification, [string[], Record<string,string>, string]> = {
  category: [
    ["category"],
    {},
    "A 0:1 relationship to a category only"
  ],
	"category and subcategory":[
		["category", "sub_category"],
    {},
		"A 0:1 hierarchical classification: a category and a sub-category of the parent category."
	],
  categories: [
		["categories"],
    {},
		"A 0:M relationship to any number of categories."
	],
  "grouped categories": [
		["categories"],
    { categories: "group" },
		"A 0:M relationship to any number of categories where the categories themselves have a 'group' property which organizes them."
	]
};

export const classification = (c: KindClassification): ClassificationMeta => ({
  name: c,
	kind_props: ClassificationLookup[c][0],
  other_props: ClassificationLookup[c][1],
	desc: ClassificationLookup[c][2] 
});



export class SettingsTab extends PluginSettingTab {
	plugin: KindModel;
  app: App;
  saveSettings: (() => Promise<unknown>) | undefined;

	constructor(app: App, plugin: KindModel) {
		super(app, plugin);
    this.app = app;
		this.plugin = plugin;
	}

	display(): void {
    const { info, debug } = logger(this.plugin.settings.log_level)
    debug(`The settings menu has been brought up and we start in this state: `, this.plugin.settings);

    const ui = UiBuilder(
      this.containerEl, 
      this.plugin.settings,
      this.plugin.settings.log_level, 
      { h1: "Kind Models", saveState: this.plugin.saveSettings.bind(this.plugin)}
  );

    ui(
      "Handle Tags", 
      "how to manage tags between page and frontmatter", 
      "handle_tags"
      ).addDropdown(TAG_HANDLING);

    ui(
      "Folder Location", 
      "All 'kind', and 'type' definitions will be located here", 
      "kind_folder"
    ).addFolderSearch();
  
    const kinds = ui.sectionHeading(
      "Kinds", 
      "The basic building block this plugin provides is a Kind. Each Kind represents some sort of entity. These entities can be \"classified \", grouped into broader \"types\", have relationships to other pages formalized, and have metrics added so that summary views of this kind can provide useful comparison metrics."
    );

    kinds(
      "Default Classification",
      "Each kind gets to state it's classification model but here you can state the default choice",
      "default_classification"
    ).addDropdown(CLASSIFICATION)

    kinds(
      "List of Kind Models",
      "Add new kinded type",
      "kinds"
    ).addButton({
      icon: "package-plus",
      onClick: () => {
        new KindModal(this.app, DEFAULT_KIND, this.plugin.settings.log_level).open();
      }
    })


    const types = ui.sectionHeading(
      "Types", 
      "Types provide a grouping function for Kinds. You can specify as many as you like and then later map 1:M Kinds to these types. Each type will receive it's own page and the kinds related to it will have a \"type\" property which points to this page."
    );

    types(
      "Create \"Other\" Type",
      "All kind models without a \"type\" will be assigned to type of Other",
      "other_type"
    ).addToggleSwitch();

    types(
      "List of Types",
      "Add a new \"type\" by pressing button or manually by creating a file in `${}.",
      "types"
    ).addButton({
      icon: "plus-circle",
      onClick: () => {
        console.log("add new type");
        
      }
    });



    const urls = ui.sectionHeading(
      "URLs",
      "This section deals with understanding URLs in the body of content as well as what properties in frontmatter should be considered for URL links."
    )

    urls(
      "URL Properties",
      "Add a property that may reside in frontmatter and indicate a URL or list of URLs",
      "url_props"
    ).addButton({
      icon: "list-plus",
      onClick: () => console.log("add URL props")
    })

    urls(
      "URL Patterns",
      "Setup regular expressions to map links in the page to a property or to modify the icon for that link in summary views.",
      "url_patterns"
    ).addButton({
      icon: "git-branch-plus",
      onClick: () => console.log("add URL patterns", this.plugin.settings)
    })

    const blocks = ui.sectionHeading(
      "Page Blocks",
      "With page blocks you can map page template blocks to various kind types and by doing so that page will be updated with these sections whenever the \"update page\" command is run."
    );
    blocks(
      "Page Blocks",
      "Add to the page blocks made available to kinds.",
      "page_blocks"
    ).addButton({
      icon: "file-plus"
    });

    const ops = ui.sectionHeading("Operations")

    ops(
      "Bulk Operations", 
      "Use buttons to take desired action: sync, snapshot, restore, reset.",
      null
    ).addButton({
      icon: "refresh-ccw",
      buttonText: "Sync",
      backgroundColor: "indigo",
      tooltip: "Synchronize the kind definitions in your vault's \"kind folder\" with the settings here."
    })
    .addButton({
      icon: "download",
      buttonText: "Snapshot",
      backgroundColor: "blue",
      tooltip: "Save current configuration as a Snapshot (which can be restored later)"
    })
    .addButton({
      icon: "clipboard-copy",
      buttonText: "Clipboard",
      backgroundColor: "blue",
      tooltip: "Copy your current configuration to the clipboard"
    })
    .addButton({
      icon: "upload",
      buttonText: "Restore",
      backgroundColor: "blue",
      tooltip: "Restore configuration from a snapshot or clipboard"
    })
    .addButton({
      icon: "reset",
      buttonText: "Reset",
      onClick: () => info("reset clicked"),
      backgroundColor: "red",
      tooltip: "Restore configuration to Plugin Default"
    });

    ops(
      "Log Level",
      "if you're experiencing problems you think could be related to this plugin you can change the log level to get more info sent to the developer console.",
      "log_level"
    ).addDropdown(LOG_LEVELS)
  }
}
