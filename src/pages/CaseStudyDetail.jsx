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

  const previewImages = [
    caseStudy.imageUrl1,
    caseStudy.imageUrl2,
    caseStudy.imageUrl3,
  ].filter(Boolean);

  return (
    <section className="dr-case-detail">
      <div className="dr-case-detail-shell">

        {/* BACK */}
        <Link to="/portofoliu" className="dr-case-back">
          <span aria-hidden="true">&larr;</span> {t("navbar.portfolio", lang)}
        </Link>

        {/* HEADER */}
        <div className="dr-case-header">
          <div className="dr-case-meta">
            <span>{caseStudy.type}</span>
            <span>{caseStudy.status}</span>
          </div>
          <h1>{caseStudy.title}</h1>
          <p className="dr-case-excerpt">{caseStudy.excerpt}</p>
          <a
            href={`https://${caseStudy.domain}`}
            target="_blank"
            rel="nofollow noreferrer"
            className="dr-case-visit-btn"
          >
            {t("case_studies.visit_site", lang) || "Visit site"}
            <span aria-hidden="true"> →</span>
          </a>
        </div>
        {/* HERO IMAGE */}
        <div className="dr-case-hero-image">
          <img
            src={caseStudy.imageUrl}
            alt={caseStudy.imageAlt || `${caseStudy.title} - Digital Romanian`}
            width={caseStudy.imageWidth}
            height={caseStudy.imageHeight}
            className="dr-case-image"
            decoding="async"
          />
        </div>

        {/* STORY */}
        <div className="dr-case-story">
          <div className="dr-case-story-text">
            {(caseStudy.paragraphs || []).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <aside className="dr-case-story-side">


            {/* SERVICES */}
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

            {/* SHARE */}
            <div className="dr-share-box">
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

                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(caseStudy.title)}&summary=${encodeURIComponent(caseStudy.excerpt || "")}`}
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
            </div>

          </aside>
        </div>

        {/* FULL PREVIEW */}
        {previewImages.length > 0 && (
          <div className="dr-case-preview">
            <h2 className="dr-case-preview-title">
              {t("case_studies.full_preview", lang) || "Full Preview"}
            </h2>
            <div className="dr-case-preview-grid">
              {previewImages.map((img, i) => {
                const isMobile = i === 0;
                return (
                  <div
                    key={i}
                    className={`dr-case-preview-item${isMobile ? " dr-case-preview-item--mobile" : ""}`}
                  >
                    <img
                      src={img}
                      alt={`${caseStudy.title} preview ${i + 1}`}
                      decoding="async"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section >
  );
}

export default CaseStudyDetail;