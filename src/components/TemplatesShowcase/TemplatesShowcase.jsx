import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Monitor, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/useLanguage";
import { t } from "../../lib/i18n";
import "./TemplatesShowcase.scss";

const demoGlob = import.meta.glob("../../assets/demo/*.png");

function getDemoImage(id) {
  return demoGlob[`../../assets/demo/${id}.png`]?.().then(
    (module) => module.default,
  );
}

const tabColors = [
  "#f6d365",
  "#fda085",
  "#f093fb",
  "#84fab0",
  "#8fd3f4",
  "#c3a6ff",
];

const templates = Array.from({ length: 50 }, (_, index) => {
  const id = index + 1;

  return {
    id,
    title: `Template ${id}`,
    url: `https://template${id}.digitalromanian.com`,
    color: tabColors[index % tabColors.length],
  };
});

function TemplatesShowcase({
  title,
  subtitle,
  limit,
  paginated = false,
  perPage = 12,
  currentStep = 0,
}) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [demoImages, setDemoImages] = useState({});
  const [usesExternalPreview, setUsesExternalPreview] = useState(false);
  const [userSelectedIndex, setUserSelectedIndex] = useState(null);
  const scrollTimeoutRef = useRef(null);

  const { lang } = useLanguage();

  const shownLimit = typeof limit === "number" ? Math.max(0, limit) : 12;

  const limitedTemplates = useMemo(
    () => templates.slice(0, shownLimit),
    [shownLimit],
  );

  const totalPages = paginated
    ? Math.max(1, Math.ceil(templates.length / perPage))
    : 1;

  const pageIndex = Math.min(currentPage, totalPages);

  const visibleTemplates = useMemo(() => {
    if (!paginated) return limitedTemplates;

    return templates.slice((pageIndex - 1) * perPage, pageIndex * perPage);
  }, [limitedTemplates, pageIndex, paginated, perPage]);

  const maxIndex = Math.max(0, visibleTemplates.length - 1);
  const nextStepIndex = Math.max(0, Math.min(maxIndex, currentStep - 1));

  const renderedActiveIndex =
    userSelectedIndex !== null
      ? userSelectedIndex
      : currentStep
        ? nextStepIndex
        : 0;

  const activeTemplate = useMemo(() => {
    return visibleTemplates[renderedActiveIndex] || visibleTemplates[0];
  }, [visibleTemplates, renderedActiveIndex]);

  const demoImagesRef = useRef(demoImages);
  useEffect(() => {
    demoImagesRef.current = demoImages;
  }, [demoImages]);

  const loadTemplateImage = (id) => {
    if (demoImagesRef.current[id]) return;

    getDemoImage(id)?.then((src) => {
      if (!src) return;
      setDemoImages((current) => {
        if (current[id]) return current;
        return { ...current, [id]: src };
      });
    });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 800px)");

    function syncPreviewMode() {
      setUsesExternalPreview(mediaQuery.matches);
    }

    syncPreviewMode();
    mediaQuery.addEventListener?.("change", syncPreviewMode);

    return () => {
      mediaQuery.removeEventListener?.("change", syncPreviewMode);
    };
  }, []);

  useEffect(() => {
    // 1. Prioritize loading the active template's image
    if (activeTemplate) {
      loadTemplateImage(activeTemplate.id);
    }

    // 2. Preload the next template in sequence (predictive preloading for autoplay)
    const nextIndex = (renderedActiveIndex + 1) % visibleTemplates.length;
    const nextTemplate = visibleTemplates[nextIndex];
    if (nextTemplate) {
      const timeout = setTimeout(() => {
        loadTemplateImage(nextTemplate.id);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [activeTemplate, renderedActiveIndex, visibleTemplates]);

  function getTemplateTitle(template) {
    return t("templates.item_title", lang).replace("{id}", template.id);
  }

  function getTemplatePreviewLabel(template) {
    return t("templates.preview_aria", lang).replace(
      "{title}",
      getTemplateTitle(template),
    );
  }

  function getTemplateImageAlt(template) {
    return t("templates.preview_image_alt", lang).replace(
      "{title}",
      getTemplateTitle(template),
    );
  }

  function openModal(template) {
    if (usesExternalPreview) {
      window.open(template.url, "_blank", "noopener,noreferrer");
      return;
    }
    setSelectedTemplate(template);
  }

  useEffect(() => {
    document.body.style.overflow = selectedTemplate ? "hidden" : "";

    function handleKey(event) {
      if (event.key === "Escape") setSelectedTemplate(null);
    }

    document.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [selectedTemplate]);

  useEffect(() => {
    if (currentStep > 0 && userSelectedIndex !== null) {
      // Clear the timeout if it exists
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // Set a delay before clearing userSelectedIndex to allow scroll animation to complete
      scrollTimeoutRef.current = setTimeout(() => {
        setUserSelectedIndex(null);
      }, 600); // Wait for smooth scroll animation to finish
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentStep, userSelectedIndex]);

  useEffect(() => {
    if (currentStep > 0 || selectedTemplate !== null) return;

    const interval = setInterval(() => {
      setUserSelectedIndex((prevIndex) => {
        const currentIndex = prevIndex !== null ? prevIndex : 0;
        return (currentIndex + 1) % visibleTemplates.length;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [currentStep, renderedActiveIndex, visibleTemplates, selectedTemplate]);

  useEffect(() => {
    if (userSelectedIndex === null) return;

    // Don't scroll on mobile
    if (window.innerWidth <= 768) return;

    const hybridZone = document.querySelector(".hybrid-zone");
    if (!hybridZone) return;

    const stage = userSelectedIndex + 1;
    const sectionHeight = hybridZone.offsetHeight;
    const windowHeight = window.innerHeight;
    const progress = (stage - 1) / 6;
    const scrollTop = progress * (sectionHeight - windowHeight);
    const sectionRect = hybridZone.getBoundingClientRect();
    const sectionAbsoluteTop = window.scrollY + sectionRect.top;
    const offset = windowHeight * 0.15; // Add buffer to avoid stage boundary
    const targetScroll = sectionAbsoluteTop + scrollTop + offset;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  }, [userSelectedIndex]);

  if (!activeTemplate) return null;

  const activeTemplateImage = demoImages[activeTemplate.id];
  const selectedTemplateImage = selectedTemplate
    ? demoImages[selectedTemplate.id]
    : null;

  const modalPortal =
    selectedTemplate && typeof document !== "undefined"
      ? createPortal(
        <div
          className="template-modal-overlay"
          onClick={() => setSelectedTemplate(null)}
        >
          <div
            className="template-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="template-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="template-modal-header">
              <strong id="template-modal-title">
                {getTemplateTitle(selectedTemplate)}
              </strong>

              <div>
                <a
                  href={selectedTemplate.url}
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  <span>{t("templates.open_new_tab", lang)}</span>
                  <ExternalLink size={15} aria-hidden="true" />
                </a>

                <button
                  type="button"
                  aria-label={t("common.close", lang)}
                  onClick={() => setSelectedTemplate(null)}
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="template-modal-preview">
              {selectedTemplateImage && (
                <img
                  src={selectedTemplateImage}
                  alt={getTemplateImageAlt(selectedTemplate)}
                  width="1920"
                  height="1080"
                  decoding="async"
                />
              )}
            </div>
          </div>
        </div>,
        document.body,
      )
      : null;

  return (
    <section className="dr-templates-section" id="templates">
      <div className="dr-templates-header">
        <div>
          <span className="dr-templates-eyebrow">
            {t("templates.eyebrow", lang)}
          </span>
          <h2>{title || t("templates.section_title", lang)}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>

      </div>

      <div className="dr-notebook">
        <div className="dr-notebook-paper">
          <div className="dr-notebook-rings" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="dr-notebook-content" key={activeTemplate.id}>
            <div className="dr-notebook-copy">
              <span
                className="dr-notebook-badge"
                style={{ "--tab-color": activeTemplate.color }}
              >
                T{activeTemplate.id}
              </span>

              <h3>{getTemplateTitle(activeTemplate)}</h3>

              <p>{t("templates.section_subtitle", lang)}</p>

              <div className="dr-notebook-actions">
                <button type="button" onClick={() => openModal(activeTemplate)}>
                  <Monitor size={17} aria-hidden="true" />
                  {usesExternalPreview
                    ? t("templates.open_demo", lang)
                    : t("templates.preview_live", lang)}
                </button>

                <a
                  href={activeTemplate.url}
                  target="_blank"
                  rel="nofollow noreferrer"
                >
                  {t("templates.open_new_tab", lang)}
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              </div>
            </div>

            <button
              className="dr-notebook-image"
              type="button"
              aria-label={getTemplatePreviewLabel(activeTemplate)}
              onClick={() => openModal(activeTemplate)}
            >
              {activeTemplateImage && (
                <img
                  src={activeTemplateImage}
                  alt={getTemplateImageAlt(activeTemplate)}
                  width="1920"
                  height="1080"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </button>
          </div>
        </div>

        <div
          className="dr-notebook-tabs"
          aria-label={t("templates.tabs_label", lang)}
        >
          {visibleTemplates.map((template, index) => (
            <button
              key={template.id}
              type="button"
              className={`dr-notebook-tab${index === renderedActiveIndex ? " is-active" : ""
                }`}
              style={{ "--tab-color": template.color }}
              onClick={() => setUserSelectedIndex(index)}
              onMouseEnter={() => loadTemplateImage(template.id)}
              aria-label={getTemplateTitle(template)}
              aria-pressed={index === renderedActiveIndex}
            >
              T{template.id}
            </button>
          ))}
        </div>
      </div>

      {!paginated && (
        <div className="dr-templates-view-all-wrap">
          <Link to="/portofoliu#templates" className="dr-templates-view-all">
            {t("templates.view_all", lang)}
          </Link>
        </div>
      )}

      {paginated && (
        <div className="dr-templates-pagination">
          <button
            type="button"
            onClick={() => {
              setCurrentPage((page) => Math.max(1, page - 1));
              setUserSelectedIndex(0);
            }}
            disabled={pageIndex === 1}
          >
            {t("templates.pagination_prev", lang)}
          </button>

          <span>
            {t("templates.pagination_label", lang)
              .replace("{page}", pageIndex)
              .replace("{total}", totalPages)}
          </span>

          <button
            type="button"
            onClick={() => {
              setCurrentPage((page) => Math.min(totalPages, page + 1));
              setUserSelectedIndex(0);
            }}
            disabled={pageIndex === totalPages}
          >
            {t("templates.pagination_next", lang)}
          </button>
        </div>
      )}

      {modalPortal}
    </section>
  );
}

export default TemplatesShowcase;
