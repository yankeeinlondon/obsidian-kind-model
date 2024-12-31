import type { App } from "obsidian";
import type { Kind, LogLevel } from "~/types";
import { Modal } from "obsidian";
import { UiBuilder } from "../helpers/UiBuilder";
import { CLASSIFICATION, FOLDER_DEFAULT, UOM_TYPES } from "../utils/Constants";
import { classification } from "./SettingsTab";

export class KindModal extends Modal {
  private kind: Kind;
  private log_level: LogLevel;

  constructor(app: App, kind: Kind, log_level: LogLevel) {
    super(app);
    this.kind = kind;
    this.log_level = log_level;
  }

  onOpen() {
    const ui = UiBuilder(this.contentEl, this.kind, this.log_level, {
      h1: "New Kind model",
    });
    const core = ui.sectionHeading("Core Config");

    core("Name", "the unique name for this Kind", "name").addTextInput();

    core(
      "Tag",
      "the tag which will be used to identify this Kind; no need to include '#' symbol though you're free to.",
      "tag",
    ).addTextInput();

    core(
      "Classification",
      () => classification(this.kind._classification_type).desc,
      "_classification_type",
    ).addDropdown(CLASSIFICATION);

    const filesAndFolders = ui.sectionHeading(
      "Filename and Folders",
      "When you use the \"add kinded page\" command, this will determine which folders are offered as possible locations",
    );

    filesAndFolders(
      "Favorite Folder",
      "the folder you most associate with this kind",
      "_folder_favorite",
    ).addTextInput();

    filesAndFolders(
      "Include Subdirectories",
      "whether the sub-directories under your favorite folder should be offered as options",
      "_show_sub_dirs",
    ).addToggleSwitch();

    filesAndFolders(
      "Current Directory",
      "whether to allow current directory to be a valid location",
      "_folder_include_cwd",
    ).addToggleSwitch({
      refreshDomOnChange: true,
    });

    if (this.kind._folder_include_cwd) {
      filesAndFolders(
        "Default Directory",
        "whether the current directory or the favorite dir should be the default",
        "_classification_type",
      ).addDropdown(FOLDER_DEFAULT);
    }

    filesAndFolders(
      "Filename Date Prefix",
      "whether or not the file name should be prefixed with a date",
      "_filename_date_prefix",
    ).addToggleSwitch();

    const properties = ui.sectionHeading(
      "Properties",
      "In this section you can add Relationships and Metrics",
    );

    properties(
      "Add Relationship",
      "The classification strategy sets up an abstracted set of relationships but sometimes you want a direct relationship to another kind. You can add them here.",
      "_relationships",
    ).addButton({
      icon: "key",
      buttonText: "+",
      onClick: () => {
        this.kind._relationships.push({
          prop: "",
          fk_kind: "",
          cardinality: "0:1",
        });
      },
    });

    properties(
      "Add Metric",
      "Metrics are numeric properties which are associated with a unit of measure. When added to a kind these properties will be added as properties to the page; you can fill them in manually or you can use the \"Add Metrics\" command to be brought through it via script.",
      "_metric_props",
    ).addButton({
      icon: "binary",
      buttonText: "+",
      onClick: () => {
        this.kind._metric_props.push({ name: "", uom_type: "mass" });
      },
    });

    const metrics = this.kind._metric_props;
    for (const key in this.kind._metric_props) {
      ui(
        metrics[key].name,
        () =>
          metrics[key].name.trim() === ""
            ? "new property"
            : "existing property",
        "_metric_props",
        key,
      ).addDropdown(UOM_TYPES);
    }

    const auto = ui.sectionHeading(
      "Auto Aliases",
      "When you're working on a kind page -- or any classification of a kind page -- you configure whether the `aliases` assigned to that page are automatically added to in smart ways.",
    );

    auto(
      "Plural/Singular",
      "Ensure that both the singular and plural versions of a Kind page are available",
      "_aliases_plural",
    ).addToggleSwitch();
    auto(
      "Casing",
      "Ensure that the page's name is available in lowercase as well as capitalized",
      "_aliases_lowercase",
    ).addToggleSwitch();
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
