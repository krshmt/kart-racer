import { gsap } from "gsap";

const DEFAULT_DURATION = 0.35;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getPageContent = () => document.querySelector("[data-page-content]");

export const playExitFade = ({ duration = DEFAULT_DURATION } = {}) => {
  const pageContent = getPageContent();
  if (!pageContent) {
    return Promise.resolve();
  }

  if (prefersReducedMotion()) {
    pageContent.style.opacity = "0";
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    gsap.to(pageContent, {
      opacity: 0,
      duration,
      ease: "power1.out",
      onComplete: resolve,
    });
  });
};

export const playEnterFade = ({ duration = DEFAULT_DURATION } = {}) => {
  const pageContent = getPageContent();
  if (!pageContent) {
    return;
  }

  if (prefersReducedMotion()) {
    pageContent.style.opacity = "1";
    return;
  }

  gsap.set(pageContent, { opacity: 0 });
  gsap.to(pageContent, {
    opacity: 1,
    duration,
    ease: "power1.out",
    clearProps: "opacity",
  });
};
