import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import "./styles.css";
import Button from "../Button/Button";
import Menu from "../Menu/menu";
import MarqueeComponent from "../marquee/marquee";

gsap.registerPlugin(CustomEase);
const easeInOut = CustomEase.create("headerEase", "0.625, 0.05, 0, 1");

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [panelsOpen, setPanelsOpen] = useState(false);
    const containerRef = useRef(null);
    const panelsRef = useRef(null);
    const overlayRef = useRef(null);
    const marqueeRef = useRef(null);
    const hasMountedRef = useRef(false);
    const hasInteractedRef = useRef(false);
    const timelineRef = useRef(null);
    const entryTweenRef = useRef(null);
    const [panelsHeight, setPanelsHeight] = useState(0);
    const marqueeHeightRef = useRef(0);
    const getClosedWidth = () => (window.innerWidth < 950 ? "70vw" : "50vw");

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
            gsap.set(container, { clearProps: "transform" });
            return;
        }

        gsap.set(container, { yPercent: -120 });
        entryTweenRef.current = gsap.to(container, {
            yPercent: 0,
            duration: 0.7,
            ease: easeInOut,
        });

        return () => {
            if (entryTweenRef.current) {
                entryTweenRef.current.kill();
            }
        };
    }, []);

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const applyClosedWidth = () => {
            if (!isOpen) {
                gsap.set(container, { width: getClosedWidth() });
            }
        };

        applyClosedWidth();
        window.addEventListener("resize", applyClosedWidth);

        return () => {
            window.removeEventListener("resize", applyClosedWidth);
        };
    }, [isOpen]);

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
        const marquee = marqueeRef.current;

        if (!container || !overlay) {
            return;
        }

        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
        }

        if (!hasInteractedRef.current) {
            return;
        }

        const marqueeShiftDuration = 0.2;
        const marqueeCollapseDuration = 0.15;
        const openWidthDuration = 0.3;
        const closeWidthDuration = 0.5;
        const marqueeShift = -45;

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        const panelsDurationValue = getComputedStyle(container)
            .getPropertyValue("--panels-duration")
            .trim();
        const panelsDuration = Number.parseFloat(panelsDurationValue) || 0.45;

        const measuredMarqueeHeight = marquee ? marquee.scrollHeight : 0;
        if (measuredMarqueeHeight) {
            marqueeHeightRef.current = measuredMarqueeHeight;
        }
        const marqueeHeight = marqueeHeightRef.current;

        const timeline = gsap.timeline();

        if (isOpen) {
            setPanelsOpen(false);
            gsap.set(overlay, { display: "block" });

            let widthStart = 0;
            if (marquee) {
                gsap.set(marquee, { maxHeight: marqueeHeight, y: 0 });
                timeline
                    .to(
                        marquee,
                        {
                            y: marqueeShift,
                            duration: marqueeShiftDuration,
                            ease: easeInOut,
                        },
                        0,
                    )
                    .to(
                        marquee,
                        {
                            maxHeight: 0,
                            duration: marqueeCollapseDuration,
                            ease: easeInOut,
                        },
                        marqueeShiftDuration,
                    );
                widthStart = marqueeShiftDuration + marqueeCollapseDuration;
            }

            timeline
                .to(overlay, { autoAlpha: 1, duration: 0.2, ease: easeInOut }, 0)
                .to(
                    container,
                    { width: "90vw", duration: openWidthDuration, ease: easeInOut },
                    widthStart,
                )
                .add(() => {
                    const nextHeight = panelsRef.current
                        ? panelsRef.current.scrollHeight
                        : 0;
                    setPanelsHeight(nextHeight);
                    setPanelsOpen(true);
                });
        } else {
            setPanelsOpen(false);
            timeline
                .to(
                    container,
                    { width: getClosedWidth(), duration: closeWidthDuration, ease: easeInOut },
                    panelsDuration,
                )
                .to(
                    overlay,
                    { autoAlpha: 0, duration: 0.2, ease: easeInOut },
                    panelsDuration,
                )
                .set(overlay, { display: "none" });

            if (marquee) {
                timeline.to(
                    marquee,
                    {
                        y: 0,
                        maxHeight: marqueeHeight,
                        duration: marqueeShiftDuration,
                        ease: easeInOut,
                        clearProps: "maxHeight,transform",
                    },
                    panelsDuration + closeWidthDuration,
                );
            }
        }

        timelineRef.current = timeline;

        return () => {
            timeline.kill();
        };
    }, [isOpen]);

    const toggleMenu = () => {
        hasInteractedRef.current = true;
        setIsOpen((prev) => !prev);
    };

    return (
        <header>
            <div
                className="header-overlay"
                ref={overlayRef}
                onClick={() => setIsOpen(false)}
                style={{ display: "none", opacity: 0, visibility: "hidden" }}
            />
            <div
                className={`header-stack${isOpen ? " is-open" : ""}`}
                ref={containerRef}
                style={{
                    "--panels-max-height": panelsHeight ? `${panelsHeight}px` : "0px",
                }}
            >
                <div className={`header-container${panelsOpen ? " is-open" : ""}`}>
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
                <div className="marquee-container" ref={marqueeRef}>
                    <MarqueeComponent />
                </div>
            </div>
        </header>
    );
}

export default Header;
