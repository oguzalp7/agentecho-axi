import { HoverBox } from './HoverBox';
import { MarkerManager } from './MarkerManager';
import { Toolbar } from './Toolbar';
import { FeedbackModal } from './FeedbackModal';
import { Toast } from './Toast';
import { ElementAnalyzer } from '../analyzers/ElementAnalyzer';
import type { ExtensionSettings, FeedbackItem } from '../../shared/types';
import type { FeedbackManager } from '../feedback/FeedbackManager';
import { sendMessage } from '../../shared/messaging';

const OVERLAY_STYLES = `
  :host {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    pointer-events: none !important;
    z-index: 2147483647 !important;
    display: block !important;
  }

  :host(.blocking) {
    pointer-events: all !important;
    cursor: crosshair !important;
  }

  .agentecho-overlay-container {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    pointer-events: none !important;
    z-index: 2147483647 !important;
  }

  .agentecho-block-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: transparent !important;
    pointer-events: all !important;
    z-index: 2147483640 !important;
  }
`;

export class Overlay {
  private container: HTMLElement;
  private shadowRoot: ShadowRoot;
  private blockOverlay: HTMLElement | null = null;
  private hoverBox: HoverBox;
  private markerManager: MarkerManager;
  private toolbar: Toolbar;
  private toast: Toast;
  private feedbackModal: FeedbackModal;
  private elementAnalyzer: ElementAnalyzer;
  private feedbackManager: FeedbackManager;
  private settings: ExtensionSettings;
  public isActive = false;
  private isPaused = false;
  private markersVisible = true;
  private targetElement: HTMLElement | null = null;
  private isModalOpen = false;

  constructor(settings: ExtensionSettings, feedbackManager: FeedbackManager) {
    this.settings = settings;
    this.feedbackManager = feedbackManager;

    this.container = document.createElement('div');
    this.container.className = 'agentecho-overlay-container';
    this.container.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; pointer-events: none !important; z-index: 2147483647 !important; display: block !important;';
    this.shadowRoot = this.container.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = OVERLAY_STYLES;
    this.shadowRoot.appendChild(style);

    this.hoverBox = new HoverBox(this.shadowRoot);
    this.markerManager = new MarkerManager(this.shadowRoot, settings, {
      onEdit: (id) => this.handleEditFeedback(id),
      onDelete: (id) => this.handleDeleteFeedback(id),
    });
    this.toolbar = new Toolbar(this.shadowRoot, settings);
    this.toast = new Toast(this.shadowRoot);
    this.feedbackModal = new FeedbackModal(this.shadowRoot);
    this.elementAnalyzer = new ElementAnalyzer();

    this.setupToolbarListeners();
    this.loadExistingMarkers();

    // Apply block interactions setting
    if (this.settings.blockInteractions) {
      this.enableBlockingMode();
    }
  }

  private setupEventListeners() {
    this.removeEventListeners();
    document.addEventListener('mousemove', this.handleMouseMove, true);
    document.addEventListener('click', this.handleClick, true);
  }

  private removeEventListeners() {
    document.removeEventListener('mousemove', this.handleMouseMove, true);
    document.removeEventListener('click', this.handleClick, true);
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isActive || this.isPaused || this.isModalOpen) return;

    let target: HTMLElement | null = null;

    // Use elementFromPoint or e.target
    const pointElement = document.elementFromPoint(e.clientX, e.clientY);
    if (pointElement && pointElement !== this.container && pointElement !== this.blockOverlay && !this.shadowRoot.contains(pointElement)) {
      target = pointElement instanceof HTMLElement ? pointElement : pointElement.parentElement;
    }

    if (!target && e.target && e.target !== this.container && !this.shadowRoot.contains(e.target as Node)) {
      target = e.target instanceof HTMLElement ? e.target : (e.target as any)?.parentElement;
    }

    if (!target || target === document.body || target === document.documentElement) {
      this.hoverBox.hide();
      this.targetElement = null;
      return;
    }

