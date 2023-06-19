import React from 'react'
// import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaBeer, FaShieldAlt } from 'react-icons/fa';

const Button = (props) => {
    return (
        <>
            <Link href={props.destination}>
                <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-md px-4 lg:px-6 py-[0.4rem] font-medium tracking-wide text-white text-xl shadow-2xl border border-[rgba(255,255,255,0.5)]  hover:border-slate-100/20 hover:scale-110 transition duration-300 ease-out  hover:shadow-orange-600 active:translate-y-1">
                    <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500  to-purple-500 opacity-0  transition duration-300 ease-out  group-hover:opacity-100  group-active:opacity-90"></span>
                    <FaShieldAlt className="relative mr-1 text-white" />
                    <span className="relative">{props.content}</span>
                </button>
            </Link>
        </>
    )
}

export default Button