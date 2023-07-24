import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import elementCSS from "./item.css?inline";

@customElement(`ms-item`)
export class MagicScrollItem extends LitElement {
  render() {
    return html` <slot></slot> `;
  }

  static styles = [css([elementCSS] as any)];
}

declare global {
  interface HTMLElementTagNameMap {
    "ms-item": MagicScrollItem;
  }
}
