// @ts-nocheck

/**
 * @param {(stepIndex: number) => void} [onStepChangeCallback]
 */
export function initScrollytelling(onStepChangeCallback = () => {}) {
  const section = document.getElementById("scrollySection");
  const steps = document.querySelectorAll(".scrolly-step");
  const tabs = document.querySelectorAll("#stepTabs .step-tab");
  const heroNote = document.getElementById("heroNote");

  let currentStep = -1;
  const totalSteps = steps.length; // 6 steps (0..5)

  function setActiveStep(index = 0) {
    const clamped = Math.max(0, Math.min(totalSteps - 1, index));
    if (clamped === currentStep) return;
    currentStep = clamped;

    steps.forEach((step, i) => {
      step.classList.toggle("active", i === clamped);
    });

    tabs.forEach((tab, i) => {
      tab.classList.toggle("active", i === clamped);
    });

    if (heroNote) {
      heroNote.style.opacity = clamped === 0 ? "1" : "0";
      heroNote.style.transition = "opacity 0.35s ease";
    }

    if (typeof onStepChangeCallback === "function") {
      onStepChangeCallback(clamped);
    }
  }

  function handleScroll() {
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const scrollableHeight = section.offsetHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;

    // Hitung progress 0.0 s/d 1.0 selama berada di dalam scrollySection
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(0.999, scrolled / scrollableHeight));
    const stepIndex = Math.floor(progress * totalSteps);

    setActiveStep(stepIndex);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Jika user klik tab 01 - 06 di bawah layar Desktop
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (!section) return;
      const targetIdx = parseInt(tab.getAttribute("data-step") || "0", 10);
      const scrollableHeight = section.offsetHeight - window.innerHeight;
      const targetY =
        window.scrollY +
        section.getBoundingClientRect().top +
        (targetIdx / totalSteps) * scrollableHeight +
        10;

      window.scrollTo({ top: targetY, behavior: "smooth" });
    });
  });
}
