import { Account, Client } from 'appwrite';
import React, { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';

const Hero = () => {
  const el = useRef(null);
  const router = useRouter();

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


  const completeVerification = async () => {
    try {
      const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

      const account = new Account(client);
      const response = await account.updateVerification(userId, secret);

      toast.promise(
        Promise.resolve(response), // Use `Promise.resolve` to create a resolved promise with the fileId
        {
          success: () => 'Account verified successfully.',
          error: () => 'Error verifying the account.',
          duration: 3000,
          position: 'top-center',
        }
      );

      router.push('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');
  const secret = urlParams.get('secret');

  if (userId && secret) {
    completeVerification();
  }

  return (
    <>
      <Toaster />
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

