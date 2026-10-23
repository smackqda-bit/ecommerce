import PageHead from "./PageHead";

export default function LegalDoc({ crumb, title, updated, sections }: { crumb: string; title: string[]; updated: string; sections: [string, string[]][] }) {
  return (
    <main className="pb-24">
      <PageHead crumb={crumb} eyebrow={`Редакция от ${updated}`} title={title} />
      <div className="wrap grid gap-12 md:grid-cols-[220px_1fr] lg:gap-20">
        <nav aria-label="Содержание" className="hidden md:block">
          <ol className="sticky top-24 flex flex-col gap-2 text-[14px] text-mute">
            {sections.map(([h], i) => (
              <li key={h}>
                <a href={`#s${i + 1}`} className="link-line hover:text-ink">{i + 1}. {h}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="flex max-w-[720px] flex-col gap-10">
          <p className="border border-dashed border-line-2 p-4 text-[14px] text-mute">Шаблон документа для портфолио-проекта. Перед запуском магазина текст нужно согласовать с юристом и подставить реквизиты продавца.</p>
          {sections.map(([h, ps], i) => (
            <section key={h} id={`s${i + 1}`} className="scroll-mt-28">
              <h2 className="mb-4 text-[22px] font-bold">{i + 1}. {h}</h2>
              <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-ink-2">
                {ps.map((p, k) => <p key={k}>{p}</p>)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
