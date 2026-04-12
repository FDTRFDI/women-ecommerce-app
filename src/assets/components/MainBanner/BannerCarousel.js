import React, { useState, useEffect } from "react";
import BannerSlide from "./BannerSlide";
import img1 from "../img/background/4.png";


function BannerCarousel() {
  const slides = [
    {
      img: img1,
      title: "Glow Like Never Before",
      subtitle: "Discover premium beauty products",
      btn: "Shop Makeup",
    },
   
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">
      <BannerSlide key={currentIndex} {...slides[currentIndex]} />
    </div>
  );
}

export default BannerCarousel;