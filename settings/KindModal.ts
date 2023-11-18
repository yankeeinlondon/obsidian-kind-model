import { App, Modal, Setting } from "obsidian";
import { Kind, KindClassification, classification } from "./Settings";
import { CLASSIFICATION, FOLDER_DEFAULT, UOM_TYPES } from "utils/Constants";
import { UiBuilder } from "helpers/UiBuilder";

export class KindModal extends Modal {
	private kind: Kind;
	constructor(app:App, kind: Kind) {
		super(app);
		this.kind = kind;
	}

	onOpen() {
    const ui = UiBuilder(this.contentEl, this.kind, {h1: "New Kind model"});

    const core = ui.sectionHeading("Core Config");

    core("Name", "the unique name for this Kind", "name")
      .addTextInput();

      core(
      "Tag", 
      "the tag which will be used to identify this Kind; no need to include \'#\' symbol though you're free to.", 
      "tag"
    ).addTextInput();


      // const class_strategy = new Setting(c)
      //   .setName("Classification")
      //   .setDesc(classification(this.kind.classification_type).desc)
      //   .addDropdown(d => {
      //     for (const opt of CLASSIFICATION) {
      //       d.addOption(opt, opt)
      //     }

      //     d.setValue(this.kind.classification_type)
      //     d.onChange(v => {
      //       this.kind.classification_type = v as KindClassification;
      //       class_strategy.setDesc(classification(this.kind.classification_type).desc)
      //     })
      //   })

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
      ).addToggleSwitch();

      filesAndFolders(
        "Default Directory",
        "whether the current directory or the favorite dir should be the default", 
        "classification_type"
      ).addDropdown(FOLDER_DEFAULT);


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

	}
	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}
