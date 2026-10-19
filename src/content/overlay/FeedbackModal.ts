const MODAL_STYLES = `
  .agentecho-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2147483647;
    pointer-events: all;
    backdrop-filter: blur(2px);
  }

  .agentecho-modal {
    background: #181d28;
    border: 1px solid #2d3748;
    border-radius: 14px;
    padding: 22px;
    width: 440px;
    max-width: 92vw;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .agentecho-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .agentecho-modal-title {
    color: #f9fafb;
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .agentecho-modal-intent-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    gap: 8px;
  }

  .agentecho-intent-group {
    display: flex;
    background: #0f131a;
    border-radius: 8px;
    padding: 3px;
    border: 1px solid #2d3748;
    gap: 2px;
  }

  .agentecho-intent-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.15s ease;
  }

  .agentecho-intent-btn:hover {
    color: #e2e8f0;
  }

  .agentecho-intent-btn.active[data-action="modify"] {
    background: #2563eb;
    color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .agentecho-intent-btn.active[data-action="remove"] {
    background: #dc2626;
    color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .agentecho-stt-group {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .agentecho-lang-btn {
    background: #0f131a;
    border: 1px solid #2d3748;
    color: #94a3b8;
    font-size: 11px;
    font-weight: 700;
    padding: 6px 9px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
  }

  .agentecho-lang-btn:hover {
    border-color: #3b82f6;
    color: #f1f5f9;
  }

  .agentecho-mic-btn {
    background: #0f131a;
    border: 1px solid #2d3748;
    color: #94a3b8;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .agentecho-mic-btn:hover {
    border-color: #3b82f6;
    color: #f1f5f9;
  }

  .agentecho-mic-btn.listening {
    background: #ef4444;
    border-color: #ef4444;
    color: #ffffff;
    animation: agentecho-mic-pulse 1.5s infinite;
  }

  @keyframes agentecho-mic-pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
      box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }

  .agentecho-stt-status {
    font-size: 11px;
    color: #f87171;
    margin-bottom: 8px;
    display: none;
    align-items: center;
    gap: 6px;
  }

  .agentecho-modal-element-info {
    background: #0f131a;
    border: 1px solid #262f3d;
    border-radius: 6px;
    padding: 8px 10px;
    margin-bottom: 12px;
    font-size: 12px;
    color: #94a3b8;
    font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .agentecho-modal-element-tag {
    color: #f472b6;
    font-weight: 600;
  }

  .agentecho-modal-element-class {
    color: #60a5fa;
  }

  .agentecho-modal-element-id {
    color: #fbbf24;
  }

  .agentecho-modal-input {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #2d3748;
    border-radius: 8px;
    background: #0f131a;
    color: #f9fafb;
    font-size: 14px;
    line-height: 1.5;
    outline: none;
    transition: border-color 0.15s ease;
    box-sizing: border-box;
    resize: vertical;
    min-height: 85px;
    font-family: inherit;
  }

  .agentecho-modal-input:focus {
    border-color: #3b82f6;
  }

  .agentecho-modal-input::placeholder {
    color: #64748b;
  }

  .agentecho-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 14px;
  }

  .agentecho-modal-btn {
    padding: 9px 18px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s ease, opacity 0.15s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .agentecho-modal-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .agentecho-modal-btn.cancel {
    background: #2d3748;
    color: #e2e8f0;
  }

  .agentecho-modal-btn.cancel:hover:not(:disabled) {
    background: #3e4c63;
  }

  .agentecho-modal-btn.submit {
    background: #2563eb;
    color: white;
  }

  .agentecho-modal-btn.submit:hover:not(:disabled) {
    background: #1d4ed8;
  }

  .agentecho-modal-btn.submit.danger {
    background: #dc2626;
    color: white;
  }

  .agentecho-modal-btn.submit.danger:hover:not(:disabled) {
    background: #b91c1c;
  }
`;

export type ModalResult = {
  comment: string;
  action: 'modify' | 'remove';
} | null;

export class FeedbackModal {
  private shadowRoot: ShadowRoot;
  private modalOverlay: HTMLElement | null = null;
  private resolvePromise: ((result: ModalResult) => void) | null = null;

  // STT state
  private isListening = false;
  private recognitionInstance: any | null = null;
  private currentLang: 'tr-TR' | 'en-US' = 'tr-TR';
  private currentAction: 'modify' | 'remove' = 'modify';
  private textBeforeListening = '';

  constructor(shadowRoot: ShadowRoot) {
    this.shadowRoot = shadowRoot;
    this.injectStyles();
    this.loadPersistedLanguage();
  }

  private loadPersistedLanguage() {
    try {
      const saved = localStorage.getItem('agentecho_axi_lang');
      if (saved === 'en-US' || saved === 'tr-TR') {
        this.currentLang = saved;
      }
    } catch {
      this.currentLang = 'tr-TR';
    }
  }

  private savePersistedLanguage(lang: 'tr-TR' | 'en-US') {
    this.currentLang = lang;
    try {
      localStorage.setItem('agentecho_axi_lang', lang);
    } catch {
      // Ignore storage errors
    }
  }

