import React from 'react'
import { motion } from 'framer-motion';
import Link from 'next/link';

const Button = (props) => {
    return (
        <>
            <Link href={props.destination}>
                {/* <motion.button
                    whileHover={{ y: -3, scale: 1.05, boxShadow: '0 0 10px rgba(255,255,255,0.3)' }}
                    className={`overflow-hidden border border-[rgba(255,255,255,0.4)] before:-translate-x-[12rem] hover:before:translate-x-0 before:block before:absolute before:-inset-3 before:skew-x-[30deg] relative inline-block before:bg-gradient-to-r from-green-400 to-blue-500 transition duration-300 text-white py-2 px-4 mx-1 rounded-md before:transition-all before:duration-500`}>
                    <span className={`relative font-roboto text-lg transition-all duration-500`}>{props.content}</span>
                </motion.button> */}
                <motion.button className="group relative inline-flex items-center justify-center overflow-hidden rounded-md px-12 py-3 font-medium tracking-wide text-white text-xl shadow-2xl border border-slate-100/20 hover:scale-110 transition  duration-300 ease-out  hover:shadow-teal-500 active:translate-y-1 hover:border-none">
                    <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0  transition duration-300 ease-out  group-hover:opacity-100  group-active:opacity-90"></span>
                    <span className="relative">{props.content}</span>
                </motion.button>
            </Link>
        </>
    )
}

export default Button