import React, { useCallback, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { playExitFade } from "../../animations/page-transition";

const isModifiedClick = (event) =>
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

const getToPathname = (to) => {
  if (typeof to === "string") {
    return to;
  }
  return to?.pathname || "";
};

function TransitionLink({ to, onClick, children, ...rest }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    isTransitioningRef.current = false;
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
      if (targetPath && targetPath === location.pathname) {
        event.preventDefault();
        return;
      }

      event.preventDefault();

      if (isTransitioningRef.current) {
        return;
      }

      isTransitioningRef.current = true;
      await playExitFade();
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
