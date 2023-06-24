import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';


const Hero = () => {
  const el = useRef(null);

  useEffect(() => {
    if (el.current == null) return;
    const typed = new Typed(el.current, {
      strings: ['Welcome to ', 'Department of Computer Science and Engineering, MSRIT'],
      typeSpeed: 30,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  return (
    <>
      <div className="hero bg-[url('/images/binary.jpg')] h-screen bg-cover bg-center flex items-center justify-center font-jost">
        <div className="content  text-white flex flex-col items-center justify-center">
          <h1 ref={el} className="text-4xl lg:text-7xl lg:px-40 text-center font-extrabold typed-text"></h1>
          <div className="text-center my-4">
            <p className='text-[1.85rem] lg:text-[2rem] font-medium lg:px-60'>Delivering a research-led, experience-based, career-oriented & stimulating environment</p>
            <p className='text-xl px-10 lg:px-0 font-light'>Established in 1984 to meet IT industry and research needs</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;