  private injectStyles() {
    let styleElement = this.shadowRoot.querySelector('#agentecho-modal-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'agentecho-modal-styles';
      this.shadowRoot.appendChild(styleElement);
    }
    (styleElement as HTMLStyleElement).textContent = MODAL_STYLES;
  }

  show(
    element: HTMLElement,
    existingComment?: string,
    existingAction?: 'modify' | 'remove'
  ): Promise<ModalResult> {
    return new Promise((resolve) => {
      this.resolvePromise = resolve;
      this.currentAction = existingAction || 'modify';
      this.render(element, existingComment);
    });
  }

  private render(element: HTMLElement, existingComment?: string) {
    // Create overlay
    this.modalOverlay = document.createElement('div');
    this.modalOverlay.className = 'agentecho-modal-overlay';
    this.modalOverlay.onclick = (e) => {
      if (e.target === this.modalOverlay) {
        this.close(null);
      }
    };

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'agentecho-modal';

    // Header
    const header = document.createElement('div');
    header.className = 'agentecho-modal-header';

    const title = document.createElement('h3');
    title.className = 'agentecho-modal-title';
    title.innerHTML = `<span>🎯</span> <span>${existingComment ? 'Geri Bildirimi Düzenle' : 'AXI Direktif Ekle'}</span>`;
    header.appendChild(title);

    // Intent Bar (Action Selection + STT Controls)
    const intentBar = document.createElement('div');
    intentBar.className = 'agentecho-modal-intent-bar';

    // Action buttons group
    const intentGroup = document.createElement('div');
    intentGroup.className = 'agentecho-intent-group';

    const modifyBtn = document.createElement('button');
    modifyBtn.type = 'button';
    modifyBtn.className = `agentecho-intent-btn ${this.currentAction === 'modify' ? 'active' : ''}`;
    modifyBtn.dataset.action = 'modify';
    modifyBtn.innerHTML = `<span>🛠️</span> <span>Modify</span>`;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = `agentecho-intent-btn ${this.currentAction === 'remove' ? 'active' : ''}`;
    removeBtn.dataset.action = 'remove';
    removeBtn.innerHTML = `<span>🗑️</span> <span>Remove</span>`;

    intentGroup.appendChild(modifyBtn);
    intentGroup.appendChild(removeBtn);

    // STT group
    const sttGroup = document.createElement('div');
    sttGroup.className = 'agentecho-stt-group';

    const langBtn = document.createElement('button');
    langBtn.type = 'button';
    langBtn.className = 'agentecho-lang-btn';
    langBtn.textContent = this.currentLang === 'tr-TR' ? 'TR' : 'EN';
    langBtn.title = 'Sesli dikte dilini değiştir (TR / EN)';

    const micBtn = document.createElement('button');
    micBtn.type = 'button';
    micBtn.className = 'agentecho-mic-btn';
    micBtn.title = 'Sesli dikteyi başlat/durdur (STT)';
    micBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`;

    sttGroup.appendChild(langBtn);
    sttGroup.appendChild(micBtn);

    intentBar.appendChild(intentGroup);
    intentBar.appendChild(sttGroup);

    // STT status text
    const sttStatus = document.createElement('div');
    sttStatus.className = 'agentecho-stt-status';
    sttStatus.innerHTML = `<span>●</span> <span>Dinleniyor...</span>`;

    // Element info
    const elementInfo = document.createElement('div');
    elementInfo.className = 'agentecho-modal-element-info';
    elementInfo.innerHTML = this.formatElementInfo(element);

    // Input textarea
    const input = document.createElement('textarea');
    input.className = 'agentecho-modal-input';
    this.updateInputPlaceholder(input);
    input.value = existingComment || '';

    // Actions
    const actions = document.createElement('div');
    actions.className = 'agentecho-modal-actions';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'agentecho-modal-btn cancel';
    cancelBtn.textContent = 'İptal';
    cancelBtn.onclick = () => this.close(null);

    const submitBtn = document.createElement('button');
    submitBtn.className = `agentecho-modal-btn submit ${this.currentAction === 'remove' ? 'danger' : ''}`;
    this.updateSubmitBtnText(submitBtn, !!existingComment);

    const handleSubmit = () => {
      let comment = input.value.trim();
      if (!comment && this.currentAction === 'remove') {
        comment = '[ACTION: REMOVE] Bu bileşen arayüzden tamamen kaldırılacak.';
      }
      if (comment) {
        this.close({ comment, action: this.currentAction });
      }
    };

    submitBtn.onclick = handleSubmit;

    // Toggle Action behavior
    modifyBtn.onclick = () => {
      this.currentAction = 'modify';
      modifyBtn.classList.add('active');
      removeBtn.classList.remove('active');
      submitBtn.classList.remove('danger');
      this.updateInputPlaceholder(input);
      this.updateSubmitBtnText(submitBtn, !!existingComment);
    };

    removeBtn.onclick = () => {
      this.currentAction = 'remove';
      removeBtn.classList.add('active');
      modifyBtn.classList.remove('active');
      submitBtn.classList.add('danger');
      this.updateInputPlaceholder(input);
      this.updateSubmitBtnText(submitBtn, !!existingComment);
    };

    // Toggle STT Language
    langBtn.onclick = () => {
      const nextLang = this.currentLang === 'tr-TR' ? 'en-US' : 'tr-TR';
      this.savePersistedLanguage(nextLang);
      langBtn.textContent = nextLang === 'tr-TR' ? 'TR' : 'EN';
      if (this.isListening) {
        this.stopSpeechRecognition(micBtn, sttStatus);
        this.startSpeechRecognition(input, micBtn, sttStatus);
      }
    };

    // Mic button click
    micBtn.onclick = () => {
      if (this.isListening) {
        this.stopSpeechRecognition(micBtn, sttStatus);
      } else {
        this.startSpeechRecognition(input, micBtn, sttStatus);
      }
    };

    // Handle keyboard
    input.onkeydown = (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        this.close(null);
      }
      e.stopPropagation();
    };

    actions.appendChild(cancelBtn);
    actions.appendChild(submitBtn);

    modal.appendChild(header);
    modal.appendChild(intentBar);
    modal.appendChild(sttStatus);
    modal.appendChild(elementInfo);
    modal.appendChild(input);
    modal.appendChild(actions);

    this.modalOverlay.appendChild(modal);
    this.shadowRoot.appendChild(this.modalOverlay);

    // Focus input
    setTimeout(() => input.focus(), 0);
  }

  private updateInputPlaceholder(input: HTMLTextAreaElement) {
    if (this.currentAction === 'remove') {
      input.placeholder = 'Kaldırma gerekçesi veya opsiyonel not... (Boş bırakılabilir)';
    } else {
      input.placeholder = 'Yapılacak değişiklik, stil veya davranış talimatını yazın ya da dikte edin...';
    }
  }

  private updateSubmitBtnText(btn: HTMLButtonElement, isEdit: boolean) {
    if (this.currentAction === 'remove') {
      btn.textContent = 'Kaldır (Remove)';
    } else {
      btn.textContent = isEdit ? 'Kaydet' : 'Ekle (Add)';
    }
  }

  private startSpeechRecognition(
    input: HTMLTextAreaElement,
    micBtn: HTMLButtonElement,
    statusEl: HTMLElement
  ) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Tarayıcınız Web Speech API desteklemiyor. Chromium tabanlı bir tarayıcı önerilir.');
      return;
    }

    try {
      this.recognitionInstance = new SpeechRecognition();
      this.recognitionInstance.continuous = true;
      this.recognitionInstance.interimResults = true;
      this.recognitionInstance.lang = this.currentLang;

      this.textBeforeListening = input.value ? input.value.trim() + ' ' : '';

      this.recognitionInstance.onstart = () => {
        this.isListening = true;
        micBtn.classList.add('listening');
        statusEl.style.display = 'flex';
        statusEl.innerHTML = `<span>●</span> <span>Dinleniyor (${this.currentLang === 'tr-TR' ? 'Türkçe' : 'English'})...</span>`;
      };

      this.recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentSpeech = finalTranscript || interimTranscript;
        input.value = this.textBeforeListening + currentSpeech;
        input.scrollTop = input.scrollHeight;
      };

      this.recognitionInstance.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        this.stopSpeechRecognition(micBtn, statusEl);
      };

      this.recognitionInstance.onend = () => {
        this.stopSpeechRecognition(micBtn, statusEl);
      };

      this.recognitionInstance.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      this.stopSpeechRecognition(micBtn, statusEl);
    }
  }

  private stopSpeechRecognition(micBtn: HTMLButtonElement, statusEl: HTMLElement) {
    this.isListening = false;
    micBtn.classList.remove('listening');
    statusEl.style.display = 'none';
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.stop();
      } catch {
        // Ignore
      }
      this.recognitionInstance = null;
    }
  }

  private formatElementInfo(element: HTMLElement): string {
    const tag = element.tagName.toLowerCase();
    const id = element.id ? `<span class="agentecho-modal-element-id">#${element.id}</span>` : '';
    const classes =
      element.className && typeof element.className === 'string'
        ? element.className
            .split(' ')
            .filter((c) => c && !c.startsWith('agentecho'))
            .slice(0, 3)
            .map((c) => `<span class="agentecho-modal-element-class">.${c}</span>`)
            .join('')
        : '';

    return `<span class="agentecho-modal-element-tag">&lt;${tag}&gt;</span>${id}${classes}`;
  }

  private close(result: ModalResult) {
    if (this.recognitionInstance && this.isListening) {
      try {
        this.recognitionInstance.stop();
      } catch {
        // Ignore
      }
      this.recognitionInstance = null;
      this.isListening = false;
    }

    if (this.modalOverlay) {
      this.modalOverlay.remove();
      this.modalOverlay = null;
    }
    if (this.resolvePromise) {
      this.resolvePromise(result);
      this.resolvePromise = null;
    }
  }

  isOpen(): boolean {
    return this.modalOverlay !== null;
  }
}
