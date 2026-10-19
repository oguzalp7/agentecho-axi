export interface ToastOptions {
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const TOAST_STYLES = `
  .agentecho-toast-container {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #181d28;
    color: #f8fafc;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 10px 16px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 2147483647;
    pointer-events: all;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
    user-select: none;
    max-width: 90vw;
  }

  .agentecho-toast-container.visible {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }

  .agentecho-toast-text {
    display: flex;
    align-items: center;
    gap: 6px;
    line-height: 1.4;
  }

  .agentecho-toast-action-btn {
    background: #dc2626;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease, transform 0.1s ease;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }

  .agentecho-toast-action-btn:hover {
    background: #b91c1c;
    transform: scale(1.02);
  }

  .agentecho-toast-action-btn:active {
    transform: scale(0.98);
  }

  .agentecho-toast-close-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: color 0.15s;
  }

  .agentecho-toast-close-btn:hover {
    color: #f1f5f9;
  }
`;

export class Toast {
  private shadowRoot: ShadowRoot;
  private element: HTMLElement;
  private messageEl: HTMLElement;
  private actionSlot: HTMLElement;
  private hideTimeout: any = null;

  constructor(shadowRoot: ShadowRoot) {
    this.shadowRoot = shadowRoot;

    const style = document.createElement('style');
    style.textContent = TOAST_STYLES;
    this.shadowRoot.appendChild(style);

    this.element = document.createElement('div');
    this.element.className = 'agentecho-toast-container';

    this.messageEl = document.createElement('div');
    this.messageEl.className = 'agentecho-toast-text';

    this.actionSlot = document.createElement('div');

    const closeBtn = document.createElement('button');
    closeBtn.className = 'agentecho-toast-close-btn';
    closeBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    closeBtn.onclick = () => this.hide();

    this.element.appendChild(this.messageEl);
    this.element.appendChild(this.actionSlot);
    this.element.appendChild(closeBtn);

    this.shadowRoot.appendChild(this.element);
  }

  show(message: string, options?: ToastOptions) {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    this.messageEl.textContent = message;
    this.actionSlot.innerHTML = '';

    if (options?.action) {
      const btn = document.createElement('button');
      btn.className = 'agentecho-toast-action-btn';
      btn.textContent = options.action.label;
      btn.onclick = () => {
        options.action?.onClick();
        this.hide();
      };
      this.actionSlot.appendChild(btn);
    }

    this.element.classList.add('visible');

    const duration = options?.duration ?? 4000;
    if (duration > 0) {
      this.hideTimeout = setTimeout(() => {
        this.hide();
      }, duration);
    }
  }

  hide() {
    this.element.classList.remove('visible');
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
}
