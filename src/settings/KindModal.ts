import { App, Modal } from "obsidian";
import {  classification } from "./SettingsTab";
import { CLASSIFICATION, FOLDER_DEFAULT, UOM_TYPES } from "utils/Constants";
import { UiBuilder } from "helpers/UiBuilder";
import { Kind, LogLevel } from "types/settings-types";

export class KindModal extends Modal {
	private kind: Kind;
  private log_level: LogLevel;
  public contentEl: HTMLElement;

	constructor(app:App, kind: Kind, log_level: LogLevel) {
		super(app);
		this.kind = kind;
    this.log_level = log_level;
	}

	onOpen() {
    const ui = UiBuilder(this.contentEl, this.kind, this.log_level, {h1: "New Kind model"});
    const core = ui.sectionHeading("Core Config");

    core("Name", "the unique name for this Kind", "name")
      .addTextInput();

      core(
      "Tag", 
      "the tag which will be used to identify this Kind; no need to include \'#\' symbol though you're free to.", 
      "tag"
    ).addTextInput();

      core(
          "Classification", 
          () => classification(this.kind.classification_type).desc, 
          "classification_type"
        ).addDropdown(CLASSIFICATION);

      const filesAndFolders = ui.sectionHeading(
        "Filename and Folders",
        "When you use the \"add kinded page\" command, this will determine which folders are offered as possible locations"
      );
                    
      filesAndFolders(
        "Favorite Folder", 
        "the folder you most associate with this kind", 
        "folder_favorite"
      ).addTextInput();

      filesAndFolders(
        "Include Subdirectories", 
        "whether the sub-directories under your favorite folder should be offered as options", 
        "show_sub_dirs"
      ).addToggleSwitch();

      filesAndFolders(
        "Current Directory", 
        "whether to allow current directory to be a valid location", 
        "folder_include_cwd"
      ).addToggleSwitch({
        refreshDomOnChange: true
      });

      if (this.kind.folder_include_cwd) {
        filesAndFolders(
          "Default Directory",
          "whether the current directory or the favorite dir should be the default", 
          "classification_type"
        ).addDropdown(FOLDER_DEFAULT);
      }

      filesAndFolders(
        "Filename Date Prefix", 
        "whether or not the file name should be prefixed with a date", 
        "filename_date_prefix"
      ).addToggleSwitch();

      const properties = ui.sectionHeading(
        "Properties",
        "In this section you can add Relationships and Metrics"
      )
      
      properties(
          "Add Relationship",
          "The classification strategy sets up an abstracted set of relationships but sometimes you want a direct relationship to another kind. You can add them here.",
          "relationships"
        ).addButton({
          icon: "key",
          buttonText: "+",
          onClick: () =>  {
            this.kind.relationships.push({prop: "", fk_kind: "", cardinality: "0:1"})
          }
      });

      properties(
        "Add Metric",
        "Metrics are numeric properties which are associated with a unit of measure. When added to a kind these properties will be added as properties to the page; you can fill them in manually or you can use the \"Add Metrics\" command to be brought through it via script.",
        "metric_props"
      ).addButton({
        icon: "binary",
        buttonText: "+",
        onClick: () =>  {
          this.kind.metric_props.push({name: "", uom_type: "mass"})
        }
      });

      const metrics = this.kind.metric_props;
      for (const key in this.kind.metric_props) {
        ui(
          metrics[key].name,
          () => metrics[key].name.trim() === "" ? "new property" : "existing property",
          "metric_props",
          key
        ).addDropdown(UOM_TYPES)
      }

      const auto = ui.sectionHeading("Auto Aliases", "When you're working on a kind page -- or any classification of a kind page -- you configure whether the `aliases` assigned to that page are automatically added to in smart ways.");

      auto(
        "Plural/Singular",
        "Ensure that both the singular and plural versions of a Kind page are available",
        "aliases_plural"
      ).addToggleSwitch()
      auto(
        "Casing",
        "Ensure that the page's name is available in lowercase as well as capitalized",
        "aliases_casing"
      ).addToggleSwitch()
	}
	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
