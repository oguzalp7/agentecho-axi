import type { ExtensionSettings } from '../../shared/types';

const TOOLBAR_STYLES = `
  .agentecho-toolbar {
    position: fixed;
    top: 16px;
    left: calc(100vw - 320px);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    background: #1f2937;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 2147483646;
    pointer-events: all;
    cursor: move;
    user-select: none;
  }

  .agentecho-toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: none;
    border-radius: 6px;
    background: #374151;
    color: #f9fafb;
    cursor: pointer;
    transition: all 0.15s ease-out;
  }

  .agentecho-toolbar-btn:hover {
    background: #4b5563;
  }

  .agentecho-toolbar-btn:active {
    transform: scale(0.95);
  }

  .agentecho-toolbar-btn svg {
    width: 18px;
    height: 18px;
  }

  .agentecho-toolbar-btn.active {
    background: #3b82f6;
  }

  .agentecho-toolbar-label {
    color: #f9fafb;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 0 8px;
  }

  .agentecho-toolbar-divider {
    width: 1px;
    height: 24px;
    background: #4b5563;
  }

  @keyframes agentecho-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .agentecho-toolbar-btn.sync {
    background: #0284c7;
  }

  .agentecho-toolbar-btn.sync:hover {
    background: #0369a1;
  }
`;

const ICONS = {
  pause: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  sync: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  spinner: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: agentecho-spin 1s linear infinite"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
  // exit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>`,
};

export class Toolbar {
  private element: HTMLElement;
  private pauseBtn!: HTMLButtonElement;
  private eyeBtn!: HTMLButtonElement;
  private syncBtn!: HTMLButtonElement;
  private copyBtn!: HTMLButtonElement;
  private clearBtn!: HTMLButtonElement;

  onPauseToggle?: () => void;
  onMarkersToggle?: () => void;
  onSync?: () => void;
  onCopy?: () => void;
  onClear?: () => void;
  onExit?: () => void;

  constructor(shadowRoot: ShadowRoot, _settings: ExtensionSettings) {
    const style = document.createElement('style');
    style.textContent = TOOLBAR_STYLES;
    shadowRoot.appendChild(style);

    this.element = this.createToolbar();
    shadowRoot.appendChild(this.element);

    this.setupDragListeners();
  }

  private setupDragListeners() {
    let isDragging = false;
    let currentX: number;
    let currentY: number;
    let initialX: number;
    let initialY: number;
    let xOffset = 0;
    let yOffset = 0;

    const dragStart = (e: MouseEvent) => {
      // Don't start dragging if clicking a button
      if ((e.target as HTMLElement).closest('button')) return;

      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;

      if (e.target === this.element) {
        isDragging = true;
      }
    };

    const dragEnd = () => {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    };

    const drag = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        this.setTranslate(currentX, currentY, this.element);
      }
    };

    this.element.addEventListener('mousedown', dragStart);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);
  }

  private setTranslate(xPos: number, yPos: number, el: HTMLElement) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }

  private createToolbar(): HTMLElement {
    const toolbar = document.createElement('div');
    toolbar.className = 'agentecho-toolbar';

    this.pauseBtn = this.createButton('pause', 'Durdur / Devam Et (Pause/Play)');
    this.pauseBtn.onclick = () => {
      this.onPauseToggle?.();
    };

    this.eyeBtn = this.createButton('eye', 'Rozetleri Göster/Gizle (Toggle Markers)');
    this.eyeBtn.classList.add('active');
    this.eyeBtn.onclick = () => {
      this.onMarkersToggle?.();
    };

    const divider1 = document.createElement('div');
    divider1.className = 'agentecho-toolbar-divider';

    this.syncBtn = this.createButton('sync', '🚀 Sync to Edge (Ajanlara Gönder & Temizle)');
    this.syncBtn.classList.add('sync');
    this.syncBtn.onclick = () => this.onSync?.();

    this.copyBtn = this.createButton('copy', 'AXI Direktiflerini Kopyala (Copy AXI Directives)');
    this.copyBtn.onclick = () => this.onCopy?.();

    this.clearBtn = this.createButton('trash', 'Tüm İşaretleri Temizle (Clear All)');
    this.clearBtn.onclick = () => {
      this.showClearFeedback();
      this.onClear?.();
    };

    const divider2 = document.createElement('div');
    divider2.className = 'agentecho-toolbar-divider';

    toolbar.appendChild(this.pauseBtn);
    toolbar.appendChild(this.eyeBtn);
    toolbar.appendChild(divider1);
    toolbar.appendChild(this.syncBtn);
    toolbar.appendChild(this.copyBtn);
    toolbar.appendChild(this.clearBtn);
    toolbar.appendChild(divider2);

    return toolbar;
  }

  private createButton(iconKey: keyof typeof ICONS, title: string): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = 'agentecho-toolbar-btn';
    btn.title = title;
    btn.innerHTML = ICONS[iconKey];
    return btn;
  }

  setPaused(paused: boolean) {
    if (this.pauseBtn) {
      this.pauseBtn.innerHTML = paused ? ICONS.play : ICONS.pause;
      this.pauseBtn.title = paused ? 'Devam Et (Resume)' : 'Durdur (Pause)';
    }
  }

  setMarkersVisible(visible: boolean) {
    if (this.eyeBtn) {
      this.eyeBtn.innerHTML = visible ? ICONS.eye : ICONS.eyeOff;
      if (visible) {
        this.eyeBtn.classList.add('active');
      } else {
        this.eyeBtn.classList.remove('active');
      }
    }
  }

  showCopySuccess() {
    if (this.copyBtn) {
      const originalIcon = this.copyBtn.innerHTML;
      this.copyBtn.innerHTML = ICONS.check;
      this.copyBtn.style.background = '#22c55e';
      setTimeout(() => {
        this.copyBtn.innerHTML = originalIcon;
        this.copyBtn.style.background = '';
      }, 1500);
    }
  }

  showClearFeedback() {
    if (this.clearBtn) {
      this.clearBtn.style.background = '#ef4444';
      setTimeout(() => {
        this.clearBtn.style.background = '';
      }, 500);
    }
  }

  setSyncLoading(loading: boolean) {
    if (this.syncBtn) {
      if (loading) {
        this.syncBtn.innerHTML = ICONS.spinner;
        this.syncBtn.disabled = true;
        this.syncBtn.style.opacity = '0.7';
      } else {
        this.syncBtn.innerHTML = ICONS.sync;
        this.syncBtn.disabled = false;
        this.syncBtn.style.opacity = '1';
      }
    }
  }

  showSyncSuccess() {
    if (this.syncBtn) {
      this.syncBtn.innerHTML = ICONS.check;
      this.syncBtn.style.background = '#22c55e';
      setTimeout(() => {
        this.syncBtn.innerHTML = ICONS.sync;
        this.syncBtn.style.background = '';
      }, 2000);
    }
  }

  showSyncError() {
    if (this.syncBtn) {
      this.syncBtn.style.background = '#ef4444';
      setTimeout(() => {
        this.syncBtn.style.background = '';
      }, 2000);
    }
  }
}
