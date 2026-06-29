import { useEffect } from "react";
import TemplatesShowcase from "../TemplatesShowcase/TemplatesShowcase";
import "./HybridScroll.scss";
function HybridScroll() {
  function trackHybridZone() {
    const section = document.querySelector(".hybrid-zone");
    if (!section) {
      console.error("Could not find an element with class '.hybrid-zone'");
      return;
    }

    // Get total height of the section
    const totalHeight = section.offsetHeight;
    // Divide the height into 6 equal chunks
    const stageHeight = totalHeight / 6;

    // Run this function every time the user scrolls
    window.addEventListener("scroll", () => {
      // Get the current position relative to the top of the viewport
      const rect = section.getBoundingClientRect();
      const currentScroll = rect.top;

      // Condition 1: Section hasn't reached the top of the screen yet
      if (currentScroll > 0) {
        console.log("Section hasn't reached the top yet.");
        return;
      }

      // Convert the negative scroll into a positive distance traveled (0 to totalHeight)
      const distanceTraveled = Math.abs(currentScroll);

      // Condition 2: Section has been scrolled completely past the screen
      if (distanceTraveled >= totalHeight) {
        console.log(
          "Beyond Section: Scrolled past the hybrid-zone completely.",
        );
        return;
      }

      // Condition 3: Calculate which of the 6 stages the scroll is currently in
      // Math.floor(distance / stageHeight) gives a number from 0 to 5
      const currentStage = Math.floor(distanceTraveled / stageHeight) + 1;

      console.log(
        `Stage ${currentStage} of 6 (Scrolled: ${Math.round(
          distanceTraveled,
        )}px / ${totalHeight}px)`,
      );
      return currentStage;
    });

    console.log(
      "Tracking started for .hybrid-zone! Start scrolling to see the stages.",
    );
  }
  useEffect(() => {
    document?.querySelector(".hybrid-zone") && trackHybridZone();
  }, [document?.querySelector(".hybrid-zone")]);
  return (
    <div className="hybrid-zone">
      {/* Centered Sticky Panel (Main focus of the page) */}
      <div className="sticky-center-panel">
        <TemplatesShowcase limit={6} />
      </div>

      {/* Assisting Sections: Invisible but driving the scroll mechanism */}
      <div className="invisible-scroll-track">
        <div className="scroll-step"></div>
        <div className="scroll-step"></div>
        <div className="scroll-step"></div>
      </div>
    </div>
  );
}
export default HybridScroll;
