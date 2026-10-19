import type { FeedbackItem, ExtensionSettings } from '../../shared/types';

export interface MarkerCallbacks {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const MARKER_STYLES = (color: string) => `
  .agentecho-markers-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 2147483645;
  }

  .agentecho-marker {
    position: absolute;
    width: 28px;
    height: 28px;
    background-color: ${color};
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: transform 0.15s ease-out, opacity 0.15s ease-out;
    pointer-events: all;
    user-select: none;
  }

  .agentecho-marker:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .agentecho-marker.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .agentecho-marker-popup {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: #1f2937;
    border-radius: 8px;
    padding: 10px 12px;
    min-width: 180px;
    max-width: 280px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.15s ease-out, visibility 0.15s ease-out;
    z-index: 2147483646;
  }

  .agentecho-marker-popup::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #1f2937;
  }

  .agentecho-marker:hover .agentecho-marker-popup {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
  }

  .agentecho-marker-badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 6px;
    letter-spacing: 0.5px;
  }

  .agentecho-marker-badge.modify {
    background: rgba(59, 130, 246, 0.2);
    color: #60a5fa;
    border: 1px solid rgba(59, 130, 246, 0.4);
  }

  .agentecho-marker-badge.remove {
    background: rgba(239, 68, 68, 0.2);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.4);
  }

  .agentecho-marker-comment {
    color: #f3f4f6;
    font-size: 13px;
    line-height: 1.4;
    margin-bottom: 10px;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  .agentecho-marker-actions {
    display: flex;
    gap: 6px;
    border-top: 1px solid #374151;
    padding-top: 10px;
  }

  .agentecho-marker-btn {
    flex: 1;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 500;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: white;
    transition: background 0.15s ease-out;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .agentecho-marker-btn.edit {
    background: #3b82f6;
  }

  .agentecho-marker-btn.edit:hover {
    background: #2563eb;
  }

  .agentecho-marker-btn.delete {
    background: #ef4444;
  }

  .agentecho-marker-btn.delete:hover {
    background: #dc2626;
  }
`;

export class MarkerManager {
  private shadowRoot: ShadowRoot;
  private settings: ExtensionSettings;
  private callbacks: MarkerCallbacks;
  private container: HTMLElement;
  private markers = new Map<string, { element: HTMLElement; commentEl: HTMLElement; badgeEl: HTMLElement }>();
  private visible = true;

  constructor(shadowRoot: ShadowRoot, settings: ExtensionSettings, callbacks: MarkerCallbacks) {
    this.shadowRoot = shadowRoot;
    this.settings = settings;
    this.callbacks = callbacks;
    
    // Create container for markers
    this.container = document.createElement('div');
    this.container.className = 'agentecho-markers-container';
    this.shadowRoot.appendChild(this.container);
    
    this.injectStyles();
  }

  private injectStyles() {
    let styleElement = this.shadowRoot.querySelector('#agentecho-marker-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'agentecho-marker-styles';
      this.shadowRoot.appendChild(styleElement);
    }
    (styleElement as HTMLStyleElement).textContent = MARKER_STYLES(this.settings.markerColor);
  }

