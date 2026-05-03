import { useTranslations } from "next-intl";

export function TimelineHero() {
  const t = useTranslations("timeline");
  const handlePrint = () => window.print();
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${t("hero_title")} — ElectionGuide AI`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <section className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div>
        <h1 className="text-4xl md:text-[40px] font-bold text-on-surface mb-2 leading-[1.2] tracking-[-0.02em]">
          {t("hero_title")}
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          {t("hero_subtitle")}
        </p>
      </div>
      <div className="flex gap-3 flex-shrink-0">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors text-sm font-medium min-h-[48px]"
        >
          <span className="material-symbols-outlined text-[20px]">print</span>
          {t("print")}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors text-sm font-medium min-h-[48px]"
        >
          <span className="material-symbols-outlined text-[20px]">share</span>
          {t("share")}
        </button>
      </div>
    </section>
  );
}
