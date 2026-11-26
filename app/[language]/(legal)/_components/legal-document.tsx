type LegalSection = {
  title: string;
  paragraphs: readonly string[];
  items?: readonly string[];
};

type LegalDocumentProps = {
  title: string;
  summary: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
};

export function LegalDocument({ title, summary, lastUpdated, sections }: LegalDocumentProps) {
  return (
    <article className="mx-auto w-full max-w-3xl">
      <header className="border-b border-line pb-8 sm:pb-10">
        <p className="font-mono text-xs font-semibold tracking-widest text-accent-text uppercase">
          Legal / Template
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base/7 text-muted-foreground sm:text-lg/8">{summary}</p>
        <p className="mt-5 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
      </header>

      <div
        className="my-8 rounded-2xl border border-line bg-muted/50 p-5 text-sm/6 text-muted-foreground sm:p-6"
        role="note"
      >
        <strong className="font-semibold text-foreground">Template notice.</strong> This is starter
        content for product teams, not legal advice. Replace every bracketed placeholder and have
        the final policy reviewed for your business and jurisdictions before publication.
      </div>

      <div className="grid gap-9 pb-8 sm:gap-11 sm:pb-12">
        {sections.map(({ title: sectionTitle, paragraphs, items }, index) => (
          <section key={sectionTitle} aria-labelledby={`legal-section-${index}`}>
            <h2
              id={`legal-section-${index}`}
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              {sectionTitle}
            </h2>
            <div className="mt-4 grid gap-4 text-base/7 text-muted-foreground">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {items ? (
                <ul className="grid list-disc gap-2 pl-6 marker:text-accent-text">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
