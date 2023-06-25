import Image from 'next/image'
import React from 'react'
import { FaBookmark, FaEnvelope, FaGlobeAmericas, FaLink, FaPhone } from 'react-icons/fa'

const Footer = () => {
    return (
        <>
            <div className="footer bg-[#262626] flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:justify-between font-jost text-white px-4 lg:px-28 py-20">
                <div className="logo">
                    <Image src='/images/logo.png' width={200} height={200} alt='RIT_Logo' />
                </div>
                <div className="contacts flex flex-col space-y-4">
                    <h2 className='text-4xl font-jost font-extrabold'>Contact Details</h2>
                    <div className="phone flex space-x-2">
                        <FaPhone className='text-xl rotate-90' />
                        <a className='hover:underline' href="tel:+080-23606939">080-23606939</a>
                    </div>
                    <div className="phone flex space-x-2">
                        <FaPhone className='text-xl rotate-90' />
                        <a className='hover:underline' href="tel:+080-23600822">080-23600822</a>
                    </div>
                    <div className="mail flex space-x-2">
                        <FaEnvelope className='text-xl' />
                        <a className='hover:underline' href="mailto:hod_cs@msrit.edu">hod_cs@msrit.edu</a>
                    </div>
                    <div className="earth flex space-x-2">
                        <FaGlobeAmericas className='text-xl' />
                        <a className='hover:underline' href="http://msrit.edu" target="_blank">msrit.edu</a>
                    </div>
                </div>
                <div className="references flex flex-col space-y-4">
                    <h2 className='text-4xl font-jost font-extrabold'>Supporting Section</h2>
                    <div className="phone flex space-x-2">
                        <FaLink className='text-xl' />
                        <a className='hover:underline' href="https://site.ieee.org/sb-ritb/" target='_blank'>IEEE RIT</a>
                    </div>
                    <div className="phone flex space-x-2">
                        <FaBookmark className='text-xl' />
                        <a className='hover:underline' href="https://msrit.edu/reports.html#Sudarshana">Sudarshana</a>
                    </div>
                    <div className="phone flex space-x-2">
                        <FaBookmark className='text-xl' />
                        <a className='hover:underline' href="https://msrit.edu/reports.html#Pradarshana">Pradarshana</a>
                    </div>
                </div>
                <div className="important flex flex-col space-y-4">
                    <h2 className='text-4xl font-jost font-extrabold'>Links</h2>
                    <div className="phone flex space-x-2">
                        <FaLink className='text-xl' />
                        <a className='hover:underline' href="https://exam.msrit.edu/">SEE Results</a>
                    </div>
                    <div className="phone flex space-x-2">
                        <FaLink className='text-xl' />
                        <a className='hover:underline' href="https://parents.msrit.edu/">Student Information System (SIS)</a>
                    </div>
                </div>
            </div>
            <div className="developer flex flex-col lg:flex-row lg:w-full">
                <div className="copyright px-4 lg:px-28 flex justify-start  lg:w-[60%] md:px-14 pb-5 lg:pb-1 bg-[#262626]">
                    <p className='lg:text-center text-lg whitespace-nowrap text-white pb-2'>© {new Date().getFullYear()} CSE, MSRIT. All rights reserved.</p>
                </div>
                <div className="name pb-6 flex items-center space-x-2 pl-4 pr-20 lg:justify-end lg:w-[40%] bg-[#262626]">
                    <FaGlobeAmericas className='text-xl text-white' />
                    <p className='text-white text-md text-center'><a className='hover:underline whitespace-nowrap' href="https://www.linkedin.com/in/vishal-chaurasia-9a421022a/" target='_blank'>Developed by Vishal Chaurasia</a></p>
                </div>
            </div>
        </>
    )
}

export default Footer
