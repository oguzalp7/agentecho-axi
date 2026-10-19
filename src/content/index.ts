import { Overlay } from './overlay/Overlay';
import { FeedbackManager } from './feedback/FeedbackManager';
import { getSettings, getFeedback } from '../shared/storage';
import { sendMessage } from '../shared/messaging';

let overlay: Overlay | null = null;
let feedbackManager: FeedbackManager | null = null;
let currentUrl: string = window.location.href;

async function initializeOverlay() {
  if (overlay) return;

  try {
    console.log('[AgentEcho-AXI] Initializing overlay on:', window.location.href);
    const settings = await getSettings();
    const feedback = await getFeedback(window.location.href);

    currentUrl = window.location.href;
    feedbackManager = new FeedbackManager(currentUrl, feedback);
    overlay = new Overlay(settings, feedbackManager);
    overlay.activate();
    console.log('[AgentEcho-AXI] Overlay activated! Toolbar and hover highlights ready.');
  } catch (err) {
    console.error('[AgentEcho-AXI] Failed to initialize overlay:', err);
  }
}

function deactivateOverlay() {
  if (overlay) {
    try {
      overlay.deactivate();
    } catch (e) {
      console.error('Error deactivating overlay:', e);
    }
    overlay = null;
  }
  feedbackManager = null;
}

async function handleUrlChange() {
  // Wait for the URL to actually update
  await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));

  const newUrl = window.location.href;

  // Only reload if URL actually changed and overlay exists
  if (newUrl !== currentUrl && overlay) {
    currentUrl = newUrl;

    // Clear old markers and feedback
    overlay.clearAllMarkers();

    // Load feedback for new URL
    const feedback = await getFeedback(newUrl);
    feedbackManager = new FeedbackManager(newUrl, feedback);

    // Update overlay with new feedback manager
    overlay.updateFeedbackManager(feedbackManager);

    // Load existing markers for new URL
    overlay.loadExistingMarkers();
  }
}

function setupUrlMonitoring() {
  let lastCheckedUrl = window.location.href;

  // Use requestAnimationFrame for efficient URL checking
  function checkUrl() {
    const currentUrl = window.location.href;

    if (currentUrl !== lastCheckedUrl && overlay) {
      lastCheckedUrl = currentUrl;
      handleUrlChange();
    }

    // Continue checking
    requestAnimationFrame(checkUrl);
  }

  // Start the rAF loop
  requestAnimationFrame(checkUrl);

  // Also listen to standard events as backup
  window.addEventListener('popstate', () => {
    lastCheckedUrl = window.location.href;
    handleUrlChange();
  });

  window.addEventListener('hashchange', () => {
    lastCheckedUrl = window.location.href;
    handleUrlChange();
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case 'ACTIVATE_OVERLAY':
      console.log('[AgentEcho-AXI] Received ACTIVATE_OVERLAY message');
      initializeOverlay().then(() => sendResponse({ success: true }));
      return true;
    case 'DEACTIVATE_OVERLAY':
      console.log('[AgentEcho-AXI] Received DEACTIVATE_OVERLAY message');
      deactivateOverlay();
      sendResponse({ success: true });
      return true;
    case 'TOGGLE_MARKERS':
      overlay?.toggleMarkers();
      break;
    case 'TOGGLE_PAUSE':
      overlay?.togglePause();
      break;
    case 'CLEAR_FEEDBACK':
      feedbackManager?.clearAll();
      overlay?.clearAllMarkers();
      sendResponse({ success: true });
      break;
    case 'COPY_FEEDBACK':
      const markdown = feedbackManager?.toMarkdown();
      if (markdown) {
        navigator.clipboard.writeText(markdown);
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false });
      }
      return true;
    case 'ADD_FEEDBACK':
      feedbackManager?.add(message.item);
      overlay?.loadExistingMarkers();
      sendResponse({ success: true });
      break;
    case 'REMOVE_FEEDBACK':
      feedbackManager?.remove(message.id);
      overlay?.removeMarker(message.id);
      sendResponse({ success: true });
      break;
    case 'UPDATE_FEEDBACK':
      feedbackManager?.update(message.id, message.updates);
      overlay?.refreshMarkers();
      sendResponse({ success: true });
      break;
  }
  return false;
});

document.addEventListener('keydown', (e) => {
  if (!overlay?.isActive) return;

  if (e.key === 'Escape') {
    deactivateOverlay();
  }

  if (e.ctrlKey || e.metaKey) {
    if (e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      deactivateOverlay();
    }
  }

  if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    const markdown = feedbackManager?.toMarkdown();
    if (markdown) {
      navigator.clipboard.writeText(markdown);
      alert('Feedback copied to clipboard!');
    }
  }

  if (e.key.toLowerCase() === 'h') {
    e.preventDefault();
    overlay?.toggleMarkers();
  }

  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      feedbackManager?.clearAll();
      overlay?.clearAllMarkers();
    }
  }
});

// Setup URL monitoring for SPA navigation detection
setupUrlMonitoring();

// Check if extension was already activated for this tab (auto-activate on page refresh/load)
sendMessage({ type: 'GET_STATE' })
  .then((state: any) => {
    if (state && state.isActive) {
      console.log('[AgentEcho-AXI] Auto-activating overlay based on existing tab state');
      initializeOverlay();
    }
  })
  .catch(() => {
    // Background not listening yet or extension inactive
  });
