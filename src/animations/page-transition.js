import { gsap } from "gsap";

const DEFAULT_DURATION = 0.35;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let scrollLockState = null;

const shouldLockScroll = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  const smallScreen = window.matchMedia("(max-width: 900px)").matches;
  return (coarsePointer && noHover) || smallScreen;
};

const getScrollTop = () =>
  window.scrollY ||
  document.documentElement.scrollTop ||
  document.body.scrollTop ||
  0;

const lockScroll = () => {
  if (typeof window === "undefined" || scrollLockState) {
    return;
  }
  const body = document.body;
  const root = document.documentElement;
  if (!body || !root) {
    return;
  }
  const scrollTop = getScrollTop();
  scrollLockState = {
    scrollTop,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyLeft: body.style.left,
    bodyRight: body.style.right,
    bodyWidth: body.style.width,
    bodyOverflow: body.style.overflow,
    bodyHeight: body.style.height,
    rootOverflow: root.style.overflow,
    rootHeight: root.style.height,
  };

  body.style.position = "fixed";
  body.style.top = `-${scrollTop}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";
  body.style.height = "100%";
  root.style.overflow = "hidden";
  root.style.height = "100%";
};

export const releaseScrollLock = ({ restoreScroll = true } = {}) => {
  if (typeof window === "undefined" || !scrollLockState) {
    return;
  }
  const body = document.body;
  const root = document.documentElement;
  const {
    scrollTop,
    bodyPosition,
    bodyTop,
    bodyLeft,
    bodyRight,
    bodyWidth,
    bodyOverflow,
    bodyHeight,
    rootOverflow,
    rootHeight,
  } = scrollLockState;

  if (body) {
    body.style.position = bodyPosition;
    body.style.top = bodyTop;
    body.style.left = bodyLeft;
    body.style.right = bodyRight;
    body.style.width = bodyWidth;
    body.style.overflow = bodyOverflow;
    body.style.height = bodyHeight;
  }

  if (root) {
    root.style.overflow = rootOverflow;
    root.style.height = rootHeight;
  }

  scrollLockState = null;

  if (restoreScroll) {
    window.scrollTo({ top: scrollTop, left: 0, behavior: "auto" });
  }
};

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

  if (pageContent && shouldLockScroll()) {
    lockScroll();
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
