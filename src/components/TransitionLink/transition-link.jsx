import React, { useCallback, useLayoutEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { playExitFade, releaseScrollLock } from "../../animations/page-transition";

const isModifiedClick = (event) =>
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

const normalizePathname = (pathname) => {
  if (!pathname) {
    return "";
  }
  return pathname.split(/[?#]/)[0] || "";
};

const getToPathname = (to) => {
  if (typeof to === "string") {
    return normalizePathname(to);
  }
  return normalizePathname(to?.pathname || "");
};

let lastResetPathname = null;

const resetScrollPosition = () => {
  if (typeof window === "undefined") {
    return;
  }
  releaseScrollLock({ restoreScroll: false });
  const lenis = window.lenis;
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(0, { immediate: true });
  }
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

function TransitionLink({ to, onClick, children, ...rest }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isTransitioningRef = useRef(false);

  useLayoutEffect(() => {
    isTransitioningRef.current = false;
    if (lastResetPathname === location.pathname) {
      return;
    }
    lastResetPathname = location.pathname;
    resetScrollPosition();
  }, [location.pathname]);

  const handleClick = useCallback(
    async (event) => {
      if (onClick) {
        onClick(event);
      }

      if (event.defaultPrevented) {
        return;
      }

      if (event.button !== 0 || isModifiedClick(event)) {
        return;
      }

      const targetPath = getToPathname(to);
      const currentPath = normalizePathname(location.pathname);

      if (targetPath && targetPath === currentPath) {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      if (isTransitioningRef.current) {
        return;
      }

      isTransitioningRef.current = true;
      const isGoingHome = targetPath === "/" && currentPath !== "/";
      const isLeavingHome = currentPath === "/" && targetPath && targetPath !== "/";
      const background = isLeavingHome ? "light" : isGoingHome ? "dark" : undefined;

      await playExitFade({ background });
      navigate(to);
    },
    [location.pathname, navigate, onClick, to],
  );

  return (
    <Link to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}

export default TransitionLink;
