/**
 * CTA Module for Walkthrough Demo Engine
 * Handles lead capture gates, mid-tour CTAs, and end-screen conversions.
 * Works alongside walkthrough-engine.js via its event system.
 *
 * Usage:
 *   import { CTAModule } from './cta-module.js';
 *   const cta = new CTAModule(config, engine);
 *   cta.init();
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CTAModule = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  /* ------------------------------------------------------------------ */
  /*  CTAModule                                                         */
  /* ------------------------------------------------------------------ */
  class CTAModule {
    constructor(config, engine) {
      this.config = config || {};
      this.engine = engine;
      this.leadData = JSON.parse(sessionStorage.getItem('wt_lead') || 'null');
      this.dismissedCTAs = JSON.parse(sessionStorage.getItem('wt_dismissed_ctas') || '[]');
      this.impressions = {};
      this.startTime = Date.now();
    }

    init() {
      if (this.config.entryGate && this.config.entryGate.enabled && !this.leadData) {
        EntryGate.showGate(this.config.entryGate, this);
      }
      this.engine.on('step:enter', (step) => this._onStepEnter(step));
      this.engine.on('tour:complete', () => this._onTourComplete());
    }

    _onStepEnter(step) {
      if (step.cta && !this.dismissedCTAs.includes(step.cta.id)) {
        MidTourCTA.show(step.cta, this);
      }
    }

    _onTourComplete() {
      if (this.config.endScreen) {
        EndScreenCTA.showEndScreen(this.config.endScreen, this);
      }
    }

    storeLead(data) {
      this.leadData = data;
      sessionStorage.setItem('wt_lead', JSON.stringify(data));
    }

    dismissCTA(id) {
      this.dismissedCTAs.push(id);
      sessionStorage.setItem('wt_dismissed_ctas', JSON.stringify(this.dismissedCTAs));
    }

    getContext() {
      return {
        featuresExplored: this.engine.getCompletedSteps ? this.engine.getCompletedSteps() : [],
        timeSpentMs: Date.now() - this.startTime,
        mode: this.config.mode || 'unknown',
        stepsCompleted: this.engine.currentStepIndex || 0,
        totalSteps: this.config.steps ? this.config.steps.length : 0
      };
    }
  }

  /* ------------------------------------------------------------------ */
  /*  EntryGate                                                         */
  /* ------------------------------------------------------------------ */
  const EntryGate = {
    showGate(gateConfig, mod) {
      const overlay = document.createElement('div');
      overlay.className = 'wt-gate-overlay';

      const modal = document.createElement('div');
      modal.className = 'wt-gate-modal';

      const heading = document.createElement('h2');
      heading.textContent = gateConfig.heading || 'See it in action';
      modal.appendChild(heading);

      const form = document.createElement('form');
      form.className = 'wt-gate-form';
      form.setAttribute('novalidate', '');

      const fields = gateConfig.fields || ['email'];
      fields.forEach((field) => {
        const name = typeof field === 'string' ? field : field.name;
        const required = typeof field === 'string' ? (name === 'email') : !!field.required;
        const input = document.createElement('input');
        input.className = 'wt-gate-input';
        input.name = name;
        input.placeholder = name.charAt(0).toUpperCase() + name.slice(1);
        input.type = name === 'email' ? 'email' : 'text';
        if (required) input.required = true;
        form.appendChild(input);
      });

      if (gateConfig.gdprConsent) {
        const label = document.createElement('label');
        label.className = 'wt-gate-consent';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.name = 'gdpr_consent';
        cb.required = true;
        label.appendChild(cb);
        label.appendChild(document.createTextNode(' ' + (gateConfig.gdprConsent.label || 'I agree to the privacy policy.')));
        form.appendChild(label);
      }

      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.className = 'wt-gate-btn';
      btn.textContent = gateConfig.buttonText || 'Start Demo';
      form.appendChild(btn);

      const errorEl = document.createElement('div');
      errorEl.className = 'wt-gate-error';
      form.appendChild(errorEl);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {};
        let valid = true;
        fields.forEach((field) => {
          const name = typeof field === 'string' ? field : field.name;
          const input = form.querySelector(`[name="${name}"]`);
          data[name] = input.value.trim();
          if (input.required && !data[name]) valid = false;
          if (name === 'email' && data[name] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[name])) valid = false;
        });
        if (gateConfig.gdprConsent) {
          const cb = form.querySelector('[name="gdpr_consent"]');
          if (!cb.checked) valid = false;
          data.gdpr_consent = cb.checked;
        }
        if (!valid) {
          errorEl.textContent = 'Please complete all required fields.';
          return;
        }
        mod.storeLead(data);
        if (gateConfig.webhook) {
          submitLead({ ...data, event: 'gate_submit' }, gateConfig.webhook);
        }
        overlay.remove();
        mod.engine.start();
      });

      modal.appendChild(form);

      if (gateConfig.skipAllowed) {
        const skip = document.createElement('a');
        skip.href = '#';
        skip.className = 'wt-gate-skip';
        skip.textContent = 'Skip and explore on my own';
        skip.addEventListener('click', (e) => {
          e.preventDefault();
          overlay.remove();
          mod.engine.start();
        });
        modal.appendChild(skip);
      }

      overlay.appendChild(modal);
      document.body.appendChild(overlay);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  MidTourCTA                                                        */
  /* ------------------------------------------------------------------ */
  const MidTourCTA = {
    show(ctaConfig, mod) {
      const id = ctaConfig.id || 'mid-cta-' + Date.now();
      mod.impressions[id] = (mod.impressions[id] || 0) + 1;

      const card = document.createElement('div');
      card.className = 'wt-mid-cta';
      card.dataset.ctaId = id;

      const title = document.createElement('strong');
      title.textContent = ctaConfig.title || '';
      card.appendChild(title);

      const desc = document.createElement('p');
      desc.textContent = ctaConfig.description || '';
      card.appendChild(desc);

      const actionBtn = document.createElement('a');
      actionBtn.className = 'wt-mid-cta-action';
      actionBtn.href = ctaConfig.url || '#';
      actionBtn.target = '_blank';
      actionBtn.rel = 'noopener';
      switch (ctaConfig.type) {
        case 'book-demo':
          actionBtn.textContent = ctaConfig.label || 'Book a Demo';
          break;
        case 'start-trial':
          actionBtn.textContent = ctaConfig.label || 'Start Free Trial';
          break;
        case 'contact-sales':
          actionBtn.textContent = ctaConfig.label || 'Contact Sales';
          break;
        default:
          actionBtn.textContent = ctaConfig.label || 'Learn More';
      }
      actionBtn.addEventListener('click', () => {
        if (mod.config.analytics) {
          _trackEvent('cta_click', { id, type: ctaConfig.type });
        }
      });
      card.appendChild(actionBtn);

      const dismiss = document.createElement('button');
      dismiss.className = 'wt-mid-cta-dismiss';
      dismiss.textContent = '\u00d7';
      dismiss.setAttribute('aria-label', 'Dismiss');
      dismiss.addEventListener('click', () => {
        mod.dismissCTA(id);
        card.remove();
      });
      card.appendChild(dismiss);

      document.body.appendChild(card);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  EndScreenCTA                                                      */
  /* ------------------------------------------------------------------ */
  const EndScreenCTA = {
    showEndScreen(endConfig, mod) {
      const overlay = document.createElement('div');
      overlay.className = 'wt-end-screen';

      const inner = document.createElement('div');
      inner.className = 'wt-end-inner';

      const h2 = document.createElement('h2');
      h2.textContent = endConfig.title || 'Tour Complete!';
      inner.appendChild(h2);

      // Feature summary
      const ctx = mod.getContext();
      if (endConfig.summary !== false) {
        const summary = document.createElement('div');
        summary.className = 'wt-end-summary';
        summary.innerHTML =
          '<p>You explored <strong>' + ctx.featuresExplored.length + '</strong> features in ' +
          Math.round(ctx.timeSpentMs / 1000) + ' seconds.</p>';
        inner.appendChild(summary);
      }

      // Primary CTA
      if (endConfig.cta && endConfig.cta.primary) {
        const primary = document.createElement('a');
        primary.className = 'wt-end-cta-primary';
        primary.href = endConfig.cta.primary.url || '#';
        primary.target = '_blank';
        primary.rel = 'noopener';
        primary.textContent = endConfig.cta.primary.label || 'Get Started';
        inner.appendChild(primary);
      }

      // Secondary CTA
      if (endConfig.cta && endConfig.cta.secondary) {
        const secondary = document.createElement('a');
        secondary.className = 'wt-end-cta-secondary';
        secondary.href = endConfig.cta.secondary.url || '#';
        secondary.target = '_blank';
        secondary.rel = 'noopener';
        secondary.textContent = endConfig.cta.secondary.label || 'Learn More';
        inner.appendChild(secondary);
      }

      // Social proof
      if (endConfig.socialProof) {
        const sp = document.createElement('div');
        sp.className = 'wt-end-social-proof';
        sp.innerHTML = endConfig.socialProof;
        inner.appendChild(sp);
      }

      overlay.appendChild(inner);
      document.body.appendChild(overlay);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Data Submission                                                    */
  /* ------------------------------------------------------------------ */
  function submitLead(data, endpoint, retries) {
    retries = typeof retries === 'number' ? retries : 2;
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(function (err) {
      if (retries > 0) {
        return new Promise(function (resolve) {
          setTimeout(function () { resolve(submitLead(data, endpoint, retries - 1)); }, 1500);
        });
      }
      console.error('[CTAModule] Lead submission failed:', err);
    });
  }

  function _trackEvent(name, payload) {
    if (typeof window.wtAnalytics !== 'undefined' && window.wtAnalytics.track) {
      window.wtAnalytics.track(name, payload);
    }
  }

  return CTAModule;
});
