import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto py-12 px-4 w-full text-gray-800">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Allgemeine Geschäftsbedingungen (AGB)</h1>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">
          
          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">§ 1 Geltungsbereich</h2>
            <p>
              (1) Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Plattform <strong>Fahrschulfinder</strong> (nachfolgend "Anbieter") durch Fahrschüler ("Nutzer") und Fahrschulen ("Anbieter").<br />
              (2) Abweichende Bedingungen des Nutzers werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich zu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">§ 2 Leistungsbeschreibung</h2>
            <p>
              (1) Der Anbieter stellt ein Online-Portal zur Verfügung, auf dem Nutzer Preise und Leistungen von Fahrschulen vergleichen können.<br />
              (2) Für Fahrschulen bietet die Plattform die Möglichkeit, ein Profil zu erstellen, Preise zu hinterlegen und Statistiken abzurufen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">§ 3 Registrierung für Fahrschulen</h2>
            <p>
              (1) Die Nutzung bestimmter Funktionen (Profilverwaltung, Premium-Statistiken) setzt eine Registrierung voraus.<br />
              (2) Die Fahrschule ist verpflichtet, wahrheitsgemäße Angaben zu machen, insbesondere was Preise und Adressdaten betrifft.<br />
              (3) Der Anbieter behält sich das Recht vor, Profile zu sperren oder zu löschen, die gegen geltendes Recht oder diese AGB verstoßen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">§ 4 Haftung</h2>
            <p>
              (1) Der Anbieter haftet nicht für die Richtigkeit der von den Fahrschulen eingestellten Daten (insbesondere Preise). Der Vertrag über die Fahrschulausbildung kommt ausschließlich zwischen dem Nutzer und der jeweiligen Fahrschule zustande.<br />
              (2) Für Schäden, die durch die Nutzung der Plattform entstehen, haftet der Anbieter nur bei Vorsatz und grober Fahrlässigkeit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">§ 5 Preise und Premium-Funktionen</h2>
            <p>
              (1) Die Grundnutzung für Fahrschulen ist kostenlos.<br />
              (2) Für erweiterte Funktionen (z.B. "Premium Profil") können Gebühren anfallen. Diese werden vor Abschluss eines kostenpflichtigen Abonnements explizit ausgewiesen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">§ 6 Schlussbestimmungen</h2>
            <p>
              (1) Es gilt das Recht der Bundesrepublik Deutschland.<br />
              (2) Sofern es sich beim Nutzer um einen Kaufmann handelt, ist der Gerichtsstand der Sitz des Anbieters.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}