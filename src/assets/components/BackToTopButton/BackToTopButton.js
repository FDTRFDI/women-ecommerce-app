import React from 'react';
import './BackToTopButton.css';
function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button className='back-to-top' onClick={scrollToTop}>
      Back To Top
    </button>
  );
}

export default BackToTopButton;
