import gsap from "gsap";
import "./index.css";

function ScrollImage() {
  return (
    <>
      <div className="h-100"></div>
      <div className="images-container">
        <img src="./public/images/image-2.png" alt="" />
        <img src="./public/images/image-3.png" alt="" />
        <img src="./public/images/image-4.png" alt="" />
      </div>
      <div className="h-100"></div>
    </>
  );
}

export default ScrollImage;
