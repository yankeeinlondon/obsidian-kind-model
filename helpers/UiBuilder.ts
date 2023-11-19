import { ButtonComponent, Setting } from "obsidian";
import { FolderSuggest } from "./FolderSuggest";
import { MaybeLazy, UiBuilderContextApi, UiBuilderComponentApi, UiBuilderOptions, UiBuilderApi } from "types/ui-builder-types";
import { logger } from "utils/logging";
import { LogLevel } from "types/settings-types";

// [Reference Docs](https://docs.obsidian.md/Plugins/User+interface/Settings)

// type Methods = {
//   TextComponent: {
//     setDisabled(disabled: boolean): Methods["TextComponent"];
//     /**
//      * @public
//      */
//     getValue(): string;
//     /**
//      * @public
//      */
//     setValue(value: string): Methods["TextComponent"];
//     /**
//      * @public
//      */
//     setPlaceholder(placeholder: string): Methods["TextComponent"];
//     /**
//      * @public
//      */
//     onChanged(): void;
//     /**
//      * @public
//      */
//     onChange(callback: (value: string) => any): Methods["TextComponent"];
//   }
// }

const isNotNull = <T extends PropertyKey | null, B extends Record<PropertyKey, any>>(prop: T, base: B): prop is Exclude<T, null> & keyof B & string => {
  return prop === null
    ? false
    : prop in base ? true : false;
}

/**
 * resolves the value of a `MaybeLazy<T>` value
 */
const resolve = <
  T extends MaybeLazy<any>
>(val: T): string => typeof val === "function" ? val() : val;


const contextApi = <
  TBase extends Record<string,any>,
  TGlobalOpt extends UiBuilderOptions
>(
  el: HTMLElement, 
  base: TBase,
  global_opt: TGlobalOpt,
  log_level: LogLevel
): UiBuilderContextApi<TBase,TGlobalOpt> => ({
  sectionHeading: (heading, sub_text) => {
    const color = "rgba(15, 117, 224, .75) "
    const headingText = createEl("h2", {
      cls: "section-header", 
      text: heading, 
      attr: { style: `font-size: larger; padding-bottom: 0; margin-bottom: 0; margin-top: 0.75rem`} }
    );
    const sub_text_el = sub_text
      ? createEl("div", {
          cls: "section-sub-text",
          text: sub_text,
          attr: { style: `font-size: smaller; border-left: 2px solid ${color}; padding-left: 8px;` } 
        })
      : undefined;
    
    const sectionInput = createEl("div", {
      cls: "input-section",
      text: "",
      attr: { style: `border-left: 2px solid ${color}; padding-left: 8px; `}
    })

    const section_heading = createEl("div")
      .appendChild(headingText);
    if (sub_text_el) {
      section_heading.appendChild(sub_text_el);
    }
    section_heading.appendChild(sectionInput);
    

    const bottom_pad = "padding-bottom: 0.25rem" ;
    const h = el.createEl("h2", {text: heading, attr: { style: `font-size: larger; padding-top: 0.75rem"; ${sub_text ? "" : bottom_pad}`}});
    let p;
    if (sub_text) {
      p = el.createEl("p", { cls: "settings-desc", text: sub_text, attr: { style: `${bottom_pad}; font-size: smaller`}});
    }

    el.appendChild(sectionInput);

    const fn: any = inputRow(sectionInput, base, global_opt, log_level)
    fn["section"] = heading;
    return fn;
  },
  iterateOver: (prop, cb) => {
    const settings: Setting[] = [];
    const container = base[prop];

    // TODO

    return settings;
  }
});
const componentApi = <
  TBase extends Record<string,any>,
  TGlobalOpt extends UiBuilderOptions
>(
  el: HTMLElement, 
  base: TBase,
  global_opt: TGlobalOpt,
  log_level: LogLevel
) => <
  TProp extends keyof TBase | null
