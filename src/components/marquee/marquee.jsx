import Marquee from "react-fast-marquee";
import "./styles.css";

function MarqueeComponent() {
  return (
    <div className="marquee-wrapper">
      <Marquee speed={50} gradient={false}>
        <span className="marquee-text">Lundi / 16h - 22h30</span>
        <img src="/images/Vector.svg" alt="Vector" className="marquee-svg" />
        <span className="marquee-text">Mardi / 17h - 22h30</span>
        <img src="/images/Vector.svg" alt="Vector" className="marquee-svg" />
        <span className="marquee-text">Mercredi / 15h - 22h30</span>
        <img src="/images/Vector.svg" alt="Vector" className="marquee-svg" />
        <span className="marquee-text">Jeudi / 17h - 00h00</span>
        <img src="/images/Vector.svg" alt="Vector" className="marquee-svg" />
        <span className="marquee-text">Vendredi / 17h - 01h00</span>
        <img src="/images/Vector.svg" alt="Vector" className="marquee-svg" />
        <span className="marquee-text">Samedi / 14h - 02h00</span>
        <img src="/images/Vector.svg" alt="Vector" className="marquee-svg" />
        <span className="marquee-text">Jeudi / 14h - 19h00</span>
        <img src="/images/Vector.svg" alt="Vector" className="marquee-svg" />
      </Marquee>
    </div>
  );
}

export default MarqueeComponent;
