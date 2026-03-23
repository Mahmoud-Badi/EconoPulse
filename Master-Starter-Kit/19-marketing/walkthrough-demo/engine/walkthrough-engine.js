/**
 * Walkthrough Demo Engine
 * =======================
 * Framework-agnostic, vanilla JS engine for interactive product walkthroughs.
 * Powers guided tours, free-explore hotspots, spotlights, and mode toggling.
 *
 * Zero external dependencies. Works as ES module or UMD global.
 */

/* ------------------------------------------------------------------ */
/*  Event System (pub/sub)                                            */
/* ------------------------------------------------------------------ */

class EventBus {
  constructor() {
    this._listeners = {};
  }

  /** Subscribe to an event. */
  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
    return this; // allow chaining
  }

  /** Unsubscribe from an event. */
  off(event, callback) {
    const list = this._listeners[event];
    if (!list) return this;
    this._listeners[event] = list.filter(fn => fn !== callback);
    return this;
  }

  /** Emit an event with optional data payload. */
  emit(event, data) {
    const list = this._listeners[event];
    if (!list) return;
    list.forEach(fn => {
      try { fn(data); } catch (e) { console.error(`[WalkthroughEngine] Event handler error (${event}):`, e); }
    });
  }
}

/* ------------------------------------------------------------------ */
/*  Tooltip Engine                                                    */
/* ------------------------------------------------------------------ */

class TooltipEngine {
  constructor(events) {
    this._events = events;
    this._el = null;
  }

  /**
   * Show a tooltip near a target element.
   * @param {Element} targetEl   - DOM element to point at
   * @param {Object}  content    - { title, description, media?, mediaType? ('image'|'video'), actions? }
   * @param {string}  [preferred] - preferred position: 'top'|'bottom'|'left'|'right'
   */
  show(targetEl, content, preferred) {
    this.dismiss(); // remove any existing tooltip

    const tooltip = document.createElement('div');
    tooltip.className = 'wt-tooltip';

    // --- build inner HTML ---
    let html = '<div class="wt-tooltip-content">';
    if (content.title) html += `<div class="wt-tooltip-title">${content.title}</div>`;
    if (content.description) html += `<div class="wt-tooltip-description">${content.description}</div>`;

    if (content.media) {
      html += '<div class="wt-tooltip-media">';
      if (content.mediaType === 'video') {
        html += `<iframe src="${content.media}" frameborder="0" allowfullscreen></iframe>`;
      } else {
        html += `<img src="${content.media}" alt="" />`;
      }
      html += '</div>';
    }

    if (content.actions) {
      html += '<div class="wt-tooltip-actions">';
      if (content.actions.prev) html += `<button class="wt-btn wt-btn-prev">${content.actions.prev}</button>`;
      if (content.actions.next) html += `<button class="wt-btn wt-btn-next">${content.actions.next}</button>`;
      if (content.actions.skip) html += `<button class="wt-btn wt-btn-skip">${content.actions.skip}</button>`;
      html += '</div>';
    }
    html += '</div><div class="wt-tooltip-arrow"></div>';
    tooltip.innerHTML = html;

    document.body.appendChild(tooltip);
    this._el = tooltip;

    // --- smart positioning ---
    const pos = this._bestPosition(targetEl, tooltip, preferred);
    this._applyPosition(targetEl, tooltip, pos);

    // wire action buttons
    const btnNext = tooltip.querySelector('.wt-btn-next');
    const btnPrev = tooltip.querySelector('.wt-btn-prev');
    const btnSkip = tooltip.querySelector('.wt-btn-skip');
    if (btnNext) btnNext.addEventListener('click', () => this._events.emit('tooltip-next'));
    if (btnPrev) btnPrev.addEventListener('click', () => this._events.emit('tooltip-prev'));
    if (btnSkip) btnSkip.addEventListener('click', () => this._events.emit('tooltip-skip'));

    return tooltip;
  }

  /** Remove the currently-visible tooltip. */
  dismiss() {
    if (this._el) {
      this._el.classList.add('wt-tooltip--exiting');
      const el = this._el;
      setTimeout(() => el.remove(), 200);
      this._el = null;
    }
  }

  /* --- private helpers --- */

