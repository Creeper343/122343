"use client";

import { useEffect } from "react";
import CookieConsent from "../utils/cookieConsent";

/**
 * Client Component für Next.js app/ - Verwendet die CookieConsent-Utility.
 * Einfach in layout.tsx einbinden (die Datei hier ist minimal).
 */

export default function CookieConsentClient() {
  useEffect(() => {
    CookieConsent.initCookieConsent({
      showBanner: true,
      position: "bottom",
      onConsentChange: (consent) => {
        // Wenn Analytics erlaubt wurde, (re-)initialisiere Analytics-Tools hier
        if (consent?.analytics) {
          CookieConsent.initAnalytics(() => {
            // Beispiel: hier könntest du window.gtag oder ähnliches initialisieren
            // if ((window as any).gtag) { (window as any).gtag('config', 'GA_MEASUREMENT_ID'); }
          });
        }
      },
    });

    // Optional: Cleanup beim Unmount (kein zwingender Bedarf)
    return () => {};
  }, []);

  return null;
}
