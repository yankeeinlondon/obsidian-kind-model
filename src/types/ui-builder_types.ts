import type {
  App,
  ButtonComponent,
  ColorComponent,
  SearchComponent,
  Setting,
  SliderComponent,
  TextComponent,
  ToggleComponent,
} from "obsidian";

export type Callback<
  T extends unknown[] = [],
  R = void,
> = (...args: T) => R;

export type ChangeCallback<
  TArgs extends any[] = [],
  TReturn = void,
> = <
  TBase extends Record<PropertyKey, any>,
  TProp extends keyof TBase,
>(base: TBase,
  prop: TProp
) => Callback<TArgs, TReturn>;

export type AnyComponent = TextComponent | SliderComponent | ButtonComponent | ColorComponent | SearchComponent | ToggleComponent;

export type ComponentCallback<T extends AnyComponent> = Callback<
  [T],
  void
>;

export type EventHandler = <
  TBase extends Record<PropertyKey, any>,
  TProp extends keyof TBase | null,
  TOpt extends BaseInputOptions,
>(base: TBase,
  prop: TProp,
  opt?: TOpt,
  change_cb?: ChangeCallback) => <
  TComponent extends AnyComponent,
>(component_cb: ComponentCallback<TComponent>
) => void;

export type MaybeLazy<T> = T | (() => T);

export interface BaseInputOptions {
  savePluginOnChange?: boolean;
  refreshDomOnChange?: boolean;
  icon?: string;
}

export type BgColor = "red" | "purple" | "blue" | "sky" | "indigo" | "green";

export interface ButtonOptions extends BaseInputOptions {
  onClick?: Callback<[MouseEvent]>;
  buttonText?: string;
  tooltip?: string;
  backgroundColor?: BgColor;
  textColor?: "light" | "dark";
}

export interface TextInputOptions extends BaseInputOptions {};
export interface DropdownOptions extends BaseInputOptions {};
export interface ToggleSwitchOptions extends BaseInputOptions {};
export interface FolderSearchOptions extends BaseInputOptions {
  placeholder?: string;
};

export interface UiBuilderComponentApi<
  TBase extends Record<string, any>,
  TProp extends keyof TBase | null,
  TGlobalOpt extends UiBuilderOptions,
> {
  addDropdown: <TChoices extends string[] | Record<string, any>>(choices: TChoices, opt?: DropdownOptions) => UiBuilderComponentApi<TBase, TProp, TGlobalOpt>;
  addToggleSwitch: (opt?: ToggleSwitchOptions) => UiBuilderComponentApi<TBase, TProp, TGlobalOpt>;
  addTextInput: (opt?: TextInputOptions) => UiBuilderComponentApi<TBase, TProp, TGlobalOpt>;
  addFolderSearch: (opt?: FolderSearchOptions) => UiBuilderComponentApi<TBase, TProp, TGlobalOpt>;
  addButton: (opt?: ButtonOptions) => UiBuilderComponentApi<TBase, TProp, TGlobalOpt>;

  done: () => Setting;
}

export interface UiBuilderContextApi<
  TBase extends Record<string, any>,
  TGlobalOpt extends UiBuilderOptions,
> {
  /**
   * Add a section descriptor between previous and next set of inputs
   */
  sectionHeading: <THeading extends string>(
    /** adds an H2 header element */
    heading: THeading,
    /** optionally adds a paragraph block under the H2 heading */
    sub_text?: string
  ) => SectionBuilder<THeading, TBase, TGlobalOpt>;

  /**
   * **IterateOver(prop,name,title, cb)**
   *
   * Allows you to build out a set of properties from a _property_
   * included in your current state.
   *
   * - each item contained in the `prop` property will be iterated over
   * - you will need to provide a callback function
   */
  iterateOver: <
    TIterator extends keyof TBase,
    TContainer extends TBase[TIterator] & (any[] | object),
  >(prop: TIterator,
    cb: Callback<[TContainer], Setting>
  ) => Setting[];
}

/**
 * **UiBuilderFn(name, desc, prop, **
 */
export type UiBuilderFn<
  TBase extends Record<PropertyKey, any>,
  TGlobalOpt extends UiBuilderOptions,
> = <TProp extends keyof TBase | null>(
  /** name of the input property  */
  name: MaybeLazy<string>,
  /** description of the input property (below name) */
  desc: MaybeLazy<string>,
  /** the property off of the base container you'll mutate */
  prop: TProp,
  /**
   * if the property being mutated is a container than you can set
   * `idx` to mutate a specific index of that prop
   */
  idx?: TProp extends null
    ? never
    : TProp extends keyof TBase
      ? PropertyKey
      : never
) => UiBuilderComponentApi<TBase, TProp, TGlobalOpt>;

export type SectionBuilder<
  TSection extends string,
  TBase extends Record<PropertyKey, any>,
  TGlobalOpt extends UiBuilderOptions,
> = UiBuilderFn<TBase, TGlobalOpt> & { section: TSection };

export type UiBuilderContext<
  TBase extends Record<PropertyKey, any>,
  TGlobalOpt extends UiBuilderOptions,
> =
  UiBuilderContextApi<TBase, TGlobalOpt> & (
  <TProp extends keyof TBase | null>
  (
    name: MaybeLazy<string>,
    desc: MaybeLazy<string>,
    prop: TProp
  ) => UiBuilderComponentApi<TBase, TProp, TGlobalOpt>
);

export interface UiBuilderOptions {
  h1?: string;
  style?: string;
  app?: App;
  saveState?: () => Promise<unknown>;
}

/**
 * **UiBuilder`<T>`**
 *
 * 1. Provides a function call which is used to place any input element:
 *    ```ts
 *    ui(name, desc, property) => Setting
 *    ```
 * 2. Provides a small API surface for UI elements which are _not_ an
 * **Obsidian** `Setting` component.
 */
export type UiBuilderApi<
  TBase extends Record<PropertyKey, any>,
  TGlobalOpt extends UiBuilderOptions,
> = UiBuilderContext<TBase, TGlobalOpt> & UiBuilderFn<TBase, TGlobalOpt>;
