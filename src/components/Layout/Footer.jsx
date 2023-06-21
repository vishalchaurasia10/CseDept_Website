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
        </>
    )
}

export default Footer
