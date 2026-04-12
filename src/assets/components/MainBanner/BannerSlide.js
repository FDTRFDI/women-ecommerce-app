import React from "react";

function BannerSlide({ img, title, subtitle, btn }) {
  return (
    <div className="banner-slide">

      {/* IMAGE */}
      <img src={img} alt={title} />

      {/* OVERLAY */}
      <div className="banner-overlay"></div>

      {/* CONTENT */}
      <div className="banner-content">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <button className="banner-btn">{btn}</button>
      </div>

    </div>
  );
}

export default BannerSlide;