  addMarker(feedback: FeedbackItem) {
    let rect = feedback.element.boundingRect;

    // Try to locate and tag target element in the live DOM
    try {
      let el: Element | null = null;
      if (feedback.element.selector) {
        el = document.querySelector(feedback.element.selector);
      }
      if (el) {
        el.setAttribute('data-agentecho-target', feedback.id);
        rect = el.getBoundingClientRect();
      }
    } catch {
      // Keep original rect
    }

    const isRemove = feedback.action === 'remove';
    const marker = document.createElement('div');
    marker.className = 'agentecho-marker';
    marker.dataset.feedbackId = feedback.id;
    marker.textContent = feedback.index.toString();
    marker.style.top = `${rect.top - 14}px`;
    marker.style.left = `${rect.left + rect.width / 2 - 14}px`;
    marker.style.backgroundColor = isRemove ? '#dc2626' : (this.settings.markerColor || '#2563eb');

    // Create popup container
    const popup = document.createElement('div');
    popup.className = 'agentecho-marker-popup';

    // Action badge
    const badgeEl = document.createElement('span');
    badgeEl.className = `agentecho-marker-badge ${feedback.action || 'modify'}`;
    badgeEl.textContent = isRemove ? 'REMOVE' : 'MODIFY';

    // Comment text
    const commentEl = document.createElement('div');
    commentEl.className = 'agentecho-marker-comment';
    commentEl.textContent = feedback.comment;

    // Actions container
    const actions = document.createElement('div');
    actions.className = 'agentecho-marker-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'agentecho-marker-btn edit';
    editBtn.textContent = 'Edit';
    editBtn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.callbacks.onEdit(feedback.id);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'agentecho-marker-btn delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.callbacks.onDelete(feedback.id);
    };

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    popup.appendChild(badgeEl);
    popup.appendChild(commentEl);
    popup.appendChild(actions);
    marker.appendChild(popup);

    const isOutOfBounds = rect.bottom < 0 || rect.top > window.innerHeight;
    if (isOutOfBounds || !this.visible) {
      marker.style.display = 'none';
      if (!this.visible) {
        marker.classList.add('hidden');
      }
    } else {
      marker.style.display = 'flex';
    }

    this.container.appendChild(marker);
    this.markers.set(feedback.id, { element: marker, commentEl, badgeEl });
  }

  updateMarkerTooltip(id: string, newComment: string, action?: 'modify' | 'remove') {
    const markerData = this.markers.get(id);
    if (markerData) {
      markerData.commentEl.textContent = newComment;
      if (action) {
        const isRemove = action === 'remove';
        markerData.element.style.backgroundColor = isRemove ? '#dc2626' : (this.settings.markerColor || '#2563eb');
        markerData.badgeEl.className = `agentecho-marker-badge ${action}`;
        markerData.badgeEl.textContent = isRemove ? 'REMOVE' : 'MODIFY';
      }
    }
  }

  removeMarker(id: string) {
    try {
      const el = document.querySelector(`[data-agentecho-target="${id}"]`);
      if (el) {
        el.removeAttribute('data-agentecho-target');
      }
    } catch {
      // Ignore
    }
    const markerData = this.markers.get(id);
    if (markerData) {
      markerData.element.remove();
      this.markers.delete(id);
    }
  }

  clearAll() {
    try {
      document.querySelectorAll('[data-agentecho-target]').forEach((el) => {
        el.removeAttribute('data-agentecho-target');
      });
    } catch {
      // Ignore
    }
    this.markers.forEach(({ element }) => element.remove());
    this.markers.clear();
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    this.container.style.display = visible ? 'block' : 'none';
    this.markers.forEach(({ element }) => {
      if (visible) {
        element.classList.remove('hidden');
      } else {
        element.classList.add('hidden');
        element.style.display = 'none';
      }
    });
  }

  updatePositions(feedbackItems: FeedbackItem[]) {
    feedbackItems.forEach((item) => {
      const markerData = this.markers.get(item.id);
      if (!markerData) return;

      let rect = item.element.boundingRect;
      try {
        let el: Element | null = document.querySelector(`[data-agentecho-target="${item.id}"]`);
        if (!el && item.element.selector) {
          el = document.querySelector(item.element.selector);
          if (el) {
            el.setAttribute('data-agentecho-target', item.id);
          }
        }
        if (el) {
          rect = el.getBoundingClientRect();
        }
      } catch {
        // Ignore selector errors, keep original rect
      }

      const isOutOfBounds = rect.bottom < 0 || rect.top > window.innerHeight;
      if (isOutOfBounds || !this.visible) {
        markerData.element.style.display = 'none';
      } else {
        markerData.element.style.display = 'flex';
        markerData.element.style.top = `${rect.top - 14}px`;
        markerData.element.style.left = `${rect.left + rect.width / 2 - 14}px`;
      }
    });
  }

  updateSettings(settings: ExtensionSettings) {
    this.settings = settings;
    this.injectStyles();
  }
}