>(
  name: MaybeLazy<string>, 
  desc: MaybeLazy<string>,
  prop: TProp
) => (s: Setting): UiBuilderComponentApi<TBase, TProp, TGlobalOpt> => {
  const {debug,info,warn,error} = logger(log_level);
  return {
    addDropdown(choices) {
      s.addDropdown(dd => {
          const isKeyValueDict = !Array.isArray(choices);
          for (const opt of isKeyValueDict 
            ? Object.keys(choices) as string[] 
            : choices as string[]
          ) {
            const value = isKeyValueDict ? String(choices[opt as keyof typeof choices]) : opt;
            dd.addOption(value,opt);

            if (
              isNotNull(prop,base) && 
              value === base[prop as NonNullable<TProp>]
            ) {
              dd.setValue(value);
            }
          }
          
          
          dd.onChange( v => {
            if(isNotNull(prop, base)) {
              const prior_value = base[prop];

              // debug(
              //   `updating dropdown[${prop}] to: \n  [ idx: ${v}, val: "${isKeyValueDict 
              //     ? choices[v as keyof typeof choices]
              //     : choices[v]}" ]`,
              //   `Prior value was '${base[prop]}'.`
              // );

              base[prop as NonNullable<TProp>] = (
                isKeyValueDict
                  ? choices[v as keyof typeof choices]
                  : v
              ) as TBase[NonNullable<TProp>];

              debug(`Updating ${name} dropdown`, `new value is:\n${JSON.stringify(v,null,2)}`, `prior value was:\n${JSON.stringify(prior_value, null, 2)}`);

              if(global_opt?.saveState && prop !== null) {
                if (typeof global_opt?.saveState !== "function") {
                  error(`saveState property was passed into UiBuilder but it's type is "${typeof global_opt?.saveState}" instead of being a function!`);
                } else {
                  info(`auto save`, `the dropdown "${String(prop)}" triggered saving state`, `the current state is: \n${JSON.stringify(base,null, 2)}`);
                  global_opt.saveState();
                }
              } else {
                debug(`no auto save: state changed on "${name}" property but state is not automatically save after state changes`);
              }

              s.setName(resolve(name));
              s.setDesc(resolve(desc));
            } else {
              debug(`the dropdown "${name}" changed state but no property was set to record this.`, "this may be ok but is typically an error", `the new state is now: ${v}`)
            }

          })
        });
  
      return componentApi(el,base,global_opt, log_level)(name,desc,prop)(s);
    },
    addToggleSwitch(opt = {}) {
      s.addToggle(t => {
        if (isNotNull(prop, base)) {
          t.setValue(base[prop])
        }
        t.onChange( v => {
          if(isNotNull(prop, base)) {
            s.setName(resolve(name));
            s.setDesc(resolve(desc));
            base[prop as NonNullable<TProp>] = v as TBase[NonNullable<TProp>];

            if(global_opt?.saveState && prop !== null) {
              if (typeof global_opt?.saveState !== "function") {
                error(`saveState property was passed into UiBuilder but it's type is "${typeof global_opt?.saveState}" instead of being a function!`)
              }
  
              info("auto save", `the toggle switch for "${prop}" detected a change`, `the new value for "${prop}" is: ${v}`);
              global_opt.saveState();
            } else {
              debug(`no auto save: state changed on "${name}" on property`);
            }         
          }
          if (opt.refreshDomOnChange) {
            warn("do not know how to refresh DOM yet")
          }
        })
      });
        
      return componentApi(el,base,global_opt, log_level)(name,desc,prop)(s);
    },
    addTextInput(opt = {}) {
      s.addText(t => {
        if (isNotNull(prop,base)) {
          t.setValue(base[prop])
        }
        t.onChange( v => {
          if(isNotNull(prop,base)) {
            base[prop as NonNullable<TProp>] = v as TBase[NonNullable<TProp>];           
          } else {
            debug(`state changed on the property "${name}" but because "prop" was null it will not be recorded.`);
          }
          s.setName(resolve(name));
          s.setDesc(resolve(desc));
          if (opt.refreshDomOnChange) {
            warn("do not know how to refresh DOM yet")
          }
          if(global_opt?.saveState && prop !== null) {
            if (typeof global_opt?.saveState !== "function") {
              error(`saveState property was passed into UiBuilder but it's type is "${typeof global_opt?.saveState}" instead of being a function!`)
            }

            debug(`toggle switch for "${String(prop)}" saving state`);
            global_opt.saveState();
          } else {
            debug(`no auto save: state changed on "${name}" on property`);
          }         
        })
      });

      return componentApi(el,base,global_opt, log_level)(name,desc,prop)(s);
    },
    addFolderSearch(opt = {}) {
        s.addSearch(t => {
          new FolderSuggest(t.inputEl);
          t.setPlaceholder(opt.placeholder || "Example: folder1/folder2")

          if (isNotNull(prop,base)) {
            t.setValue(base[prop])
          }

          t.onChange( v => {
            s.setName(resolve(name));
            s.setDesc(resolve(desc));
            if(isNotNull(prop,base)) {
              base[prop as NonNullable<TProp>] = v as TBase[NonNullable<TProp>];
              
              if(global_opt?.saveState) {
                if (typeof global_opt?.saveState !== "function") {
                  error(`saveState property was passed into UiBuilder but it's type is "${typeof global_opt?.saveState}" instead of being a function!`)
                } else {
                  info(`auto save`, `folder prop ${name} [${prop}] changed state to:`, v);
                  global_opt.saveState();
                }
    
              } else {
                debug(`no auto save: state changed on "${name}" on property`);
              }
            }

            if (opt.refreshDomOnChange) {
              warn("do not know how to refresh DOM yet")
            }
          })
        });

        return componentApi(el,base,global_opt, log_level)(name,desc,prop)(s);
    },

    addButton: (o) =>  {
      s.addButton((b: ButtonComponent) => {
        b.setTooltip(o?.tooltip || resolve(desc))
         .setButtonText(o?.buttonText || "+")
         .setCta()
         .onClick(o?.onClick ? o.onClick : () => warn(`${name} button for "${String(o?.buttonText)}" does not have a click handler`));
        

        if (o?.backgroundColor) {
          b.setClass(`bg-${o.backgroundColor}`)
        }
        if (o?.icon) {
          b.setIcon(o.icon);
        }
      });

      return componentApi(el,base,global_opt,log_level)(name,desc,prop)(s);
    },

    done: () => s
  }
};