  _bestPosition(target, tooltip, preferred) {
    const rect = target.getBoundingClientRect();
    const tw = tooltip.offsetWidth;
    const th = tooltip.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 12;

    const fits = {
      top: rect.top - th - gap > 0,
      bottom: rect.bottom + th + gap < vh,
      left: rect.left - tw - gap > 0,
      right: rect.right + tw + gap < vw,
    };

    if (preferred && fits[preferred]) return preferred;

    // priority order
    for (const dir of ['bottom', 'top', 'right', 'left']) {
      if (fits[dir]) return dir;
    }
    return 'bottom'; // fallback
  }

  _applyPosition(target, tooltip, pos) {
    const rect = target.getBoundingClientRect();
    const gap = 12;
    tooltip.className = `wt-tooltip wt-tooltip--${pos}`;

    let top, left;
    switch (pos) {
      case 'top':
        top = rect.top + window.scrollY - tooltip.offsetHeight - gap;
        left = rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + window.scrollY + gap;
        left = rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2;
        break;
      case 'left':
        top = rect.top + window.scrollY + rect.height / 2 - tooltip.offsetHeight / 2;
        left = rect.left + window.scrollX - tooltip.offsetWidth - gap;
        break;
      case 'right':
        top = rect.top + window.scrollY + rect.height / 2 - tooltip.offsetHeight / 2;
        left = rect.right + window.scrollX + gap;
        break;
    }

    // clamp to viewport
    left = Math.max(8, Math.min(left, window.innerWidth - tooltip.offsetWidth - 8));
    top = Math.max(8, top);

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }
}

/* ------------------------------------------------------------------ */
/*  Hotspot System                                                    */
/* ------------------------------------------------------------------ */

class HotspotSystem {
  constructor(events, tooltipEngine) {
    this._events = events;
    this._tooltip = tooltipEngine;
    this._hotspots = [];
    this._handleClick = this._handleClick.bind(this);
  }

  /**
   * Show pulsing beacons over an array of target descriptors.
   * Each target: { selector, label?, tooltip? { title, description, media?, mediaType? } }
   */
  show(targets) {
    this.hide(); // clear previous

    targets.forEach(target => {
      const el = document.querySelector(target.selector);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const beacon = document.createElement('div');
      beacon.className = 'wt-hotspot';
      beacon.innerHTML = '<span class="wt-hotspot-pulse"></span>';
      if (target.label) {
        beacon.innerHTML += `<span class="wt-hotspot-label">${target.label}</span>`;
      }

      beacon.style.top = `${rect.top + window.scrollY + rect.height / 2}px`;
      beacon.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
      beacon.dataset.featureId = target.id || target.selector;
      beacon._targetConfig = target;
      beacon._targetEl = el;

      beacon.addEventListener('click', this._handleClick);
      document.body.appendChild(beacon);
      this._hotspots.push(beacon);
    });
  }

  /** Remove all hotspots from the DOM. */
  hide() {
    this._hotspots.forEach(h => {
      h.removeEventListener('click', this._handleClick);
      h.remove();
    });
    this._hotspots = [];
    this._tooltip.dismiss();
  }

  /** Reposition hotspots after layout changes. */
  reposition() {
    this._hotspots.forEach(beacon => {
      const el = beacon._targetEl;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      beacon.style.top = `${rect.top + window.scrollY + rect.height / 2}px`;
      beacon.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
    });
  }

  _handleClick(e) {
    const beacon = e.currentTarget;
    const cfg = beacon._targetConfig;
    const featureId = beacon.dataset.featureId;

    if (cfg.tooltip) {
      this._tooltip.show(beacon._targetEl, cfg.tooltip);
    }

    this._events.emit('feature-explored', { featureId, config: cfg });
  }
}

/* ------------------------------------------------------------------ */
/*  Spotlight Overlay                                                 */
/* ------------------------------------------------------------------ */

class SpotlightOverlay {
  constructor() {
    this._overlay = null;
  }

