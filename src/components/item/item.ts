import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import elementCSS from "./item.css?inline";

type CSSStringOrFunction = string | ((scroll: number) => string);

@customElement(`ms-item`)
export class MagicScrollItem extends LitElement {
  static styles = [unsafeCSS(elementCSS)];

  #pageIndex = 0;
  get pageIndex() {
    return this.#pageIndex;
  }
  @property({ type: Number, attribute: "page-index" }) set pageIndex(
    value: number
  ) {
    this.#pageIndex = value;
    this.style.setProperty("--page-index", value.toString());
  }

  #transform: CSSStringOrFunction = "";
  get transform() {
    return this.#transform;
  }
  @property() set transform(value: CSSStringOrFunction) {
    this.#transform = value;
    this.#updateTransform();
  }

  get #actualTransform() {
    const transform = this.transform;
    switch (typeof transform) {
      case "string":
        return transform;
      case "function":
        return transform(+getComputedStyle(this).getPropertyValue("--scroll"));
      default:
        return "";
    }
  }

  render() {
    return html` <slot></slot> `;
  }

  #updateTransform() {
    this.style.transform = this.#actualTransform;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ms-item": MagicScrollItem;
  }
}
