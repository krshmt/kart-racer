import { useLayoutEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MaskItem, MaskText } from "../../animations/masktext";
import "./styles.css";

const TITLE_LINE_ONE = "plus qu'un tour";
const TITLE_ICON_INDEX = Array.from(TITLE_LINE_ONE).length;
const TITLE_LINE_TWO_START = TITLE_ICON_INDEX + 1;

function ScrollImage() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const imageRightRef = useRef(null);
  const imageLeftRef = useRef(null);
  const introductionRef = useRef(null);
  const { ref: titleRef, inView: titleInView } = useInView({
    threshold: 0.75,
    triggerOnce: true,
  });

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const rootStyles = getComputedStyle(document.documentElement);
      const darkBg = rootStyles.getPropertyValue("--dark-background").trim() || "#201D1D";
      const lightBg = rootStyles.getPropertyValue("--light-background").trim() || "#E9E9E9";
      const bgTargets = [document.documentElement, document.body];

      gsap.set(bgTargets, { backgroundColor: darkBg });
      gsap.from(introductionRef.current, {
        opacity: 0,
        y: 100,
        duration: 0.9,
        ease: "circ.out",
      });
      gsap.from(containerRef.current,{
        y: 150,
        duration: 0.9,
        ease: "circ.out",
      });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        })
        .to(
          imageRightRef.current,
          { left: "70%", rotation: 8, ease: "none" },
          0
        )
        .to(
          imageLeftRef.current,
          { left: "30%", rotation: -8, ease: "none" },
          0
        )
        .to(bgTargets, { backgroundColor: lightBg, ease: "none" }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="home">
        <div>
          <div className="title-page" ref={titleRef}>
            <MaskText
              as="h2"
              text={TITLE_LINE_ONE}
              startIndex={0}
              inView={titleInView}
            />
            <MaskItem startIndex={TITLE_ICON_INDEX} inView={titleInView}>
              <img src="/images/Frame.svg" alt="" style={{ display: "block" }} />
            </MaskItem>
            <MaskText
              as="h2"
              text="une expérience"
              startIndex={TITLE_LINE_TWO_START}
              inView={titleInView}
            />
          </div>
          <div className="introduction" ref={introductionRef}>
            <div><p>Découvrez tout ce qu'il faut savoir sur</p>
              <span className="btn-dark btn-dark-bg-1">tarifs</span>
              <span className="btn-dark btn-dark-bg-2">horaires</span>
              <p>ou</p>
              <span className="btn-dark btn-dark-bg-1">karts</span></div>
            <div><p>avec notre</p>
              <span className="btn-dark btn-dark-bg-1">salle de jeux</span>
              <p>&</p>
              <span className="btn-dark btn-dark-bg-2"> séminaires</span></div>
          </div>
        </div>
      </div>
      <div className="scroll-images-section" ref={sectionRef}>
        <div className="images-container" ref={containerRef}>
          <img src="/images/image-2.png" alt="" />
          <img ref={imageRightRef} src="/images/image-3.png" alt="" />
          <img ref={imageLeftRef} src="/images/image-4.png" alt="" />
        </div>
      </div>
      <div className="h-50"></div>
    </>
  );
}

export default ScrollImage;
