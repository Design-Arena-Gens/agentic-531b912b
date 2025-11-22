"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { sections, ebookMeta } from "@/content/ebook";

function usePageQuery(): [number, (n: number) => void] {
  const [page, setPage] = useState<number>(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const p = parseInt(url.searchParams.get("page") || "1", 10);
    if (!Number.isNaN(p)) setPage(Math.max(1, Math.min(sections.length, p)) - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (n: number) => {
    const clamped = Math.max(0, Math.min(sections.length - 1, n));
    setPage(clamped);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(clamped + 1));
      window.history.replaceState({}, "", url.toString());
    }
  };
  return [page, update];
}

export default function EbookPage() {
  const [page, setPage] = usePageQuery();
  const current = useMemo(() => sections[page], [page]);
  const progress = ((page + 1) / sections.length) * 100;

  const generatePdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // Cover
    doc.setFillColor(82, 67, 170); // brand 700
    doc.rect(0, 0, pageW, pageH, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text(ebookMeta.title, pageW / 2, pageH / 2 - 20, { align: "center" });
    doc.setFontSize(16);
    doc.text(ebookMeta.subtitle, pageW / 2, pageH / 2 + 10, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Auteur: ${ebookMeta.author}`, pageW / 2, pageH / 2 + 40, { align: "center" });

    // Sections
    const marginX = 56;
    const marginY = 64;
    sections.forEach((sec, idx) => {
      if (idx !== 0) doc.addPage();
      doc.setTextColor(20, 20, 20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(`${idx + 1}. ${sec.title}`, marginX, marginY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      let y = marginY + 24;
      const maxW = pageW - marginX * 2;
      for (const p of sec.paragraphs) {
        const lines = doc.splitTextToSize(p, maxW);
        const needed = lines.length * 16 + 8;
        if (y + needed > pageH - marginY) {
          doc.addPage();
          y = marginY;
        }
        doc.text(lines, marginX, y, { maxWidth: maxW });
        y += lines.length * 16 + 12;
      }
      // Footer page number
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text(`${idx + 1} / ${sections.length}`, pageW - marginX, pageH - 24, { align: "right" });
    });

    doc.save("ebook-ecommerce-2025.pdf");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-50 to-white">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-brand-700 hover:text-brand-800">{ebookMeta.title}</Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm text-gray-600">{page + 1} / {sections.length}</div>
            <button onClick={() => setPage(page - 1)} disabled={page === 0} className="px-3 py-2 rounded border text-sm disabled:opacity-40">Pr?c?dent</button>
            <button onClick={() => setPage(page + 1)} disabled={page === sections.length - 1} className="px-3 py-2 rounded border text-sm disabled:opacity-40">Suivant</button>
            <a id="download" href="#download" onClick={(e) => { e.preventDefault(); generatePdf(); }} className="px-3 py-2 rounded bg-brand-600 text-white text-sm hover:bg-brand-700">T?l?charger le PDF</a>
          </div>
        </div>
        <div className="w-full h-1 bg-gray-100">
          <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 py-10">
        <div className="rounded-2xl bg-white shadow-sm border p-6 sm:p-8">
          <p className="text-sm text-gray-500">Chapitre {page + 1}</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">{current.title}</h1>
          <article className="mt-6 space-y-5 text-gray-800 leading-relaxed">
            {current.paragraphs.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </article>

          <div className="mt-8 flex justify-between">
            <button onClick={() => setPage(page - 1)} disabled={page === 0} className="px-4 py-2 rounded border disabled:opacity-40">Pr?c?dent</button>
            <button onClick={() => setPage(page + 1)} disabled={page === sections.length - 1} className="px-4 py-2 rounded bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40">Suivant</button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          {ebookMeta.subtitle} ? {ebookMeta.author}
        </div>
      </section>
    </main>
  );
}
