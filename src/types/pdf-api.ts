export interface PdfRenderContext {}

export interface PdfPage {
  getViewport: (options?: Record<string, any>) => unknown;
  render: (context: PdfRenderContext) => Promise<void>;
}

export interface PdfDoc {
  getPage: (page: number) => unknown;
}

/**
 * **PdfApi**
 *
 * - [Usage Example](https://mozilla.github.io/pdf.js/examples/index.html#interactive-examples)
 */
export interface PdfApi {
  getDocument: (src: string | URL | ArrayBuffer) => Promise<PdfDoc>;
}
