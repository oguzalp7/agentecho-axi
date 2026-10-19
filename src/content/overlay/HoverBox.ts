const HOVER_BOX_STYLES = `
  .agentecho-hover-box {
    position: fixed !important;
    border: 2px solid #3b82f6 !important;
    background-color: rgba(59, 130, 246, 0.15) !important;
    pointer-events: none !important;
    transition: all 0.05s ease-out;
    z-index: 2147483646 !important;
    box-sizing: border-box !important;
    border-radius: 4px;
    display: none;
  }
`;

export class HoverBox {
  private element: HTMLElement;
  private currentElement: HTMLElement | null = null;

  constructor(shadowRoot: ShadowRoot) {
    this.element = document.createElement('div');
    this.element.className = 'agentecho-hover-box';

    const style = document.createElement('style');
    style.textContent = HOVER_BOX_STYLES;
    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.element);
  }

  show(target: HTMLElement) {
    if (this.currentElement === target) return;
    this.currentElement = target;
    const rect = target.getBoundingClientRect();

    // Guard against zero-size or off-screen elements
    if (rect.width <= 0 && rect.height <= 0) {
      this.hide();
      return;
    }

    this.element.style.top = `${rect.top}px`;
    this.element.style.left = `${rect.left}px`;
    this.element.style.width = `${rect.width}px`;
    this.element.style.height = `${rect.height}px`;
    this.element.style.display = 'block';
  }

  hide() {
    this.element.style.display = 'none';
    this.currentElement = null;
  }
}
