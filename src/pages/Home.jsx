import React from 'react'
import BannerSlider from '../components/BannerSlider';
import soffa from '../assets/soffa.jpg';
import chair from '../assets/chair.jpg';

function Home() {
 const slides = [
    {
      id: 1,
      image: soffa,
      title: 'Explore Nature',
      subtitle: 'Discover the beauty of untouched landscapes',
      buttonText: 'Learn More',
      buttonLink: '#'
    },
    {
      id: 2,
      image: chair,
      title: 'Urban Adventures',
      subtitle: 'Experience the pulse of modern city life',
      buttonText: 'Explore',
      buttonLink: '#'
    },
  ];

  return (
    <div>
      <BannerSlider 
        slides={slides} 
        height="500px"
        autoPlay={true}
        interval={3000}
        showArrows={true}
        showDots={true}
        dotActiveColor="#4CAF50"
        backgroundColor="#333" />
    </div>
  )
}

export default Home