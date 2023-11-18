import { ButtonComponent, Setting } from "obsidian";
import { FolderSuggest } from "./FolderSuggest";
import { MaybeLazy, UiBuilderContextApi, UiBuilderComponentApi, UiBuilderOptions, UiBuilderApi } from "types/ui-builder-types";

type Methods = {
  TextComponent: {
    setDisabled(disabled: boolean): Methods["TextComponent"];
    /**
     * @public
     */
    getValue(): string;
    /**
     * @public
     */
    setValue(value: string): Methods["TextComponent"];
    /**
     * @public
     */
    setPlaceholder(placeholder: string): Methods["TextComponent"];
    /**
     * @public
     */
    onChanged(): void;
    /**
     * @public
     */
    onChange(callback: (value: string) => any): Methods["TextComponent"];
  }
}

const isNotNull = <T extends unknown>(val: T): val is Exclude<T, null> => {
  return val !== null;
}

/**
 * resolves the value of a `MaybeLazy<T>` value
 */
const resolve = <
  T extends MaybeLazy<any>
>(val: T): string => typeof val === "function" ? val() : val;

const log = (...args: unknown[]) => {
  console.groupCollapsed("obsidian-kind-model");
  for (const w of args) {
    console.log(w)
  }
  console.groupEnd();
 }

 const warn = (...args: unknown[]) => {
  console.group("obsidian-kind-model");
  for (const w of args) {
    console.warn(w)
  }
  console.groupEnd();
 }

const contextApi = <
  TBase extends Record<PropertyKey,any>,
  TGlobalOpt extends UiBuilderOptions
>(
  el: HTMLElement, 
  base: TBase,
  global_opt: TGlobalOpt
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

    const fn: any = inputRow(sectionInput,base, global_opt)
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
  TBase extends Record<PropertyKey,any>,
  TGlobalOpt extends UiBuilderOptions
>(
  el: HTMLElement, 
  base: TBase,
  global_opt: TGlobalOpt
) => <
  TProp extends keyof TBase | null
>(
  name: MaybeLazy<string>, 
  desc: MaybeLazy<string>,
  prop: TProp
) => (s: Setting): UiBuilderComponentApi<TBase, TProp, TGlobalOpt> => ({
    addDropdown(choices) {
      s.addDropdown(dd => {
          const isLookup = Array.isArray(choices);
          for (const opt of isLookup 
            ? Object.keys(choices) as string[] 
            : choices as string[]
          ) {
            dd.addOption(
              opt, 
              isLookup ? choices[opt as keyof typeof choices] : opt
            );
          }
          if (prop) {
            dd.setValue(base[prop]);
          }
          dd.onChange( v => {
            if(isNotNull(v)) {
              log(
                `updating dropdown[${String(prop)}] to index[${v}]:`, 
                isLookup 
                  ? choices[v as keyof typeof choices]
                  : choices[v] 
              );

              base = isLookup
              ? {...base, [v]: choices[v as keyof typeof choices]}
              : {...base, [v]: v };
            }
            
            s.setName(resolve(name));
            s.setDesc(resolve(desc));
            
            if(global_opt?.autoSavePlugin) {
              if (global_opt?.app) {
                const app = global_opt.app;
              }
            }

          })
        });
  
      return componentApi(el,base,global_opt)(name,desc,prop)(s);
    },
    addToggleSwitch(opt = {}) {
      s.addToggle(t => {
        if (isNotNull(prop)) {
          t.setValue(base[prop])
        }
        t.onChange( v => {
          if(isNotNull(prop)) {
            base = { ...base, [prop]: v}
          }
          s.setName(resolve(name));
          s.setDesc(resolve(desc));
          if (opt.refreshDomOnChange) {
            warn("do not know how to refresh DOM yet")
          }
          if (opt.savePluginOnChange) {
            warn("need app for this feature")
          }
        })
      });
        
      return componentApi(el,base,global_opt)(name,desc,prop)(s);
    },
    addTextInput(opt = {}) {
      s.addText(t => {
        if (isNotNull(prop)) {
          t.setValue(base[prop])
        }
        t.onChange( v => {
          if(isNotNull(prop)) {
            base = { ...base, [prop]: v}
          }
          s.setName(resolve(name));
          s.setDesc(resolve(desc));
          if (opt.refreshDomOnChange) {
            warn("do not know how to refresh DOM yet")
          }
          if (opt.savePluginOnChange) {
            warn("need app for this feature")
          }
        })
      });

      return componentApi(el,base,global_opt)(name,desc,prop)(s);
    },
    addFolderSearch(opt = {}) {
        s.addSearch(t => {
          new FolderSuggest(t.inputEl);
          t.setPlaceholder(opt.placeholder || "Example: folder1/folder2")

          if (isNotNull(prop)) {
            t.setValue(base[prop])
          }

          t.onChange( v => {
            if(isNotNull(prop)) {
              base = { ...base, [prop]: v}
            }
            s.setName(resolve(name));
            s.setDesc(resolve(desc));
            if (opt.refreshDomOnChange) {
              warn("do not know how to refresh DOM yet")
            }
            if (opt.savePluginOnChange) {
              warn("need app for this feature")
            }
          })
        });

        return componentApi(el,base,global_opt)(name,desc,prop)(s);
    },

    addButton: (o) =>  {
      s.addButton((b: ButtonComponent) => {
        b.setTooltip(o?.tooltip || resolve(desc))
         .setButtonText(o?.buttonText || "+")
         .setCta()
         .onClick(o?.onClick ? o.onClick : () => console.log(`onClick not handled for property ${name}`))  

        if (o?.backgroundColor) {
          b.setClass(`bg-${o.backgroundColor}`)
        }
        if (o?.icon) {
          b.setIcon(o.icon);
        }
      });

      return componentApi(el,base,global_opt)(name,desc,prop)(s);
    },

    done: () => s
});

/**
 * The main API surface provided by the `UiBuilder` which involves
 * picking a `Setting` from **Obsidian** and configuring it.
 */
const inputRow = <
  TBase extends Record<PropertyKey,any>,
  TGlobalOpt extends UiBuilderOptions
>(
  el: HTMLElement, 
  base: TBase,
  global_opt: TGlobalOpt
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

  return componentApi(el,base,global_opt)(name,desc,prop)(s);
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
  TBase extends Record<PropertyKey,any>,
  TGlobalOpt extends UiBuilderOptions
>(
  el: HTMLElement, 
  base: TBase,
  global_opt: UiBuilderOptions = {} as UiBuilderOptions
): UiBuilderApi<TBase, TGlobalOpt> => {
  const { h1, style } = global_opt;
  const context = contextApi(el,base,global_opt);
  const settings: any = inputRow(el,base,global_opt);
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