    this.hoverBox.show(target);
    this.targetElement = target;
  };

  private handleResize = () => {
    if (this.isActive && !this.isPaused) {
      this.markerManager.updatePositions(this.feedbackManager.getAll());
    }
  };

  private handleScroll = () => {
    if (this.isActive && !this.isPaused) {
      this.markerManager.updatePositions(this.feedbackManager.getAll());
      if (this.targetElement) {
        this.hoverBox.show(this.targetElement);
      }
    }
  };

  private handleClick = (e: MouseEvent) => {
    if (!this.isActive || this.isPaused || this.isModalOpen) return;

    const target = e.target as HTMLElement;

    // Check if click is inside our shadow DOM (toolbar, markers, etc.)
    if (this.shadowRoot.contains(target) || target === this.container) {
      return;
    }

    // Determine click target
    let clickTarget = this.targetElement;
    if (!clickTarget && target && target !== document.body && target !== document.documentElement) {
      clickTarget = target instanceof HTMLElement ? target : (target as any)?.parentElement;
    }

    if (clickTarget) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      this.promptForFeedback(clickTarget);
      return;
    }

    if (this.settings.blockInteractions || target === this.blockOverlay) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }
  };

  private async promptForFeedback(element: HTMLElement) {
    this.isModalOpen = true;
    this.hoverBox.hide();

    const result = await this.feedbackModal.show(element);
    this.isModalOpen = false;

    if (!result) return;

    const elementInfo = this.elementAnalyzer.analyze(element);
    const feedback: FeedbackItem = {
      id: crypto.randomUUID(),
      index: this.feedbackManager.getAll().length + 1,
      comment: result.comment,
      action: result.action,
      timestamp: Date.now(),
      url: window.location.href,
      element: elementInfo,
    };

    this.feedbackManager.add(feedback);
    this.markerManager.addMarker(feedback);
  }

  private async handleEditFeedback(id: string) {
    const feedback = this.feedbackManager.getAll().find(f => f.id === id);
    if (!feedback) return;

    // Find the element again using the selector
    const element = document.querySelector(feedback.element.selector) as HTMLElement;
    if (!element) {
      // Element no longer exists, use a placeholder
      const placeholder = document.createElement('div');
      placeholder.textContent = 'Element not found';
      this.isModalOpen = true;
      const result = await this.feedbackModal.show(placeholder, feedback.comment, feedback.action);
      this.isModalOpen = false;

      if (result) {
        this.feedbackManager.update(id, { comment: result.comment, action: result.action });
        this.markerManager.updateMarkerTooltip(id, result.comment, result.action);
      }
      return;
    }

    this.isModalOpen = true;
    const result = await this.feedbackModal.show(element, feedback.comment, feedback.action);
    this.isModalOpen = false;

    if (result) {
      this.feedbackManager.update(id, { comment: result.comment, action: result.action });
      this.markerManager.updateMarkerTooltip(id, result.comment, result.action);
    }
  }

  private handleDeleteFeedback(id: string) {
    this.feedbackManager.remove(id);
    this.markerManager.removeMarker(id);
    // Re-index remaining markers
    this.reindexMarkers();
  }

  private reindexMarkers() {
    const allFeedback = this.feedbackManager.getAll();
    allFeedback.forEach((feedback, index) => {
      feedback.index = index + 1;
    });
    // Update storage
    this.feedbackManager.save();
    // Refresh markers
    this.markerManager.clearAll();
    allFeedback.forEach((item) => {
      this.markerManager.addMarker(item);
    });
  }

  private setupToolbarListeners() {
    this.toolbar.onPauseToggle = () => this.togglePause();
    this.toolbar.onMarkersToggle = () => this.toggleMarkers();
    this.toolbar.onSync = () => this.syncToEdge();
    this.toolbar.onCopy = () => this.copyFeedback();
    this.toolbar.onClear = () => this.clearAll();
    this.toolbar.onExit = () => this.deactivate();
  }

  public loadExistingMarkers() {
    const feedback = this.feedbackManager.getAll();
    feedback.forEach((item) => {
      this.markerManager.addMarker(item);
    });
  }

  private enableBlockingMode() {
    this.container.classList.add('blocking');
    if (!this.blockOverlay) {
      this.blockOverlay = document.createElement('div');
      this.blockOverlay.className = 'agentecho-block-overlay';
      this.shadowRoot.appendChild(this.blockOverlay);
    }
  }

  private disableBlockingMode() {
    this.container.classList.remove('blocking');
    if (this.blockOverlay) {
      this.blockOverlay.remove();
      this.blockOverlay = null;
    }
  }

  activate() {
    this.isActive = true;
    this.setupEventListeners();
    const mountTarget = document.documentElement || document.body;
    mountTarget.appendChild(this.container);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    // Initial update to fix position if layout changed since save
    requestAnimationFrame(() => {
      try {
        this.markerManager.updatePositions(this.feedbackManager.getAll());
      } catch (e) {
        console.error('Failed to update marker positions:', e);
      }
    });
  }

  deactivate() {
    this.isActive = false;
    this.removeEventListeners();
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    this.container.remove();
    sendMessage({ type: 'SET_STATE', state: { isActive: false } }).catch(console.error);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.toolbar.setPaused(this.isPaused);
    if (this.isPaused) {
      this.hoverBox.hide();
      this.targetElement = null;
    }
  }

  toggleMarkers() {
    this.markersVisible = !this.markersVisible;
    this.markerManager.setVisible(this.markersVisible);
    this.toolbar.setMarkersVisible(this.markersVisible);
    if (this.markersVisible) {
      this.markerManager.updatePositions(this.feedbackManager.getAll());
      this.toast.show('👁️ Rozetler görünür yapıldı.', { type: 'info', duration: 1500 });
    } else {
      this.toast.show('👁️ Rozetler gizlendi.', { type: 'info', duration: 1500 });
    }
  }

  async syncToEdge() {
    const items = this.feedbackManager.getAll();
    if (items.length === 0) {
      this.toast.show('⚠️ Gönderilecek herhangi bir feedback bulunamadı.', { type: 'warning', duration: 2500 });
      return;
    }

    this.toolbar.setSyncLoading(true);
    this.toast.show(`🚀 ${items.length} adet feedback Edge Bridge'e aktarılıyor...`, { type: 'info', duration: 3000 });

    try {
      const payload = {
        url: window.location.href,
        timestamp: Date.now(),
        feedbacks: items,
      };

      const response = await fetch('http://localhost:3888/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.toolbar.setSyncLoading(false);
      this.toolbar.showSyncSuccess();

      const count = items.length;
      // Immediate Drain: wipe storage and markers
      this.clearAll();

      this.toast.show(`✨ ${count} adet feedback Edge pipeline'ına başarıyla aktarıldı ve ekran temizlendi!`, {
        type: 'success',
        duration: 4000,
      });
    } catch (err: any) {
      console.error('[AgentEcho-AXI] Sync failed:', err);
      this.toolbar.setSyncLoading(false);
      this.toolbar.showSyncError();

      this.toast.show('⚠️ Edge Bridge (localhost:3888) bağlantısı kurulamadı! Lütfen "agentecho-bridge start" çalıştırın.', {
        type: 'error',
        duration: 5000,
      });
    }
  }

  async copyFeedback() {
    const items = this.feedbackManager.getAll();
    if (items.length === 0) {
      this.toast.show('⚠️ Kopyalanacak herhangi bir feedback bulunamadı.', { type: 'warning', duration: 2500 });
      return;
    }

    const markdown = this.feedbackManager.toMarkdown();
    await navigator.clipboard.writeText(markdown);
    this.toolbar.showCopySuccess();

    this.toast.show(`📋 ${items.length} adet AXI direktifi panoya kopyalandı!`, {
      type: 'success',
      action: {
        label: '🗑️ İşaretleri Temizle',
        onClick: () => {
          this.clearAll();
        },
      },
      duration: 6000,
    });

    if (this.settings.clearAfterCopy) {
      this.clearAll();
    }
  }

  clearAll() {
    const count = this.feedbackManager.getAll().length;
    this.feedbackManager.clearAll();
    this.markerManager.clearAll();
    if (count > 0) {
      this.toast.show(`🗑️ ${count} adet feedback temizlendi.`, { type: 'info', duration: 2500 });
    } else {
      this.toast.show('✨ Zaten temizlenecek feedback yok.', { type: 'info', duration: 1500 });
    }
  }

  clearAllMarkers() {
    this.markerManager.clearAll();
  }

  removeMarker(id: string) {
    this.markerManager.removeMarker(id);
  }

  refreshMarkers() {
    this.markerManager.clearAll();
    this.loadExistingMarkers();
  }

  updateSettings(settings: Partial<ExtensionSettings>) {
    const oldBlockInteractions = this.settings.blockInteractions;
    this.settings = { ...this.settings, ...settings };
    this.markerManager.updateSettings(this.settings);

    // Handle blocking mode change
    if (this.settings.blockInteractions !== oldBlockInteractions) {
      if (this.settings.blockInteractions) {
        this.enableBlockingMode();
      } else {
        this.disableBlockingMode();
      }
    }
  }

  updateFeedbackManager(feedbackManager: FeedbackManager) {
    this.feedbackManager = feedbackManager;
  }
}
