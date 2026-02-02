import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import "./scroll-showcase.css";
import StickyValue from "../StickyValue/sticky-value";
import Copy from "../../animations/Copy";

gsap.registerPlugin(ScrollTrigger);

const titlesData = [
  "Notre galerie",
  "nos moments forts",
  "Nos courses",
  "Au cœur de l’action",
];

const cardPositions = [
  { top: "30%", left: "55%" },
  { top: "20%", left: "25%" },
  { top: "50%", left: "10%" },
  { top: "60%", left: "40%" },
  { top: "30%", left: "30%" },
  { top: "60%", left: "60%" },
  { top: "20%", left: "50%" },
  { top: "60%", left: "10%" },
  { top: "20%", left: "40%" },
  { top: "45%", left: "55%" },
];

export default function ScrollShowcase() {
  const [visibleTitles, setVisibleTitles] = useState(
    () => titlesData.map(() => false)
  );
  const titlesRef = useRef(null);
  const stickyRef = useRef(null);
  const cardsRef = useRef([]);
  const moveDistanceRef = useRef(0);
  const visibleTitlesRef = useRef(new Set());

  useEffect(() => {
    // 🔥 Lenis
    const lenis = new Lenis();
    const handleLenisScroll = () => ScrollTrigger.update();
    const handleLenisRaf = (time) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", handleLenisScroll);
    gsap.ticker.add(handleLenisRaf);
    gsap.ticker.lagSmoothing(0);

    const updateMoveDistance = () => {
      if (!titlesRef.current) return;
      const totalWidth = titlesRef.current.scrollWidth || 0;
      moveDistanceRef.current = Math.max(0, totalWidth - window.innerWidth);
    };
    updateMoveDistance();

    const handleResize = () => {
      updateMoveDistance();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    // Init cards
    cardsRef.current.forEach((card) => {
      gsap.set(card, {
        z: -50000,
        scale: 0,
      });
    });

    const checkTitleVisibility = () => {
      if (!titlesRef.current) return;
      const titleElements = Array.from(
        titlesRef.current.querySelectorAll(".title")
      );

      titleElements.forEach((title, index) => {
        if (visibleTitlesRef.current.has(index)) return;
        const rect = title.getBoundingClientRect();
        const isVisible =
          rect.left < window.innerWidth * 0.85 &&
          rect.right > window.innerWidth * 0.15;

        if (isVisible) {
          visibleTitlesRef.current.add(index);
          setVisibleTitles((prev) => {
            if (prev[index]) return prev;
            const next = [...prev];
            next[index] = true;
            return next;
          });
        }
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: stickyRef.current,
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(titlesRef.current, {
          x: -moveDistanceRef.current * self.progress,
        });

        const velocity = self.getVelocity();
        const normalizedVelocity = velocity / Math.abs(velocity) || 0;
        const currentSpeed = Math.min(Math.abs(velocity / 500), 30);
        const isAtEdge = self.progress <= 0 || self.progress >= 1;

        document.querySelectorAll(".title").forEach((title) => {
          const t1 = title.querySelector(".title-1");
          const t2 = title.querySelector(".title-2");
          const t3 = title.querySelector(".title-3");

          if (isAtEdge) {
            gsap.to([t1, t2], {
              xPercent: -50,
              x: 0,
              duration: 0.3,
              ease: "power2.out",
              overwrite: true,
            });
          } else {
            const offset = normalizedVelocity * currentSpeed;

            gsap.to(t1, {
              xPercent: -50,
              x: offset * 4,
              duration: 0.2,
              overwrite: "auto",
            });

            gsap.to(t2, {
              xPercent: -50,
              x: offset * 2,
              duration: 0.2,
              overwrite: "auto",
            });
          }

          gsap.set(t3, { xPercent: -50, x: 0 });
        });

        cardsRef.current.forEach((card, index) => {
          const stagger = index * 0.075;
          const p = Math.max(0, Math.min(1, (self.progress - stagger) * 3));
          const targetZ = index === cardsRef.current.length - 1 ? 1500 : 2000;

          gsap.set(card, {
            z: -50000 + (targetZ + 50000) * p,
            scale: Math.min(1, p * 10),
          });
        });

        checkTitleVisibility();
      },
    });

    checkTitleVisibility();

    return () => {
      window.removeEventListener("resize", handleResize);
      trigger.kill();
      gsap.ticker.remove(handleLenisRaf);
      lenis.off("scroll", handleLenisScroll);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div className="scroll-showcase">
        <section className="sticky" ref={stickyRef}>
          <div className="titles" ref={titlesRef}>
            {titlesData.map((title, i) => (
              <div className="title" key={i}>
                {visibleTitles[i] ? (
                  <>
                    <Copy
                      animateOnScroll={false}
                      blockColor="currentColor"
                      stagger={0.05}
                      duration={0.4}
                    >
                      <h1 className="title-1">{title}</h1>
                    </Copy>
                    <Copy
                      animateOnScroll={false}
                      blockColor="currentColor"
                      stagger={0.05}
                      duration={0.4}
                    >
                      <h1 className="title-2">{title}</h1>
                    </Copy>
                    <Copy
                      animateOnScroll={false}
                      blockColor="currentColor"
                      stagger={0.05}
                      duration={0.4}
                    >
                      <h1 className="title-3">{title}</h1>
                    </Copy>
                  </>
                ) : (
                  <>
                    <h1 className="title-1">{title}</h1>
                    <h1 className="title-2">{title}</h1>
                    <h1 className="title-3">{title}</h1>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="images">
            {cardPositions.map((pos, i) => (
              <div
                key={i}
                className="card"
                ref={(el) => (cardsRef.current[i] = el)}
                style={{ top: pos.top, left: pos.left }}
              >
                <img src={`/src/assets/img${i + 1}.jpg`} alt="" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
