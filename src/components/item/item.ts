import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import elementCSS from "./item.css?inline";

type StyleFunction = (args: {
  pageScrollRatio: number;
  scrollRatio: number;
  pageIndex: number;
  canvasHeight: number;
  canvasWidth: number;
}) => Record<string, string>;
type CSSStringOrStyleFunction = string | StyleFunction;

@customElement(`ms-item`)
export class MagicScrollItem extends LitElement {
  readonly #staticStyleSheets = [unsafeCSS(elementCSS).styleSheet].filter(
    Boolean
  ) as CSSStyleSheet[];

  readonly #dynamicStyleSheet = new CSSStyleSheet();

  #pageIndex = 0;
  get pageIndex() {
    return this.#pageIndex;
  }
  @property({ type: Number, attribute: "page-index" }) set pageIndex(
    value: number
  ) {
    this.#pageIndex = value;
    this.style.setProperty("--ms-page-index", value.toString());
  }

  #styleFn: CSSStringOrStyleFunction = "";
  get styleFn() {
    return this.#styleFn;
  }
  @property({ attribute: "style-fn" }) set styleFn(
    value: CSSStringOrStyleFunction
  ) {
    if (typeof value === "string" && value === this.#styleFn) {
      return;
    }
    this.#styleFn = value;
    this.updateStyle();
  }

  #fillPageHeight = false;
  get fillPageHeight() {
    return this.#fillPageHeight;
  }
  @property({ attribute: "fill-page-height", type: Boolean })
  set fillPageHeight(value: boolean) {
    this.#fillPageHeight = value;
    this.style.height = value ? "var(--ms-canvas-height)" : "fit-content";
  }

  /**
   * @internal
   */
  updateStyle() {
    if (!this.shadowRoot) {
      return;
    }
    let styleCSSString = "";
    switch (typeof this.styleFn) {
      case "string":
        styleCSSString = this.styleFn;
        break;
      case "function":
        const scrollRatio =
          +getComputedStyle(this).getPropertyValue("--ms-scroll-ratio");
        const pageScrollRatio = scrollRatio - this.#pageIndex;
        const canvasHeight = this.parentElement?.clientHeight ?? Number.NaN;
        const canvasWidth = this.parentElement?.clientWidth ?? Number.NaN;
        const itemObject = this;
        styleCSSString = Object.entries(
          (this.styleFn as StyleFunction)({
            get pageIndex(): number {
              return itemObject.pageIndex;
            },
            get pageScrollRatio() {
              return pageScrollRatio;
            },
            get scrollRatio() {
              return scrollRatio;
            },
            get canvasHeight() {
              return canvasHeight;
            },
            get canvasWidth() {
              return canvasWidth;
            },
          }) ?? {}
        )
          .map(([key, value]) => `${this.#camelToKebab(key)}: ${value};`)
          .join("\n");
        break;
    }
    this.#dynamicStyleSheet.replaceSync(/* css */ `
      slot {
        ${styleCSSString}
      }
    `);
  }

  firstUpdated() {
    if (this.shadowRoot) {
      this.shadowRoot.adoptedStyleSheets = [
        ...this.#staticStyleSheets,
        this.#dynamicStyleSheet,
      ];
    }
    this.updateStyle();
  }

  render() {
    return html` <slot></slot> `;
  }

  #camelToKebab(text: string) {
    return text.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ms-item": MagicScrollItem;
  }
}
