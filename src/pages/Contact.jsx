import React from 'react'
import BannerSlider from "../components/BannerSlider";
import chair from '../assets/chair.jpg';

function Contact() {
    const slides = [
        {
            id: 1,
            image: chair,
            title: 'Contact Us',
            subtitle: 'We are here to help',
        }
    ];
  return (
    <>
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
    </>
  )
}

export default Contact