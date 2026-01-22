import { useEffect, useState } from "react";
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
    return (
        <div className="controller">
            {THEMES.map((theme) => (
                <span
                    key={theme.id}
                    className={`controller-btn ${activeTheme === theme.id ? "is-active" : ""}`}
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