/**
 * The main API surface provided by the `UiBuilder` which involves
 * picking a `Setting` from **Obsidian** and configuring it.
 */
const inputRow = <
  TBase extends Record<string,any>,
  TGlobalOpt extends UiBuilderOptions
>(
  el: HTMLElement, 
  base: TBase,
  global_opt: TGlobalOpt,
  log_level: LogLevel
) => <
  TProp extends keyof TBase | null
>(
  name: MaybeLazy<string>, 
  desc: MaybeLazy<string>,
  prop: TProp
): UiBuilderComponentApi<TBase, TProp, TGlobalOpt> => {
  const s = new Setting(el)
    .setName(resolve(name))
    .setDesc(resolve(desc));

  return componentApi(el,base,global_opt, log_level)(name,desc,prop)(s);
}

/**
 * **UiBuilder**`(el, base)`
 * 
 * A higher order function which allows you to provide the top level element
 * of a UI component along with the _base_ property you are mutating (must be a
 * dictionary or at least a container of some sort).
 * 
 * ```ts
 * const ui = UiBuilder(this.containerEl, this.kind);
 * // prop 1
 * ui("name", "description", "some_prop").textInput();
 * ```
 */
export const UiBuilder = <
  TBase extends Record<string,any>,
  TGlobalOpt extends UiBuilderOptions
>(
  el: HTMLElement, 
  base: TBase,
  log_level: LogLevel,
  global_opt: UiBuilderOptions = {} as UiBuilderOptions
): UiBuilderApi<TBase, TGlobalOpt> => {
  const { h1, style } = global_opt;
  const context = contextApi(el,base,global_opt, log_level);
  const settings: any = inputRow(el,base,global_opt, log_level);
  el.empty();
  for (const prop of Object.keys(context)) {
    settings[prop] = context[prop as keyof typeof context];
  }

  if (h1) {
    const attrs = style ? { attrs: { style: style}} : {};
    el.createEl("h1", { text: h1, ...attrs, cls: "page-header"})
  }

  return settings as UiBuilderApi<TBase, TGlobalOpt>;
};
