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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Angaben gemäß § 5 TMG
            </h2>
            <p>
              Michael Azrak<br />
              Locher Str. 134<br />
              42719 Solingen<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Kontakt
            </h2>
            <p>
              E-Mail: azrakmichael@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p>
              Michael Azrak<br />
              Locher str. 134<br />
              42719 Solingen
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
