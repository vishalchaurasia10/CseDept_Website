import Image from 'next/image'
import React, { useContext, useEffect } from 'react'
import { semesterDetails } from '@/utils/constants';
import Link from 'next/link';
import noteContext from '@/context/notes/noteContext';
import loadingContext from '@/context/loading/loadingContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Semester = () => {

    const [ref, inView] = useInView({
        triggerOnce: true, // Only trigger the animation once
        threshold: 0.1, // Customize the threshold for triggering the animation
    });

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const NoteContext = useContext(noteContext);
    const { notes, fetchNotes } = NoteContext;
    const LoadingContext = useContext(loadingContext);
    const { loading } = LoadingContext;

    useEffect(() => {
        if (notes.length === 0)
            fetchNotes();
    }, [])

    return (
        <>
            {loading ?
                <div className="loading flex items-center justify-center h-screen">
                    <Image src='/images/loading.gif' width={300} height={300} alt='notes' />
                </div>
                :
                <motion.div
                    className="semesters lg:px-28 px-4 py-20 md:py-24 font-jost"
                    ref={ref}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    variants={variants}
                    transition={{ duration: 0.5 }}>
                    <h1 className='text-7xl pb-8 lg:px-6 font-jost font-extrabold'>Courses</h1>
                    <div className="wrapper flex flex-wrap">
                        {semesterDetails.map((item) => {
                            const { key, title, url } = item;
                            return (
                                <div key={key} className="semester mb-6 mx-2 lg:mx-5 flex flex-col justify-center items-center">
                                    <Link href={`${url}`}>
                                        <Image className='cursor-pointer w-40 lg:w-52 hover:scale-105 transition-all duration-300' src='/images/folder.svg' width={300} height={300} alt='folder' />
                                    </Link>
                                    <Link href={`${url}`}>
                                        <h2 className=' text-xl py-2 font-jost'>{title}</h2>
                                    </Link>
                                </div>
                            )
                        }
                        )}
                    </div>
                </motion.div>}
        </>
    )
}

export default Semester
