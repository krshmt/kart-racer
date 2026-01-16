import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./index.css";

function ScrollImage() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const imageRightRef = useRef(null);
  const imageLeftRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            markers: true,
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
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="h-50"></div>
      <div className="scroll-images-section" ref={sectionRef}>
        <div className="images-container" ref={containerRef}>
          <img src="./public/images/image-2.png" alt="" />
          <img ref={imageRightRef} src="./public/images/image-3.png" alt="" />
          <img ref={imageLeftRef} src="./public/images/image-4.png" alt="" />
        </div>
      </div>
      <div className="h-50"></div>
    </>
  );
}

export default ScrollImage;
