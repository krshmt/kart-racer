import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import AdultCard from "./Cards/adulte-avec-carte";
import AdultNoCard from "./Cards/adulte-sans-carte";
import TeenagerCard from "./Cards/enfant";
import FormuleCard from "./Cards/formule";
import './styles.css';

const ANIMATION_MS = 450;

const THEMES = [
    { id: "adult", label: "Pour adultes" },
    { id: "enfant", label: "Pour enfants" },
    { id: "formules", label: "Formules" }
];

function ControlledCarrousel({ activeTheme, onSelect }) {
    const controllerRef = useRef(null);
    const indicatorRef = useRef(null);
    const buttonRefs = useRef({});
    const previousActiveRef = useRef(null);
    const hasMountedRef = useRef(false);

    const updateIndicator = useCallback((immediate = false) => {
        const controller = controllerRef.current;
        const indicator = indicatorRef.current;
        const activeButton = buttonRefs.current[activeTheme];

        if (!controller || !indicator || !activeButton) {
            return;
        }

        const controllerBox = controller.getBoundingClientRect();
        const buttonBox = activeButton.getBoundingClientRect();
        const x = buttonBox.left - controllerBox.left;
        const y = buttonBox.top - controllerBox.top;
        const width = buttonBox.width;
        const height = buttonBox.height;
        const radius = getComputedStyle(activeButton).borderRadius;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion || immediate) {
            gsap.set(indicator, { x, y, width, height, borderRadius: radius });
        } else {
            gsap.to(indicator, {
                x,
                y,
                width,
                height,
                borderRadius: radius,
                duration: 0.35,
                ease: "power3.out",
                overwrite: "auto"
            });
        }

        const previousActive = previousActiveRef.current;
        if (previousActive && previousActive !== activeButton) {
            gsap.to(previousActive, { scale: 1, duration: 0.2, ease: "power2.out", overwrite: "auto" });
        }
        gsap.to(activeButton, { scale: 1.03, duration: 0.25, ease: "power2.out", overwrite: "auto" });
        previousActiveRef.current = activeButton;
    }, [activeTheme]);

    useLayoutEffect(() => {
        updateIndicator(!hasMountedRef.current);
        hasMountedRef.current = true;
    }, [updateIndicator]);

    useEffect(() => {
        const handleResize = () => updateIndicator(true);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [updateIndicator]);

    return (
        <div className="controller" ref={controllerRef}>
            <span className="controller-indicator" aria-hidden="true" ref={indicatorRef} />
            {THEMES.map((theme) => (
                <span
                    key={theme.id}
                    className={`controller-btn ${activeTheme === theme.id ? "is-active" : ""}`}
                    ref={(node) => {
                        if (node) {
                            buttonRefs.current[theme.id] = node;
                        }
                    }}
                    onClick={() => onSelect(theme.id)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onSelect(theme.id);
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={activeTheme === theme.id}
                >
                    {theme.label}
                </span>
            ))}
        </div>
    );
}

function Carrousel() {
    const [activeTheme, setActiveTheme] = useState("adult");
    const [exitingTheme, setExitingTheme] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleSelect = (theme) => {
        if (theme === activeTheme) {
            return;
        }
        setExitingTheme(activeTheme);
        setActiveTheme(theme);
        setIsAnimating(true);
    };

    useEffect(() => {
        if (!isAnimating) {
            return;
        }
        const timer = setTimeout(() => {
            setExitingTheme(null);
            setIsAnimating(false);
        }, ANIMATION_MS);

        return () => clearTimeout(timer);
    }, [activeTheme, isAnimating]);

    const renderGroup = (theme, extraClass) => {
        if (!theme) {
            return null;
        }

        return (
            <div className={`card-group ${theme} ${extraClass || ""}`.trim()}>
                {theme === "adult" && (
                    <>
                        <AdultNoCard />
                        <AdultCard />
                    </>
                )}
                {theme === "enfant" && <TeenagerCard />}
                {theme === "formules" && <FormuleCard />}
            </div>
        );
    };

    return (
        <div className="carrousel-controller">
            <ControlledCarrousel activeTheme={activeTheme} onSelect={handleSelect} />
            <div className="carrousel">
                {renderGroup(exitingTheme, "exit-left")}
                {renderGroup(activeTheme, isAnimating ? "enter-right" : "active")}
            </div>
        </div>
    );
}

export default Carrousel;
