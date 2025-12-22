// src/components/layout/Footer.tsx
import Link from "next/link";
import { Calculator } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <Calculator className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-xl font-bold">Fahrschulfinder</span>
            </div>
            <p className="text-gray-400 text-sm">
              Die transparente Art, deine Fahrschule in Solingen zu finden.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Für Fahrschüler</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/calculator" className="hover:text-white transition-colors">Preisrechner</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Fahrschulen vergleichen</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Für Fahrschulen</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/registration" className="hover:text-white transition-colors">Partner werden</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Links 3 (Hier ist der FAQ Link!) */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hilfe & Rechtliches</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="#faq" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  → Häufige Fragen (FAQ)
                </Link>
              </li>
              <li><Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:text-white transition-colors">AGB</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Fahrschulfinder. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}