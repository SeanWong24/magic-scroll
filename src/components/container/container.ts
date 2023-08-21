import { LitElement, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import elementCSS from "./container.css?inline";

const itemTag = `ms-item`;

@customElement(`ms-container`)
export class MagicScrollContainer extends LitElement {
  static styles = [unsafeCSS(elementCSS)];

  firstUpdated() {
    this.#updateCanvasSize();
  }

  constructor() {
    super();
    this.#setCanvasSizeWhenResized();
    this.addEventListener(
      "scroll",
      ({ currentTarget }) => currentTarget === this && this.#updateScrollRatio()
    );
  }

  render() {
    return html` <slot></slot> `;
  }

  #setCanvasSizeWhenResized() {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this) {
          this.#updateCanvasSize();
        }
      }
    });
    resizeObserver.observe(this);
  }

  #updateCanvasSize() {
    const height = this.clientHeight;
    this.style.setProperty("--ms-canvas-height", `${height}px`);
    const width = this.clientWidth;
    this.style.setProperty("--ms-canvas-width", `${width}px`);
  }

  #updateScrollRatio() {
    const scrollRatio = this.scrollTop / this.clientHeight;
    this.style.setProperty("--ms-scroll-ratio", scrollRatio.toString());
    const items = this.querySelectorAll(itemTag);
    items.forEach((item) => item.updateStyle());
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ms-container": MagicScrollContainer;
  }
}
