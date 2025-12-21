import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// WICHTIG: 'export default' muss hier stehen!
export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto py-12 px-4 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Impressum</h1>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Angaben gemäß § 5 TMG</h2>
            <p>
              Fahrschulfinder GmbH<br />
              Musterstraße 123<br />
              42651 Solingen
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Kontakt</h2>
            <p>
              Telefon: 0123 456789<br />
              E-Mail: info@fahrschulfinder.de
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Vertreten durch</h2>
            <p>Max Mustermann (Geschäftsführer)</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Registereintrag</h2>
            <p>
              Eintragung im Handelsregister.<br />
              Registergericht: Amtsgericht Wuppertal<br />
              Registernummer: HRB 12345
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}