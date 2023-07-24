import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import elementCSS from "./container.css?inline";

@customElement(`ms-container`)
export class MagicScrollContainer extends LitElement {
  render() {
    return html` <slot></slot> `;
  }

  static styles = [css([elementCSS] as any)];
}

declare global {
  interface HTMLElementTagNameMap {
    "ms-container": MagicScrollContainer;
  }
}