  /** Spotlight a target element with a cutout overlay. */
  focus(targetEl) {
    if (!this._overlay) {
      this._overlay = document.createElement('div');
      this._overlay.className = 'wt-spotlight-overlay';
      document.body.appendChild(this._overlay);
    }

    document.body.classList.add('wt-spotlight-active');

    const rect = targetEl.getBoundingClientRect();
    const pad = 6;

    // Box-shadow technique: huge shadow with a transparent center
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const w = rect.width / 2 + pad;
    const h = rect.height / 2 + pad;

    this._overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: var(--wt-z-base, 9000);
      border-radius: ${pad}px;
      box-shadow: 0 0 0 9999px var(--wt-overlay-color, rgba(0,0,0,0.65));
      clip-path: inset(0);
      transition: all 0.35s ease;
    `;

    // Position the "hole" using a transparent inset
    const top = rect.top - pad;
    const left = rect.left - pad;
    const bottom = window.innerHeight - rect.bottom - pad;
    const right = window.innerWidth - rect.right - pad;

    this._overlay.style.clipPath = `polygon(
      0 0, 0 100%, ${left}px 100%, ${left}px ${top}px,
      ${left + rect.width + 2 * pad}px ${top}px,
      ${left + rect.width + 2 * pad}px ${top + rect.height + 2 * pad}px,
      ${left}px ${top + rect.height + 2 * pad}px,
      ${left}px 100%, 100% 100%, 100% 0
    )`;
  }

  /** Remove the spotlight overlay. */
  unfocus() {
    document.body.classList.remove('wt-spotlight-active');
    if (this._overlay) {
      this._overlay.remove();
      this._overlay = null;
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Progress Tracker                                                  */
/* ------------------------------------------------------------------ */

class ProgressTracker {
  constructor(events) {
    this._events = events;
    this._el = null;
    this._explored = new Set();
    this._totalSteps = 0;
    this._totalFeatures = 0;
  }

  /** Create the progress bar UI and append it to a container. */
  mount(container) {
    this._el = document.createElement('div');
    this._el.className = 'wt-progress';
    this._el.innerHTML = `
      <div class="wt-progress-bar"><div class="wt-progress-bar-fill"></div></div>
      <div class="wt-progress-text"></div>
      <div class="wt-progress-dots"></div>
    `;
    container.appendChild(this._el);
  }

  /** Configure total counts. */
  configure(totalSteps, totalFeatures) {
    this._totalSteps = totalSteps;
    this._totalFeatures = totalFeatures || totalSteps;

    // build dot indicators
    const dotsEl = this._el.querySelector('.wt-progress-dots');
    dotsEl.innerHTML = '';
    for (let i = 0; i < totalSteps; i++) {
      const dot = document.createElement('span');
      dot.className = 'wt-progress-dot';
      dot.dataset.step = i;
      dotsEl.appendChild(dot);
    }
  }

  /** Update progress for guided mode. */
  update(currentStep, totalSteps) {
    if (!this._el) return;
    const pct = Math.round(((currentStep + 1) / totalSteps) * 100);
    this._el.querySelector('.wt-progress-bar-fill').style.width = `${pct}%`;
    this._el.querySelector('.wt-progress-text').textContent = `${currentStep + 1} of ${totalSteps}`;

    // highlight dots
    this._el.querySelectorAll('.wt-progress-dot').forEach((dot, i) => {
      dot.classList.toggle('wt-progress-dot--active', i === currentStep);
      dot.classList.toggle('wt-progress-dot--done', i < currentStep);
    });

    this._events.emit('progress-update', this.getProgress());
  }

  /** Mark a feature as explored (free-explore mode). */
  markExplored(featureId) {
    this._explored.add(featureId);
    if (!this._el) return;
    const pct = Math.round((this._explored.size / this._totalFeatures) * 100);
    this._el.querySelector('.wt-progress-bar-fill').style.width = `${pct}%`;
    this._el.querySelector('.wt-progress-text').textContent =
      `${this._explored.size} of ${this._totalFeatures} features explored`;
    this._events.emit('progress-update', this.getProgress());
  }

  /** Return current progress snapshot. */
  getProgress() {
    return {
      guidedProgress: this._totalSteps ? (this._explored.size / this._totalSteps) : 0,
      exploredFeatures: Array.from(this._explored),
      totalFeatures: this._totalFeatures,
    };
  }

  unmount() {
    if (this._el) {
      this._el.remove();
      this._el = null;
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Mode Toggle                                                       */
/* ------------------------------------------------------------------ */

class ModeToggle {
  constructor(events) {
    this._events = events;
    this._mode = 'guided';
    this._el = null;
    this._callbacks = [];
  }

  /** Create the floating toggle and append to body. */
  mount() {
    this._el = document.createElement('div');
    this._el.className = 'wt-mode-toggle wt-mode-toggle--guided';
    this._el.innerHTML = `
      <button class="wt-mode-toggle-btn" aria-label="Toggle walkthrough mode">
        <span class="wt-mode-toggle-label">Guided Tour</span>
      </button>
    `;
    document.body.appendChild(this._el);

    this._el.querySelector('.wt-mode-toggle-btn').addEventListener('click', () => {
      this.setMode(this._mode === 'guided' ? 'free' : 'guided');
    });
  }

  /** Set the mode programmatically. */
  setMode(mode) {
    if (mode === this._mode) return;
    this._mode = mode;

    if (this._el) {
      this._el.className = `wt-mode-toggle wt-mode-toggle--${mode}`;
      this._el.querySelector('.wt-mode-toggle-label').textContent =
        mode === 'guided' ? 'Guided Tour' : 'Free Explore';
    }

    this._callbacks.forEach(cb => cb(mode));
    this._events.emit('mode-change', { mode });
  }

  /** Return the current mode. */
  getMode() {
    return this._mode;
  }

  /** Register a mode-change callback. */
  onModeChange(callback) {
    this._callbacks.push(callback);
  }

  unmount() {
    if (this._el) {
      this._el.remove();
      this._el = null;
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Tour Manager                                                      */
/* ------------------------------------------------------------------ */

class TourManager {
  constructor(events, tooltipEngine, spotlightOverlay) {
    this._events = events;
    this._tooltip = tooltipEngine;
    this._spotlight = spotlightOverlay;
    this._steps = [];
    this._currentIndex = -1;
    this._paused = false;

    // Wire tooltip nav buttons to tour nav
    this._events.on('tooltip-next', () => this.next());
    this._events.on('tooltip-prev', () => this.prev());
    this._events.on('tooltip-skip', () => this._events.emit('tour-end'));
  }

  /** Load steps from config. */
  loadSteps(steps) {
    this._steps = steps || [];
  }

  /** Start the tour from the beginning (or a given index). */
  start(fromIndex) {
    this._currentIndex = fromIndex != null ? fromIndex : 0;
    this._paused = false;
    this._events.emit('tour-start', { totalSteps: this._steps.length });
    this._showStep();
  }

  /** Advance to the next step. */
  next() {
    if (this._currentIndex < this._steps.length - 1) {
      this._currentIndex++;
      this._showStep();
    } else {
      // Tour complete
      this._tooltip.dismiss();
      this._spotlight.unfocus();
      this._events.emit('tour-end');
      this._events.emit('tour-complete');
    }
  }

  /** Go back one step. */
  prev() {
    if (this._currentIndex > 0) {
      this._currentIndex--;
      this._showStep();
    }
  }

  /** Jump to a specific step by its id. */
  goTo(stepId) {
    const idx = this._steps.findIndex(s => s.id === stepId);
    if (idx !== -1) {
      this._currentIndex = idx;
      this._showStep();
    }
  }

  /** Pause the tour (hides tooltip and spotlight). */
  pause() {
    this._paused = true;
    this._tooltip.dismiss();
    this._spotlight.unfocus();
    this._events.emit('tour-pause');
  }

  /** Resume from where we left off. */
  resume() {
    this._paused = false;
    this._showStep();
  }

  /** Return current step index. */
  getCurrentIndex() {
    return this._currentIndex;
  }

  /* --- private --- */

  _showStep() {
    if (this._paused) return;
    const step = this._steps[this._currentIndex];
    if (!step) return;

    const targetEl = document.querySelector(step.selector);
    if (!targetEl) {
      console.warn(`[WalkthroughEngine] Target not found: ${step.selector}`);
      return;
    }

    // Scroll target into view
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Spotlight it
    this._spotlight.focus(targetEl);

    // Build action labels
    const isFirst = this._currentIndex === 0;
    const isLast = this._currentIndex === this._steps.length - 1;
    const actions = {
      prev: isFirst ? null : (step.prevLabel || 'Back'),
      next: isLast ? (step.finishLabel || 'Finish') : (step.nextLabel || 'Next'),
      skip: step.skippable !== false ? 'Skip' : null,
    };
    // Remove null entries
    Object.keys(actions).forEach(k => { if (!actions[k]) delete actions[k]; });

    // Show tooltip
    this._tooltip.show(targetEl, {
      title: step.title,
      description: step.description,
      media: step.media,
      mediaType: step.mediaType,
      actions,
    }, step.tooltipPosition);

    this._events.emit('step-change', {
      index: this._currentIndex,
      step,
      total: this._steps.length,
    });
  }
}

/* ------------------------------------------------------------------ */
/*  Walkthrough Engine (main orchestrator)                            */
/* ------------------------------------------------------------------ */

class WalkthroughEngine {
  /**
   * @param {Object} config - Configuration loaded from demo-config.json
   * @param {Object[]} config.steps - Tour step definitions
   * @param {Object[]} config.hotspots - Free-explore hotspot definitions
   * @param {Object}   config.theme - CSS variable overrides
   * @param {string}   config.container - Selector for mount container
   */
  constructor(config) {
    this.config = config || {};
    this.events = new EventBus();

    // Sub-modules
    this.tooltip = new TooltipEngine(this.events);
    this.spotlight = new SpotlightOverlay();
    this.hotspots = new HotspotSystem(this.events, this.tooltip);
    this.tour = new TourManager(this.events, this.tooltip, this.spotlight);
    this.progress = new ProgressTracker(this.events);
    this.modeToggle = new ModeToggle(this.events);

    this._resizeHandler = null;
  }

  /** Initialize engine: apply theme, render chrome, wire events. */
  init() {
    // Apply theme CSS custom properties
    if (this.config.theme) {
      const root = document.documentElement;
      Object.entries(this.config.theme).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }

    // Determine container
    const container = this.config.container
      ? document.querySelector(this.config.container)
      : document.body;

    // Mount UI chrome
    this.progress.mount(container);
    this.modeToggle.mount();

    // Load steps
    const steps = this.config.steps || [];
    const hotspotTargets = this.config.hotspots || [];

    this.tour.loadSteps(steps);
    this.progress.configure(steps.length, hotspotTargets.length || steps.length);

    // --- Wire cross-module events ---

    // Progress updates from tour
    this.events.on('step-change', (data) => {
      this.progress.update(data.index, data.total);
    });

    // Progress updates from free-explore
    this.events.on('feature-explored', (data) => {
      this.progress.markExplored(data.featureId);
    });

    // Mode switching
    this.modeToggle.onModeChange((mode) => {
      if (mode === 'guided') {
        this.hotspots.hide();
        this.tour.resume();
      } else {
        this.tour.pause();
        this.spotlight.unfocus();
        this.hotspots.show(hotspotTargets);
      }
    });

    // CTA events (tour-complete triggers CTA)
    this.events.on('tour-complete', () => {
      this.events.emit('cta-shown', { trigger: 'tour-complete' });
    });

    // Handle window resize — reposition hotspots
    this._resizeHandler = () => this.hotspots.reposition();
    window.addEventListener('resize', this._resizeHandler);

    // Start in guided mode by default
    if (steps.length > 0) {
      this.tour.start();
    }
  }

  /** Tear down all engine UI and listeners. */
  destroy() {
    this.tour.pause();
    this.tooltip.dismiss();
    this.spotlight.unfocus();
    this.hotspots.hide();
    this.progress.unmount();
    this.modeToggle.unmount();

    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }
  }

  /* ---- Public convenience API ---- */

  /** Shorthand event subscription. */
  on(event, cb) { this.events.on(event, cb); return this; }
  off(event, cb) { this.events.off(event, cb); return this; }
}

/* ------------------------------------------------------------------ */
/*  UMD / ES Module export                                            */
/* ------------------------------------------------------------------ */

// ES module export
export { WalkthroughEngine, EventBus, TooltipEngine, HotspotSystem, SpotlightOverlay, TourManager, ProgressTracker, ModeToggle };
export default WalkthroughEngine;

// UMD fallback — attach to window when loaded via <script> tag
if (typeof window !== 'undefined') {
  window.WalkthroughEngine = WalkthroughEngine;
}
