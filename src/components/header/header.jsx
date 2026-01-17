import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import './styles.css';
import Button from "../Button/Button";
import Menu from "../Menu/menu";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [panelsOpen, setPanelsOpen] = useState(false);
    const containerRef = useRef(null);
    const panelsRef = useRef(null);
    const overlayRef = useRef(null);
    const hasMountedRef = useRef(false);
    const timelineRef = useRef(null);
    const entryTweenRef = useRef(null);
    const [panelsHeight, setPanelsHeight] = useState(0);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            gsap.set(container, { clearProps: "transform" });
            return;
        }

        gsap.set(container, { yPercent: -120 });
        entryTweenRef.current = gsap.to(container, {
            yPercent: 0,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "transform",
        });

        return () => {
            if (entryTweenRef.current) {
                entryTweenRef.current.kill();
            }
        };
    }, []);

    useLayoutEffect(() => {
        const overlay = overlayRef.current;

        if (!overlay) {
            return;
        }

        gsap.set(overlay, { autoAlpha: 0, display: "none" });
    }, []);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const overlay = overlayRef.current;

        if (!container || !overlay) {
            return;
        }

        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
        }

        const widthEase = "power3.out";
        const overlayEase = "power1.out";

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        const panelsDurationValue = getComputedStyle(container)
            .getPropertyValue("--panels-duration")
            .trim();
        const panelsDuration = Number.parseFloat(panelsDurationValue) || 0.45;

        const timeline = gsap.timeline();

        if (isOpen) {
            setPanelsOpen(false);
            gsap.set(overlay, { display: "block" });
            timeline
                .to(overlay, { autoAlpha: 1, duration: 0.2, ease: overlayEase }, 0)
                .to(container, { width: "90vw", duration: 0.3, ease: widthEase }, 0)
                .add(() => {
                    const nextHeight = panelsRef.current ? panelsRef.current.scrollHeight : 0;
                    setPanelsHeight(nextHeight);
                    setPanelsOpen(true);
                });
        } else {
            setPanelsOpen(false);
            timeline
                .to(container, { width: "50vw", duration: 0.5, ease: widthEase }, panelsDuration)
                .to(overlay, { autoAlpha: 0, duration: 0.2, ease: overlayEase }, panelsDuration)
                .set(overlay, { display: "none" });
        }

        timelineRef.current = timeline;

        return () => {
            timeline.kill();
        };
    }, [isOpen]);

    const toggleMenu = () => setIsOpen((prev) => !prev);

    return (
        <header>
            <div
                className="header-overlay"
                ref={overlayRef}
                onClick={() => setIsOpen(false)}
                style={{ display: "none", opacity: 0, visibility: "hidden" }}
            />
            <div
                className={`header-container${panelsOpen ? " is-open" : ""}`}
                ref={containerRef}
                style={{ "--panels-max-height": panelsHeight ? `${panelsHeight}px` : "0px" }}
            >
                <div className="header-bar">
                    <Menu isActive={isOpen} toggleMenu={toggleMenu} />
                    <img src="./images/image-1.png" alt="" />
                    <Button />
                </div>
                <div className="header-panels-wrap">
                    <div className="header-panels" ref={panelsRef}>
                        <div className="header-panel">Bloc 1</div>
                        <div className="header-panel">Bloc 2</div>
                        <div className="header-panel">Bloc 3</div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
