import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto py-12 px-4 w-full text-gray-800">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Datenschutzerklärung</h1>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">
          
          {/* Abschnitt 1 */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-800">1. Datenschutz auf einen Blick</h2>
            <h3 className="font-semibold mt-4 mb-2">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
            <h3 className="font-semibold mt-4 mb-2">Datenerfassung auf dieser Website</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              <li><strong>Wer ist verantwortlich?</strong> Die Datenverarbeitung erfolgt durch den Websitebetreiber (siehe Impressum).</li>
              <li><strong>Wie erfassen wir Daten?</strong> Zum einen dadurch, dass Sie uns diese mitteilen (z.B. bei der Registrierung als Fahrschule). Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst (z.B. technische Daten wie Browser oder Uhrzeit).</li>
              <li><strong>Wofür nutzen wir Daten?</strong> Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.</li>
            </ul>
          </section>

          {/* Abschnitt 2 */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-800">2. Hosting und Content Delivery Networks (CDN)</h2>
            <p>
              Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
            </p>
            <h3 className="font-semibold mt-2">Vercel & Supabase</h3>
            <p className="text-sm text-gray-600 mt-1">
              Diese Seite wird bei Vercel gehostet. Die Datenbank und Authentifizierung wird durch Supabase bereitgestellt. Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern dieser Anbieter gespeichert.
            </p>
          </section>

          {/* Abschnitt 3 */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-800">3. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className="font-semibold mt-2">Verantwortliche Stelle</h3>
            <p className="mb-2">Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
            <p className="p-3 bg-gray-50 rounded border border-gray-100">
              Michael Azrak<br />
              Locher Str. 134<br />
              42719<br />
              E-Mail: azrakmichael@gmail.com
            </p>
          </section>

          {/* Abschnitt 4 */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-800">4. Datenerfassung auf dieser Website</h2>
            
            <h3 className="font-semibold mt-4 mb-2">Registrierung auf dieser Website</h3>
            <p className="text-sm text-gray-600">
              Wenn Sie sich auf unserer Website als Fahrschule registrieren, speichern wir die von Ihnen eingegebenen Daten (Name, Adresse, Kontaktdaten, Preise), um den Account zu erstellen und Ihr Profil öffentlich anzuzeigen. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Durchführung eines Vertragsverhältnisses).
            </p>

            <h3 className="font-semibold mt-4 mb-2">Kontaktformular / E-Mail Kontakt</h3>
            <p className="text-sm text-gray-600">
              Wenn Sie uns per E-Mail kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten zwecks Bearbeitung Ihres Anliegens bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
          </section>

          {/* Abschnitt 5 */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-800">5. Analyse-Tools und Werbung</h2>
            <p className="text-sm text-gray-600">
              Diese Website nutzt Funktionen für interne Analysen (z.B. Klickzahlen auf Profile), um Fahrschulen Statistiken über ihre Profilaufrufe bereitzustellen. Diese Daten werden anonymisiert oder pseudonymisiert verarbeitet, soweit dies möglich ist.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}