function Footer() {
  return (
    <footer className="mt-10 bg-gray-900 py-10 text-gray-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-3">
        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">Unternehmen</h2>
          <p className="text-sm text-gray-400">
            Wir bieten Ihnen hochwertige Produkte und großartigen Service.
            Unsere sorgfältig ausgewählten Artikel verbinden Qualität,
            Funktionalität und ein faires Preis-Leistungs-Verhältnis.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Navigation</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="transition hover:text-white">
                Startseite
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-white">
                Über uns
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-white">
                Kontakt
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Folge uns</h2>
          <div className="flex space-x-4">
            <a
              href="#"
              className="flex h-8 w-8 items-center justify-center rounded bg-gray-800 transition hover:bg-gray-700"
            >
              FB
            </a>
            <a
              href="#"
              className="flex h-8 w-8 items-center justify-center rounded bg-gray-800 transition hover:bg-gray-700"
            >
              IG
            </a>
            <a
              href="#"
              className="flex h-8 w-8 items-center justify-center rounded bg-gray-800 transition hover:bg-gray-700"
            >
              X
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © 2025 Unternehmen. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
}

export default Footer;
