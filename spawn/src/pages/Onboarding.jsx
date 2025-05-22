import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

// Import the carousel images
import firstImage from '@/assets/app_promo/first.png';
import secondImage from '@/assets/app_promo/second.png';
import thirdImage from '@/assets/app_promo/third.png';

const carouselData = [
  {
    id: 1,
    image: firstImage,
    title: "Stay in the Loop",
    description: "Know what your friends are up to—so you can jump in or start something new."
  },
  {
    id: 2,
    image: secondImage,
    title: "What's Happening Near You",
    description: "Easily spot nearby hangouts, meetups, or last-minute plans worth joining."
  },
  {
    id: 3,
    image: thirdImage,
    title: "Organize Your Circle",
    description: "Group friends by vibe so sending invites takes seconds, not minutes."
  }
];

function Onboarding() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoPlayRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Spawn - Welcome";
  }, []);

  // Auto rotate carousel
  useEffect(() => {
    const play = () => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
    };
    
    autoPlayRef.current = play;
    
    const interval = setInterval(() => {
      autoPlayRef.current();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      setActiveIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
    }
    
    if (touchStart - touchEnd < -100) {
      // Swipe right
      setActiveIndex((prevIndex) => (prevIndex === 0 ? carouselData.length - 1 : prevIndex - 1));
    }
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };



  // Gradient background style
  const bgGradient = {
    background: `radial-gradient(circle at 25% 50%, #EFF1FE, #C0C7FF)`,
    minHeight: '100vh',
  };

  return (
    <div 
      style={bgGradient} 
      className="flex flex-col h-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Logo */}
      <div className="flex justify-center pt-12 pb-4">
        <div className="text-spawn-purple text-3xl font-bold relative inline-block">
          spawn
          <span className="absolute text-spawn-purple text-2xl" style={{ right: "-12px", top: "-5px" }}>⭐</span>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
        <div className="transition-opacity duration-500 flex flex-col items-center justify-center px-8">
          <img 
            src={carouselData[activeIndex].image} 
            alt={`Slide ${activeIndex + 1}`} 
            className="w-full max-w-xs mb-12 transition-transform duration-700 transform"
          />
          
          <h1 className="text-4xl font-bold text-center mb-4">
            {carouselData[activeIndex].title}
          </h1>
          
          <p className="text-lg text-center text-gray-700 max-w-md">
            {carouselData[activeIndex].description}
          </p>
        </div>
        
        {/* Dots/Indicators */}
        <div className="flex justify-center space-x-2 mt-10">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-10 h-2 rounded-full transition-colors duration-300 ${
                index === activeIndex ? 'bg-spawn-purple' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>


    </div>
  );
}

export default Onboarding; 