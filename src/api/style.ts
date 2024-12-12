import type { ListStyle, StyleOptions } from "src/types";

/**
 * **style**`(opts)`
 *
 * Allows for expression of various styles you want to be
 * set within some HTML/component you're building.
 */
export function style<T extends StyleOptions<any>>(opts?: T) {
  const fmt = [];
  if (opts?.pb) {
    fmt.push(`padding-bottom: ${opts.pb}`);
  }
  if (opts?.pt) {
    fmt.push(`padding-top: ${opts.pt}`);
  }

  if (opts?.py) {
    fmt.push(`padding-top: ${opts.py}`);
    fmt.push(`padding-bottom: ${opts.py}`);
  }
  if (opts?.px) {
    fmt.push(`padding-left: ${opts.px}`);
    fmt.push(`padding-right: ${opts.px}`);
  }

  if (opts?.pl) {
    fmt.push(`padding-left: ${opts.pl}`);
  }
  if (opts?.pr) {
    fmt.push(`padding-right: ${opts.pr}`);
  }
  if (opts?.p) {
    fmt.push(`padding: ${opts.p}`);
  }

  if (opts?.m) {
    fmt.push(`margin-top: ${opts.m}`);
    fmt.push(`margin-bottom: ${opts.m}`);
    fmt.push(`margin-left: ${opts.m}`);
    fmt.push(`margin-right: ${opts.m}`);
  }
  if (opts?.mb) {
    fmt.push(`margin-bottom: ${opts.mb}`);
  }
  if (opts?.mt) {
    fmt.push(`margin-top: ${opts.mt}`);
  }
  if (opts?.my) {
    fmt.push(`margin-top: ${opts.mx}`);
    fmt.push(`margin-bottom: ${opts.mx}`);
  }
  if (opts?.mx) {
    fmt.push(`margin-left: ${opts.mx}`);
    fmt.push(`margin-right: ${opts.mx}`);
  }
  if (opts?.ml) {
    fmt.push(`margin-left: ${opts.ml}`);
  }
  if (opts?.mr) {
    fmt.push(`margin-right: ${opts.mr}`);
  }
  if (opts?.bespoke) {
    fmt.push(...opts.bespoke);
  }
  if (opts?.w) {
    fmt.push(`weight: ${opts.w}`);
  }
  if (opts?.fw) {
    fmt.push(`font-weight: ${opts.fw}`);
  }
  if (opts?.fs) {
    fmt.push(`font-style: ${opts.fs}`);
  }
  if (opts?.ts) {
    switch (opts.ts) {
      case "xs":
        fmt.push(`font-size: 0.75rem`);
        fmt.push(`line-height: 1rem`);
        break;
      case "sm":
        fmt.push(`font-size: 0.875rem`);
        fmt.push(`line-height: 1.25rem`);
        break;
      case "base":
        fmt.push(`font-size: 1rem`);
        fmt.push(`line-height: 1.5rem`);
        break;
      case "lg":
        fmt.push(`font-size: 1.125rem`);
        fmt.push(`line-height: 1.75rem`);
        break;
      case "xl":
        fmt.push(`font-size: 1.25rem`);
        fmt.push(`line-height: 1.75rem`);
        break;
      case "2xl":
        fmt.push(`font-size: 1.5rem`);
        fmt.push(`line-height: 2rem`);
        break;
      default:
        fmt.push(`font-size: ${opts.ts}`);
        fmt.push(`line-height: auto`);
    }
  }
  if (opts?.flex) {
    fmt.push(`display: flex`);
  }
  if (opts?.direction) {
    fmt.push(`flex-direction: ${opts.direction}`);
  }
  if (opts?.grow) {
    fmt.push(`flex-grow: ${opts.grow}`);
  }
  if (opts?.gap) {
    fmt.push(`gap: ${opts.gap}`);
  }
  if (opts?.cursor) {
    fmt.push(`cursor: ${opts.cursor}`);
  }
  if (opts?.alignItems) {
    fmt.push(`align-items: ${opts.alignItems}`);
  }
  if (opts?.justifyItems) {
    fmt.push(`justify-items: ${opts.justifyItems}`);
  }
  if (opts?.justifyContent) {
    fmt.push(`justify-content: ${opts.justifyContent}`);
  }
  if (opts?.position) {
    fmt.push(`position: ${opts.position}`);
  }
  if (opts?.display) {
    fmt.push(`display: ${opts.display}`);
  }
  if (opts?.opacity) {
    fmt.push(`opacity: ${opts.opacity}`);
  }

  return fmt.length === 0 ? `style=""` : `style="${fmt.join("; ")}"`;
}

export function listStyle(opts: ListStyle = {}) {
  const fmt: string[] = [];

  if (opts?.indentation && opts.indentation !== "default") {
    switch (opts.indentation) {
      case "24px":
        fmt.push(`padding-inline-start: 24px`);
        break;
      case "20px":
        fmt.push(`padding-inline-start: 20px`);
        break;
      case "16px":
        fmt.push(`padding-inline-start: 16px`);
        break;
      case "12px":
        fmt.push(`padding-inline-start: 12px`);
        break;
      case "none":
        fmt.push(`padding-inline-start: 0px`);
        break;
    }
  }

  if (opts?.mt && opts.mt !== "default") {
    fmt.push(
      `margin-block-start: ${opts.mt === "tight" ? "2px" : opts.mt === "none" ? "0px" : opts.mt === "spaced" ? "1.5rem" : opts.mt}`,
    );
  }

  if (opts?.mb && opts.mb !== "default") {
    fmt.push(
      `margin-block-end: ${opts.mb === "tight" ? "2px" : opts.mb === "none" ? "0px" : opts.mb === "spaced" ? "1.5rem" : opts.mb}`,
    );
  }

  if (opts?.my && opts.my !== "default") {
    fmt.push(
      `margin-block-start: ${opts.my === "tight" ? "2px" : opts.my === "none" ? "0px" : opts.my === "spaced" ? "1.5rem" : opts.my}`,
    );
    fmt.push(
      `margin-block-end: ${opts.my === "tight" ? "2px" : opts.my === "none" ? "0px" : opts.my === "spaced" ? "1.5rem" : opts.my}`,
    );
  }

  return fmt.length === 0 ? `style=""` : `style="${fmt.join("; ")}"`;
}
