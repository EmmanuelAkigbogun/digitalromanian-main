import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import { t } from "../lib/i18n";
import { getCaseStudies } from "../data/caseStudies";
import "./CaseStudyDetail.scss";

function CaseStudyDetail() {
  const { slug } = useParams();
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);
  const caseStudies = getCaseStudies(lang);

  const caseStudy = caseStudies.find((item) => item.id === slug);

  const shareUrl = useMemo(() => {
    if (!caseStudy) return "";
    if (typeof window !== "undefined")
      return `${window.location.origin}${caseStudy.href}`;
    return `https://digitalromanian.com${caseStudy.href}`;
  }, [caseStudy]);

  const shareText = useMemo(() => {
    if (!caseStudy) return "";
    return `${caseStudy.title} — ${caseStudy.excerpt}`;
  }, [caseStudy]);

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  if (!caseStudy) {
    return (
      <section className="dr-case-detail">
        <div className="dr-case-detail-shell">
          <Link to="/portofoliu" className="dr-case-back">
            <span aria-hidden="true">&larr;</span> {t("navbar.portfolio", lang)}
          </Link>
          <h2>{t("case_studies.not_found", lang)}</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="dr-case-detail">
      <div className="dr-case-detail-shell">
        <Link to="/portofoliu" className="dr-case-back">
          <span aria-hidden="true">&larr;</span> {t("navbar.portfolio", lang)}
        </Link>

        <div className="dr-case-hero">
          <div className="dr-case-hero-left">
            <div className="dr-case-meta">
              <span>{caseStudy.type}</span>
              <span>{caseStudy.status}</span>
            </div>

            <h1>{caseStudy.title}</h1>
            <p className="dr-case-sub">{caseStudy.excerpt}</p>

            <a
              href={`https://${caseStudy.domain}`}
              target="_blank"
              rel="nofollow noreferrer"
              className="dr-case-link"
            >
              {caseStudy.domain} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
          <div className="dr-case-hero-right">
            <img
              src={caseStudy.imageUrl}
              alt={
                caseStudy.imageAlt ||
                `${caseStudy.title} - proiect web Digital Romanian`
              }
              width={caseStudy.imageWidth}
              height={caseStudy.imageHeight}
              className="dr-case-image"
              decoding="async"
            />
          </div>
        </div>

        <div className="dr-case-summary">
          <p>{caseStudy.description}</p>
        </div>

        <section className="dr-share-box" aria-label={t("common.share", lang)}>
          <p className="dr-share-title">{t("common.share", lang)}</p>
          <div className="dr-share-actions">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
              target="_blank"
              rel="nofollow noreferrer"
            >
              {t("common.share_whatsapp", lang)}
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="nofollow noreferrer"
            >
              {t("common.share_facebook", lang)}
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(caseStudy.title)}&summary=${encodeURIComponent(caseStudy.excerpt || "")}`}
              target="_blank"
              rel="nofollow noreferrer"
            >
              {t("common.share_linkedin", lang)}
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="nofollow noreferrer"
            >
              {t("common.share_x", lang)}
            </a>
            <button type="button" onClick={handleCopyLink}>
              {copied
                ? t("common.share_copied", lang)
                : t("common.share_copy", lang)}
            </button>
          </div>
        </section>

        {caseStudy.services?.length > 0 && (
          <div className="dr-case-services">
            <h3>{t("case_studies.delivered_title", lang)}</h3>
            <div className="dr-case-services-list">
              {caseStudy.services.map((service) => (
                <span key={service}>{service}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CaseStudyDetail;
