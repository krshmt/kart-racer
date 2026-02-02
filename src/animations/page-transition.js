import { gsap } from "gsap";

const DEFAULT_DURATION = 0.35;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getPageContent = () => document.querySelector("[data-page-content]");
const getBackgroundTargets = () => [document.documentElement, document.body];
const TRANSITION_BG_DATA = "transitionBackground";
const getRootColors = () => {
  const rootStyles = getComputedStyle(document.documentElement);
  const dark = rootStyles.getPropertyValue("--dark-background").trim() || "#201D1D";
  const light = rootStyles.getPropertyValue("--light-background").trim() || "#E9E9E9";
  return { dark, light };
};

const resolveBackgroundColor = (background) => {
  if (!background) return null;
  if (background === "light" || background === "dark") {
    const { dark, light } = getRootColors();
    return background === "light" ? light : dark;
  }
  return background;
};

const setPendingBackground = (color) => {
  const { dataset } = document.documentElement;
  if (!color) {
    delete dataset[TRANSITION_BG_DATA];
    return;
  }
  dataset[TRANSITION_BG_DATA] = color;
};

const consumePendingBackground = () => {
  const { dataset } = document.documentElement;
  const color = dataset[TRANSITION_BG_DATA];
  if (color) {
    delete dataset[TRANSITION_BG_DATA];
    return color;
  }
  return null;
};

export const playExitFade = ({ duration = DEFAULT_DURATION, background } = {}) => {
  const pageContent = getPageContent();
  const backgroundColor = resolveBackgroundColor(background);
  const bgTargets = backgroundColor ? getBackgroundTargets() : null;

  if (!pageContent && !backgroundColor) {
    setPendingBackground(null);
    return Promise.resolve();
  }

  setPendingBackground(backgroundColor);

  if (prefersReducedMotion()) {
    if (pageContent) {
      pageContent.style.opacity = "0";
    }
    if (backgroundColor) {
      bgTargets.forEach((target) => {
        target.style.backgroundColor = backgroundColor;
      });
    }
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });

    if (backgroundColor) {
      tl.to(
        bgTargets,
        {
          backgroundColor,
          duration,
          ease: "power1.out",
          overwrite: "auto",
        },
        0,
      );
    }

    if (pageContent) {
      tl.to(
        pageContent,
        {
          opacity: 0,
          duration,
          ease: "power1.out",
          overwrite: "auto",
        },
        0,
      );
    }
  });
};

export const playEnterFade = ({ duration = DEFAULT_DURATION } = {}) => {
  const pageContent = getPageContent();
  const pendingBackground = consumePendingBackground();
  const bgTargets = pendingBackground ? getBackgroundTargets() : null;

  if (!pageContent && !pendingBackground) {
    return;
  }

  if (prefersReducedMotion()) {
    if (pendingBackground) {
      bgTargets.forEach((target) => {
        target.style.backgroundColor = pendingBackground;
      });
    }
    if (pageContent) {
      pageContent.style.opacity = "1";
    }
    return;
  }

  if (pendingBackground) {
    gsap.set(bgTargets, { backgroundColor: pendingBackground, overwrite: "auto" });
  }

  if (!pageContent) {
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
