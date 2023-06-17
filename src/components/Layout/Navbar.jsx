import React, { useState } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from "framer-motion"
import { navbarDetails } from '@/utils/constants';
import Button from './Button';

const Navbar = () => {

    const router = useRouter();
    const [navExpand, setNavExpand] = useState(false)

    const expandNav = () => {
        setNavExpand(!navExpand)
    }

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className='z-20 text-white font-jost fixed top-0 left-0 right-0 bg-black flex justify-between items-center px-5 md:px-10 py-4'>

                <div className="left w-1/4 lg:w-full ">
                    <Link href='/'>
                        <h1 className={`logo font-roboto font-extrabold text-2xl`}>Msrit<span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500'>CSE</span> </h1>
                    </Link>
                </div>

                <div className="center lg:w-full hidden lg:block">
                    <ul className='flex items-center justify-center space-x-6 text-xl'>
                        {
                            navbarDetails.map((item) => {
                                const { key, title, url, options } = item;
                                return (
                                    <Link key={key} href={`${url}`}>
                                        <div className="relative group">
                                            <span className={`hover:bg-[rgba(255,255,255,0.2)] ${router.pathname == { url } ? 'bg-[rgba(255,255,255,0.2)]' : ''} p-1 px-4 rounded-md transition-all duration-300 cursor-pointer`}>{title}</span>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </ul>
                </div>

                <div className="right w-3/4 lg:w-full flex justify-end">
                    <Button destination='/adminPanel' content='Admin' />
                </div>

                <div className="hamburger relative -mr-2 ml-2 lg:hidden space-y-1">
                    <div onClick={expandNav} className={`${navExpand ? '-rotate-45 translate-y-[0.45rem]' : ''} w-6 transition-all duration-300 rounded-full bg-white h-1`}></div>
                    <div onClick={expandNav} className={`${navExpand ? 'scale-0' : ''} w-6 transition-all duration-300 rounded-full bg-white h-1`}></div>
                    <div onClick={expandNav} className={`${navExpand ? 'rotate-45 -translate-y-2' : ''} w-6 transition-all duration-300 rounded-full bg-white h-1`}></div>
                </div>
            </motion.nav >

            <div className={`expanded lg:hidden w-full text-white z-[15] h-screen flex flex-col items-center justify-center backdrop-blur-3xl fixed top-0 transition-all duration-500 ${navExpand ? '' : 'translate-x-[60rem]'}`}>
                <h1 className={`logo font-jost my-4 font-extrabold text-5xl`}>Msrit<span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500'>CSE</span> </h1>
                <ul className={`flex text-2xl space-y-4 flex-col justify-center font-jost text-center items-center`}>
                    <li onClick={expandNav} className='cursor-pointer'><Link href='/'>Home</Link></li>
                    <li onClick={expandNav} className='cursor-pointer'><Link href='/courses'>Courses</Link></li>
                    <li onClick={expandNav} className='cursor-pointer'><Link href='/faculty'>Faculty</Link></li>
                    <li onClick={expandNav} className='cursor-pointer'><Link href='/time-table'>Time Table</Link></li>
                    <li onClick={expandNav} className='cursor-pointer'><Link href='/announcements'>Announcements</Link></li>
                </ul>
            </div>

        </>
    )
}

export default Navbar