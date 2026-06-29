import { useEffect, useState } from "react";
import TemplatesShowcase from "../TemplatesShowcase/TemplatesShowcase";
import "./HybridScroll.scss";
import { t } from "../../lib/i18n";
import { useLanguage } from "../../context/useLanguage";

function HybridScroll({ boolVal = false }) {
  const { lang } = useLanguage();
  const [currentStage, setCurrentStage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const section = document.querySelector(".hybrid-zone");
    if (!section) return;

    function onScroll() {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;

      // Clamp scroll within section
      const scrollTop = Math.min(
        Math.max(-rect.top, 0),
        sectionHeight - windowHeight,
      );
      const progress = scrollTop / (sectionHeight - windowHeight);

      const stage = Math.min(6, Math.floor(progress * 6) + 1);
      setCurrentStage(stage);
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    // run once on mount so it doesn't wait for scroll
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isMobile]);

  return (
    <div className="hybrid-zone">
      <div className="sticky-center-panel">
        {boolVal ? (
          <TemplatesShowcase
            title={t('portfolio.templates_title', lang)}
            subtitle={t('portfolio.templates_subtitle', lang)}
            paginated
            perPage={12}
            limit={6}
            currentStep={currentStage}
          />
        ) : (
          <TemplatesShowcase
            limit={6}
            currentStep={currentStage}
          />
        )}
      </div>

      <div className="invisible-scroll-track">
        <div className="scroll-step"></div>
        <div className="scroll-step"></div>
        <div className="scroll-step"></div>
      </div>
    </div>
  );
}

export default HybridScroll;
