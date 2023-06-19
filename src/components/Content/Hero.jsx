import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';


const Hero = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['Welcome to ', 'Department of Computer Science and Engineering,MSRIT'],
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
            {/* <h2 className='text-[1.6rem] font-bold'>Delivering a research-led, experience-based, career-oriented & stimulating environment for producing industry leaders</h2> */}
            <p className='text-[1.85rem] lg:text-[2rem] font-medium lg:px-60'>Delivering a research-led, experience-based, career-oriented & stimulating environment</p>
            {/* <p className='text-[1.6rem] font-bold'>for producing industry leaders</p> */}
            <p className='text-xl px-10 lg:px-0 font-light'>Established in 1984 to meet IT industry and research needs</p>
            {/* <p className='text-xl font-bold'>Initial UG program intake: 60 students (1984)</p>
            <p className='text-xl font-bold'>UG program intake increased to 120 students (1994)</p>
            <p className='text-xl font-bold'>Started PG program in CSE with 18 students (1998)</p>
            <p className='text-xl font-bold'>Currently offers two PG programs:</p> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;

