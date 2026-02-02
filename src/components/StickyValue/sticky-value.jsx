import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Copy from "../../animations/Copy";
import "./styles.css";

const values = [
  {
    title: "Le Kart",
    content:
      "Des karts SODI SR4, références incontournables du karting loisir, conçus pour offrir des sensations fortes tout en restant accessibles à tous.",
  },
  {
    title: "Les mini-motos",
    content:
      "un parc d’une quinzaine d’YCF 88cm3 SM ( semi automatique, prise en main facile)  permettront aux participants débutants et pilotes confirmés de pratiquer la mini moto sur notre piste indoor.\nâge minimum requis: 16 ans avec autorisation parentale. (comme équipements , nous fournissons uniquement casque et gants )",
  },
  {
    title: "Puissance & Sensations",
    content:
      "Disponibles en 125 cm³ pour les enfants et 270 cm³ pour les adultes, nos karts offrent des accélérations franches et des sensations fortes, permettant à chacun de vivre une expérience de pilotage intense, quel que soit son âge.",
  },
  {
    title: "Sécurité",
    content:
      "Contrôlés périodiquement, nos karts sont conçus avec des protections intégrales et un châssis sport garantissant une stabilité optimale, afin d’assurer une pratique du karting à la fois ludique et sécurisée.",
  },
];

function StickyValue() {
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const imageWrapRef = useRef(null);
  const imageRef = useRef(null);
  const imageBlockRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const list = listRef.current;
      if (!list) return;

      const items = gsap.utils.toArray(list.querySelectorAll(".value-item"));
      if (!items.length) return;

      const toPx = (value, rootFontSize) => {
        if (!value) return 0;
        const numeric = parseFloat(value);
        if (Number.isNaN(numeric)) return 0;
        if (value.includes("rem")) return numeric * rootFontSize;
        if (value.includes("px")) return numeric;
        return numeric;
      };

      const layoutStack = () => {
        const rootStyles = getComputedStyle(document.documentElement);
        const rootFontSize = parseFloat(rootStyles.fontSize) || 16;
        const listStyles = getComputedStyle(list);
        const gapValue = listStyles.getPropertyValue("--stack-gap").trim();
        const topValue = listStyles.getPropertyValue("--stack-top").trim();
        const gapPx = toPx(gapValue, rootFontSize);
        const baseTopPx = toPx(topValue, rootFontSize) || 8.5 * rootFontSize;

        let offset = 0;
        items.forEach((item) => {
          item.style.setProperty("--item-top", `${baseTopPx + offset}px`);
          const height = item.offsetHeight;
          offset += height + gapPx;
        });

        const totalHeight = baseTopPx + Math.max(0, offset - gapPx);
        list.style.height = `${totalHeight}px`;
      };

      layoutStack();
      ScrollTrigger.addEventListener("refreshInit", layoutStack);

      const entryOffset = () => window.innerHeight * 0.6;
      const revealDistance = () => Math.max(window.innerHeight * 0.5, 20);
      const totalDistance = () =>
        revealDistance() * Math.max(items.length - 1, 1);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: list,
          start: "top top",
          end: () => `+=${totalDistance()}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      gsap.set(items, { y: entryOffset, autoAlpha: 0 });
      gsap.set(items[0], { y: 0, autoAlpha: 1 });

      items.slice(1).forEach((item, index) => {
        tl.to(
          item,
          {
            y: 0,
            autoAlpha: 1,
            ease: "none",
            duration: 1,
          },
          index
        );
      });

      const imageWrap = imageWrapRef.current;
      const image = imageRef.current;
      const imageBlock = imageBlockRef.current;

      if (imageWrap && image && imageBlock) {
        imageBlock.style.backgroundColor = "var(--main)";

        gsap.set(image, { autoAlpha: 0 });
        gsap.set(imageBlock, { scaleX: 0, transformOrigin: "left center" });

        const imageTl = gsap.timeline({
          scrollTrigger: {
            trigger: imageWrap,
            start: "top 90%",
            once: true,
          },
        });

        imageTl.to(imageBlock, {
          scaleX: 1,
          duration: 0.45,
          ease: "power4.inOut",
        });
        imageTl.set(image, { autoAlpha: 1 });
        imageTl.set(imageBlock, { transformOrigin: "right center" });
        imageTl.to(imageBlock, {
          scaleX: 0,
          duration: 0.45,
          ease: "power4.inOut",
        });
      }

      ScrollTrigger.refresh();

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", layoutStack);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="logo-value" ref={containerRef}>
      <div className="logo">
        <div className="logo-reveal" ref={imageWrapRef}>
          <img ref={imageRef} src="/images/image-7.png" alt="" />
          <div className="block-revealer" ref={imageBlockRef} />
        </div>
      </div>
      <div className="values">
        <Copy blockColor="var(--main)" stagger={0.05} duration={0.4}>
          <h2>Un parc entièrement renouvelé régulièrement vous accueille entre amis ou en famille</h2>
        </Copy>
        <div className="list-values" ref={listRef}>
          {values.map((value, idx) => (
            <div className="value-item" key={idx}>
              <Copy blockColor="var(--main)" stagger={0.05} duration={0.4}>
                <h3 className="value-title">{value.title}</h3>
              </Copy>
              <Copy blockColor="var(--main)" stagger={0.05} duration={0.4}>
                <p>{value.content}</p>
              </Copy>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StickyValue;
