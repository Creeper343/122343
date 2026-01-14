/**
 * Cookie Consent (TypeScript) — Ein Datei zum Kopieren/Einsatz
 *
 * Verwendung:
 * 1. Datei in dein Projekt kopieren, z.B. src/utils/cookieConsent.ts
 * 2. Beim App-Start aufrufen:
 *      import CookieConsent from './utils/cookieConsent';
 *      CookieConsent.initCookieConsent();
 *
 * 3. Wenn du Cookies oder externe Scripte nur bei Zustimmung setzen willst, benutze
 *      CookieConsent.setCookie('name', 'value', { days: 365, category: 'analytics' });
 *      CookieConsent.loadScript('https://example.com/analytics.js', { category: 'analytics' });
 *
 * 4. Du kannst auf Änderungen hören:
 *      window.addEventListener('cookie-consent-changed', (e: CustomEvent) => {
 *        console.log('consent', e.detail);
 *      });
 *
 * Hinweise:
 * - "necessary" ist immer true (technisch notwendige Cookies). Andere Kategorien werden nur gesetzt, wenn zugestimmt wurde.
 * - Die Datei ist framework‑agnostisch (plain DOM + TypeScript). In diesem Repo wird sie von einem Client‑Component aufgerufen.
 */

/* ===========================
   Typen & Storage
   =========================== */

export type Consent = {
  necessary: true; // zwingend true
  analytics?: boolean;
  marketing?: boolean;
  // bei Bedarf weitere Kategorien ergänzen
};

const CONSENT_KEY = 'cookie_consent_v1';

export function getStoredConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Consent;
  } catch {
    return null;
  }
}

export function storeConsent(consent: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // ignore storage errors (private mode etc.)
  }
  // Broadcast event so other parts der App reagieren können
  const ev = new CustomEvent('cookie-consent-changed', { detail: consent });
  window.dispatchEvent(ev);
}

/* ===========================
   Hilfsfunktionen
   =========================== */

export function hasConsentFor<K extends keyof Consent>(category: K): boolean {
  const consent = getStoredConsent();
  if (!consent) return false;
  return Boolean((consent as any)[category]);
}

export function clearStoredConsent() {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {}
  const ev = new CustomEvent('cookie-consent-changed', { detail: null });
  window.dispatchEvent(ev);
}

/* ===========================
   Cookie-API (blockt nach Kategorien)
   =========================== */

/**
 * Optionen zum Setzen von Cookies.
 * category: Legt fest, zu welcher Kategorie der Cookie gehört.
 *   - 'necessary' wird immer gesetzt
 *   - andere nur wenn Zustimmung vorhanden
 */
type SetCookieOptions = {
  days?: number;
  path?: string;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
  category?: 'necessary' | 'analytics' | 'marketing';
};

export function setCookie(
  name: string,
  value: string,
  opts: SetCookieOptions = {}
): void {
  const {
    days = 365,
    path = '/',
    secure = typeof location !== 'undefined' && location.protocol === 'https:',
    sameSite = 'Lax',
    category = 'analytics',
  } = opts;

  // notwendige Cookies dürfen immer gesetzt werden
  if (category !== 'necessary' && !hasConsentFor(category)) {
    // Kein Consent für diese Kategorie -> Cookie nicht setzen
    return;
  }

  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const cookie = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `expires=${expires}`,
    `path=${path}`,
    `SameSite=${sameSite}`,
    secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
  document.cookie = cookie;
}

export function deleteCookie(name: string, path = '/') {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}

/* ===========================
   Script Loader (mit Consent-Prüfung)
   =========================== */

type LoadScriptOptions = {
  async?: boolean;
  defer?: boolean;
  attrs?: Record<string, string>;
  category?: 'necessary' | 'analytics' | 'marketing';
};

export function loadScript(src: string, opts: LoadScriptOptions = {}): HTMLScriptElement | null {
  const { async = true, defer = false, attrs = {}, category = 'analytics' } = opts;

  if (category !== 'necessary' && !hasConsentFor(category)) {
    // Keine Zustimmung -> Script nicht laden
    return null;
  }

  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return existing as HTMLScriptElement;

  const s = document.createElement('script');
  s.src = src;
  s.async = async;
  s.defer = defer;
  Object.keys(attrs).forEach((k) => s.setAttribute(k, attrs[k]));
  document.head.appendChild(s);
  return s;
}

