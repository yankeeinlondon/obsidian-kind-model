interface CssVar<T extends string> {
  /** The CSS Variable name */
  variable: `${T}`;
  /** Get the current value of this variable from the runtime environment */
  getValue: () => string;
}

/** @description https://docs.obsidian.md/Reference/CSS+variables/CSS+variables */
interface ObsidianCssVars {
  // Foundations: Colors
  /** Primary background color */
  backgroundPrimary: CssVar<`--background-primary`>;
  /** Secondary background color */
  backgroundSecondary: CssVar<`--background-secondary`>;
  /** Color used for accents */
  accentColor: CssVar<`--accent-color`>;
  /** Normal text color */
  textNormal: CssVar<`--text-normal`>;
  /** Muted text color */
  textMuted: CssVar<`--text-muted`>;
  /** Faint text color */
  textFaint: CssVar<`--text-faint`>;
  /** Color for success messages */
  textSuccess: CssVar<`--text-success`>;
  /** Color for warning messages */
  textWarning: CssVar<`--text-warning`>;
  /** Color for error messages */
  textError: CssVar<`--text-error`>;

  // Foundations: Typography
  /** Font used for UI elements */
  fontInterface: CssVar<`--font-interface-theme`>;
  /** Font used for text in the editor */
  fontText: CssVar<`--font-text-theme`>;
  /** Font used for monospaced content */
  fontMonospace: CssVar<`--font-monospace-theme`>;
  /** Regular text weight */
  fontWeight: CssVar<`--font-weight`>;
  /** Bold text font weight */
  boldWeight: CssVar<`--bold-weight`>;
  /** Bold text color */
  boldColor: CssVar<`--bold-color`>;
  /** Italic text color */
  italicColor: CssVar<`--italic-color`>;

  // Editor: Code
  /** Background color for code blocks */
  codeBackground: CssVar<`--code-background`>;
  /** Font size for code */
  codeSize: CssVar<`--code-size`>;
  /** Color for code comments */
  codeComment: CssVar<`--code-comment`>;
  /** Color for code functions */
  codeFunction: CssVar<`--code-function`>;
  /** Color for code keywords */
  codeKeyword: CssVar<`--code-keyword`>;
  /** Color for code strings */
  codeString: CssVar<`--code-string`>;

  // Editor: Lists
  /** Indentation width for nested list items */
  listIndent: CssVar<`--list-indent`>;
  /** Vertical spacing between list items */
  listSpacing: CssVar<`--list-spacing`>;
  /** Color of list markers */
  listMarkerColor: CssVar<`--list-marker-color`>;

  // Window: Status Bar
  /** Background color of the status bar */
  statusbarBackground: CssVar<`--statusbar-background`>;
  /** Foreground color of the status bar */
  statusbarForeground: CssVar<`--statusbar-foreground`>;

  // Add more variables as needed
}
