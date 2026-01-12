import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto py-12 px-4 w-full text-gray-800">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Allgemeine Nutzungsbedingungen
        </h1>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8">

          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">
              § 1 Geltungsbereich
            </h2>
            <p>
              (1) Diese Nutzungsbedingungen regeln die Nutzung der Website
              <strong> Fahrschulfinder </strong>
              (nachfolgend „Plattform“).<br />
              (2) Die Plattform richtet sich an Fahrschüler sowie an Fahrschulen,
              die Informationen bereitstellen oder abrufen möchten.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">
              § 2 Prototyp- und Beta-Hinweis
            </h2>
            <p>
              (1) Die Plattform befindet sich aktuell in einem
              <strong> Prototyp- bzw. Testbetrieb (Beta)</strong>.<br />
              (2) Es besteht kein Anspruch auf permanente Verfügbarkeit,
              Fehlerfreiheit oder Vollständigkeit der bereitgestellten Inhalte
              und Funktionen.<br />
              (3) Funktionen können jederzeit geändert, eingeschränkt oder
              eingestellt werden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">
              § 3 Leistungsbeschreibung
            </h2>
            <p>
              (1) Die Plattform stellt Informationen zu Fahrschulen zur Verfügung
              und ermöglicht einen Vergleich von Preisen und Leistungen.<br />
              (2) Die Angaben stammen teilweise von Fahrschulen selbst und
              teilweise aus öffentlich zugänglichen Quellen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">
              § 4 Inhalte von Fahrschulen
            </h2>
            <p>
              (1) Fahrschulen sind selbst für die Richtigkeit, Aktualität und
              Rechtmäßigkeit der von ihnen bereitgestellten Inhalte
              verantwortlich.<br />
              (2) Die Plattform übernimmt keine Gewähr für Preisangaben,
              Verfügbarkeiten oder Vertragsbedingungen der Fahrschulen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">
              § 5 Haftungsausschluss
            </h2>
            <p>
              (1) Die Nutzung der Plattform erfolgt auf eigene Gefahr.<br />
              (2) Der Betreiber haftet nur für Schäden, die auf vorsätzlichem
              oder grob fahrlässigem Verhalten beruhen.<br />
              (3) Eine Haftung für entgangene Gewinne, Datenverluste oder
              Folgeschäden ist ausgeschlossen, soweit gesetzlich zulässig.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">
              § 6 Schlussbestimmungen
            </h2>
            <p>
              (1) Es gilt das Recht der Bundesrepublik Deutschland.<br />
              (2) Sollten einzelne Bestimmungen dieser Nutzungsbedingungen
              unwirksam sein, bleibt die Wirksamkeit der übrigen Regelungen
              unberührt.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