/* ===========================
   Banner UI (einfach, deutsch)
   =========================== */

type InitOptions = {
  // zeigt das Banner direkt, wenn noch keine Entscheidung vorliegt
  showBanner?: boolean;
  // Position des Banners: bottom oder top
  position?: 'bottom' | 'top';
  // Callback bei Consent-Änderung
  onConsentChange?: (consent: Consent | null) => void;
};

const DEFAULTS: Required<Pick<InitOptions, 'showBanner' | 'position'>> = {
  showBanner: true,
  position: 'bottom',
};

function buildBannerElements(position: 'bottom' | 'top') {
  const container = document.createElement('div');
  container.setAttribute('role', 'dialog');
  container.setAttribute('aria-live', 'polite');

  // Basales Styling (inline, damit es ohne CSS-Datei funktioniert)
  const baseStyle: Partial<CSSStyleDeclaration> = {
    position: 'fixed',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'center',
    zIndex: '9999',
    padding: '12px',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    lineHeight: '1.4',
  };
  Object.assign(container.style, baseStyle);
  container.style.background = 'rgba(20,20,20,0.95)';
  container.style.color = '#fff';
  container.style[position] = '0';

  const inner = document.createElement('div');
  inner.style.maxWidth = '980px';
  inner.style.width = '100%';
  inner.style.display = 'flex';
  inner.style.alignItems = 'center';
  inner.style.justifyContent = 'space-between';
  inner.style.gap = '12px';

  const text = document.createElement('div');
  text.style.flex = '1';
  text.style.paddingRight = '12px';
  text.innerHTML =
    '<strong>Diese Website verwendet Cookies</strong> – wir nutzen notwendige Cookies und optional Analysen/Marketing zur Verbesserung. ' +
    'Du kannst alle Cookies akzeptieren oder nur notwendige zulassen.';

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '8px';
  actions.style.alignItems = 'center';

  const btnNecessary = document.createElement('button');
  btnNecessary.textContent = 'Nur notwendige';
  btnNecessary.style.padding = '8px 10px';
  btnNecessary.style.background = '#444';
  btnNecessary.style.color = '#fff';
  btnNecessary.style.border = 'none';
  btnNecessary.style.borderRadius = '4px';
  btnNecessary.style.cursor = 'pointer';

  const btnAccept = document.createElement('button');
  btnAccept.textContent = 'Alle akzeptieren';
  btnAccept.style.padding = '8px 10px';
  btnAccept.style.background = '#0070f3';
  btnAccept.style.color = '#fff';
  btnAccept.style.border = 'none';
  btnAccept.style.borderRadius = '4px';
  btnAccept.style.cursor = 'pointer';

  const btnSettings = document.createElement('button');
  btnSettings.textContent = 'Einstellungen';
  btnSettings.style.padding = '8px 10px';
  btnSettings.style.background = '#222';
  btnSettings.style.color = '#fff';
  btnSettings.style.border = '1px solid #555';
  btnSettings.style.borderRadius = '4px';
  btnSettings.style.cursor = 'pointer';

  actions.appendChild(btnSettings);
  actions.appendChild(btnNecessary);
  actions.appendChild(btnAccept);

  // Settings Panel (Checkboxen für granulare Zustimmung)
  const settingsPanel = document.createElement('div');
  settingsPanel.style.position = 'absolute';
  settingsPanel.style.background = '#fff';
  settingsPanel.style.color = '#000';
  settingsPanel.style.padding = '12px';
  settingsPanel.style.borderRadius = '8px';
  settingsPanel.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
  settingsPanel.style.display = 'none';
  settingsPanel.style.right = '12px';
  settingsPanel.style.top = position === 'bottom' ? '-140px' : '48px';
  settingsPanel.style.minWidth = '240px';
  settingsPanel.style.zIndex = '10000';

  const panelTitle = document.createElement('div');
  panelTitle.textContent = 'Cookie-Einstellungen';
  panelTitle.style.fontWeight = '600';
  panelTitle.style.marginBottom = '8px';

  const row = (labelText: string, id: string, checked: boolean, disabled = false) => {
    const rowEl = document.createElement('div');
    rowEl.style.display = 'flex';
    rowEl.style.alignItems = 'center';
    rowEl.style.gap = '8px';
    rowEl.style.marginBottom = '6px';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.checked = checked;
    input.disabled = disabled;

    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;

    rowEl.appendChild(input);
    rowEl.appendChild(label);
    return { rowEl, input };
  };

  const necessaryRow = row('Notwendige Cookies (erforderlich)', 'cc-necessary', true, true);
  const analyticsRow = row('Analytics', 'cc-analytics', false, false);
  const marketingRow = row('Marketing', 'cc-marketing', false, false);

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Speichern';
  saveBtn.style.marginTop = '8px';
  saveBtn.style.padding = '8px 10px';
  saveBtn.style.background = '#0070f3';
  saveBtn.style.color = '#fff';
  saveBtn.style.border = 'none';
  saveBtn.style.borderRadius = '4px';
  saveBtn.style.cursor = 'pointer';

  settingsPanel.appendChild(panelTitle);
  settingsPanel.appendChild(necessaryRow.rowEl);
  settingsPanel.appendChild(analyticsRow.rowEl);
  settingsPanel.appendChild(marketingRow.rowEl);
  settingsPanel.appendChild(saveBtn);

  inner.appendChild(text);
  inner.appendChild(actions);
  inner.style.position = 'relative';
  inner.appendChild(settingsPanel);

  container.appendChild(inner);

  return {
    container,
    btnAccept,
    btnNecessary,
    btnSettings,
    settingsPanel,
    analyticsCheckbox: analyticsRow.input,
    marketingCheckbox: marketingRow.input,
    saveBtn,
  };
}

