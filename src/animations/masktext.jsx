import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export const maskTextAnimation = {
  initial: { y: "110%" },
  enter: (i) => ({
    y: "0",
    transition: {
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1],
      delay: 0.01 * i,
    },
  }),
};

export function MaskItem({
  children,
  className,
  startIndex = 0,
  inView: inViewProp,
}) {
  const { ref, inView: internalInView } = useInView({
    threshold: 0.75,
    triggerOnce: true,
  });
  const isInView = inViewProp ?? internalInView;
  const resolvedRef = inViewProp === undefined ? ref : undefined;

  return (
    <span
      ref={resolvedRef}
      className={className}
      style={{ display: "inline-block", overflow: "hidden" }}
      aria-hidden="true"
    >
      <motion.span
        custom={startIndex}
        variants={maskTextAnimation}
        initial="initial"
        animate={isInView ? "enter" : "initial"}
        style={{ display: "inline-block" }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function MaskText({
  text = "",
  as: Component = "p",
  className,
  startIndex = 0,
  inView: inViewProp,
}) {
  const letters = Array.from(text);
  const { ref, inView: internalInView } = useInView({
    threshold: 0.75,
    triggerOnce: true,
  });
  const isInView = inViewProp ?? internalInView;
  const resolvedRef = inViewProp === undefined ? ref : undefined;

  return (
    <Component
      ref={resolvedRef}
      className={className}
      style={{ display: "inline-block", overflow: "hidden" }}
      aria-label={text}
    >
      {letters.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          style={{ display: "inline-block", overflow: "hidden" }}
          aria-hidden="true"
        >
          <motion.span
            custom={startIndex + index}
            variants={maskTextAnimation}
            initial="initial"
            animate={isInView ? "enter" : "initial"}
            style={{ display: "inline-block" }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
