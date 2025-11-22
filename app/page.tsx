import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700">
      <div className="max-w-3xl w-full bg-white/95 rounded-2xl shadow-2xl p-10 mx-4">
        <div className="text-center">
          <div className="inline-block rounded-lg bg-brand-100 text-brand-700 px-3 py-1 text-sm mb-4">Ebook</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            E-commerce: Guide Pratique 2025
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            De l'id?e ? la croissance rentable. Un ouvrage concis et actionnable
            pour lancer, optimiser et scaler votre boutique en ligne.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/ebook" className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold">
              Lire le livre
            </Link>
            <Link href="/ebook#download" className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold">
              T?l?charger le PDF
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
