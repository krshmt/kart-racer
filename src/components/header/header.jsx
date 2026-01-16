import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import './styles.css';
import Button from "../Button/Button";
import Menu from "../Menu/menu";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const headerBarRef = useRef(null);
    const panelsRef = useRef(null);
    const overlayRef = useRef(null);
    const hasMountedRef = useRef(false);
    const timelineRef = useRef(null);

    const getClosedHeight = () => {
        const container = containerRef.current;
        const headerBar = headerBarRef.current;

        if (!container || !headerBar) {
            return 0;
        }

        const styles = window.getComputedStyle(container);
        const paddingTop = parseFloat(styles.paddingTop) || 0;
        const paddingBottom = parseFloat(styles.paddingBottom) || 0;
        const barHeight = headerBar.getBoundingClientRect().height;

        return Math.ceil(barHeight + paddingTop + paddingBottom);
    };

    useLayoutEffect(() => {
        const container = containerRef.current;
        const panels = panelsRef.current;
        const overlay = overlayRef.current;

        if (!container || !panels || !overlay) {
            return;
        }

        gsap.set(panels, { autoAlpha: 0, display: "none" });
        gsap.set(overlay, { autoAlpha: 0, display: "none" });
    }, []);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const panels = panelsRef.current;
        const overlay = overlayRef.current;

        if (!container || !panels || !overlay) {
            return;
        }

        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return;
        }

        const widthEase = "power3.out";
        const heightEase = "power2.out";
        const panelsEase = "power1.out";
        const overlayEase = "power1.out";

        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        const timeline = gsap.timeline();

        if (isOpen) {
            gsap.set(overlay, { display: "block" });
            timeline
                .to(overlay, { autoAlpha: 1, duration: 0.2, ease: overlayEase }, 0)
                .to(container, { width: "90vw", duration: 0.6, ease: widthEase }, 0)
                .set(container, { height: () => getClosedHeight() })
                .to(container, { height: "40vh", duration: 0.6, ease: heightEase })
                .set(panels, { display: "flex" })
                .to(panels, { autoAlpha: 1, duration: 0.3, ease: panelsEase });
        } else {
            timeline
                .set(panels, { autoAlpha: 0, display: "none" })
                .set(container, { height: () => container.offsetHeight })
                .to(container, { height: () => getClosedHeight(), duration: 0.5, ease: heightEase })
                .set(container, { height: "auto" })
                .to(container, { width: "50vw", duration: 0.5, ease: widthEase })
                .to(overlay, { autoAlpha: 0, duration: 0.2, ease: overlayEase }, 0)
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
            <div className="header-overlay" ref={overlayRef} onClick={() => setIsOpen(false)} />
            <div className="header-container" ref={containerRef}>
                <div className="header-bar" ref={headerBarRef}>
                    <Menu isActive={isOpen} toggleMenu={toggleMenu} />
                    <img src="./images/image-1.png" alt="" />
                    <Button />
                </div>
                <div className="header-panels" ref={panelsRef}>
                    <div className="header-panel">Bloc 1</div>
                    <div className="header-panel">Bloc 2</div>
                    <div className="header-panel">Bloc 3</div>
                </div>
            </div>
        </header>
    );
}

export default Header;