let bannerMounted = false;

/**
 * Initialisiert das Consent Banner und die API.
 * - showBanner: Banner nur anzeigen, wenn noch keine Entscheidung vorliegt
 * - position: 'bottom' | 'top'
 * - onConsentChange: Callback bei Änderungen
 */
export function initCookieConsent(options: InitOptions = {}) {
  const { showBanner, position, onConsentChange } = { ...DEFAULTS, ...options };

  const existingConsent = getStoredConsent();

  if (onConsentChange) {
    // initial call mit aktuellem Status
    onConsentChange(existingConsent);
  }

  if (!showBanner) return;

  // Wenn schon entschieden wurde, kein Banner zeigen
  if (existingConsent) return;

  if (typeof document === 'undefined' || bannerMounted) return;

  const els = buildBannerElements(position);

  // Button Aktionen
  els.btnAccept.addEventListener('click', () => {
    const consent: Consent = { necessary: true, analytics: true, marketing: true };
    storeConsent(consent);
    hideBanner(els.container);
    if (onConsentChange) onConsentChange(consent);
  });

  els.btnNecessary.addEventListener('click', () => {
    const consent: Consent = { necessary: true, analytics: false, marketing: false };
    storeConsent(consent);
    hideBanner(els.container);
    if (onConsentChange) onConsentChange(consent);
  });

  els.btnSettings.addEventListener('click', () => {
    els.settingsPanel.style.display = els.settingsPanel.style.display === 'none' ? 'block' : 'none';
  });

  els.saveBtn.addEventListener('click', () => {
    const consent: Consent = {
      necessary: true,
      analytics: Boolean(els.analyticsCheckbox.checked),
      marketing: Boolean(els.marketingCheckbox.checked),
    };
    storeConsent(consent);
    hideBanner(els.container);
    if (onConsentChange) onConsentChange(consent);
  });

  // Klick außerhalb schließt Panel
  document.addEventListener('click', (e) => {
    if (!els.container.contains(e.target as Node)) {
      els.settingsPanel.style.display = 'none';
    }
  });

  document.body.appendChild(els.container);
  bannerMounted = true;
}

function hideBanner(el: HTMLElement) {
  try {
    el.style.display = 'none';
  } catch {}
  bannerMounted = false;
}

/* ===========================
   Optional: Hilfsfunktionen zum (Re-)Initialisieren von Drittanbieter-Tools
   =========================== */

/**
 * Beispiel: initialisiert Analytics nur, wenn bereits Consent besteht.
 * Du kannst diese Funktion beim App-Mount aufrufen, z. B. `initAnalytics(() => {})`.
 */
export function initAnalytics(initFn?: () => void) {
  if (!hasConsentFor('analytics')) return;
  try {
    initFn && initFn();
  } catch {}
}

/* ===========================
   Exports / Default
   =========================== */

export default {
  initCookieConsent,
  getStoredConsent,
  storeConsent,
  hasConsentFor,
  setCookie,
  deleteCookie,
  loadScript,
  initAnalytics,
  clearStoredConsent,
};
