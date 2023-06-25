import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link';
import facultyContext from '@/context/faculty/facultyContext';
import { FaArrowRight } from 'react-icons/fa';
import loadingContext from '@/context/loading/loadingContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Faculty = () => {

    const FacultyContext = useContext(facultyContext);
    const { faculty, fetchFaculty } = FacultyContext;
    const LoadingContext = useContext(loadingContext);
    const { loading } = LoadingContext;
    const [isMobile, setIsMobile] = useState(false);


    const [ref, inView] = useInView({
        triggerOnce: true, // Only trigger the animation once
        threshold: 0.1, // Customize the threshold for triggering the animation
    });

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    useEffect(() => {
        if (faculty.length === 0)
            fetchFaculty();
    }, [])

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Add event listener to detect window resize
        window.addEventListener('resize', handleResize);

        // Initial check on component mount
        handleResize();

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function capitalizeWords(str) {
        // Split the string into an array of words
        const words = str.split(' ');

        // Capitalize the first letter of each word
        const capitalizedWords = words.map(word => {
            const firstLetter = word.charAt(0).toUpperCase();
            const restOfWord = word.slice(1).toLowerCase();
            return `${firstLetter}${restOfWord}`;
        });

        // Join the capitalized words back into a string
        const capitalizedString = capitalizedWords.join(' ');

        return capitalizedString;
    }

    return (
        <>{loading ?
            <div className="loading flex items-center justify-center h-screen">
                <Image src='/images/loading.gif' width={300} height={300} alt='notes' />
            </div>
            :
            (faculty.length == 0 ?
                <div className="404 flex space-y-5 flex-col items-center justify-center h-screen">
                    <Image src='/images/error.gif' width={300} height={300} alt='notes' />
                    <h1 className='text-3xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold'>No data has been uploaded</h1>
                </div>
                :
                <motion.div
                    className="semesters lg:px-52 px-4 py-20 md:py-24 font-jost"
                    ref={ref}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    variants={variants}
                    transition={{ duration: 0.5 }}>
                    <h1 className='text-5xl md:text-6xl lg:text-7xl pb-8 lg:px-6 font-jost font-extrabold'>Faculties</h1>
                    <div className="wrapper flex flex-wrap">
                        {faculty.length > 0 && faculty.map((item) => {
                            const { $id, name, bio, post, profileUrl, url } = item;
                            const truncatedBio = bio.length > 80 ? `${bio.substring(0, 80)}...` : bio;
                            return (
                                <>
                                    <div key={$id} className="semester bg-[#D7D9DD] font-jost shadow-2xl shadow-black p-5 rounded-2xl mb-6 mx-1 lg:mx-5 lg:space-x-6 flex flex-col md:flex-row w-full lg:w-full">
                                        <Image title={capitalizeWords(name)} className='cursor-pointer w-full md:w-[40%] lg:w-[30%] rounded-2xl mb-2 lg:mb-3' src={`${url}`} width={300} height={300} alt={capitalizeWords(name)} />
                                        <div className="details md:w-[60%] lg:w-[70%] w-full md:pl-5 lg:pl-0 py-3 flex flex-col">
                                            {name.length > 0 && <div title={capitalizeWords(name)} className="nameDetails flex w-full">
                                                <p className='text-[1.9rem] lg:text-5xl font-extrabold'>{capitalizeWords(name)}</p>
                                            </div>}
                                            {post.length > 0 && <div title={post} className="codeDetails flex">
                                                <p className='text-lg font-light'>{post === 'hod' ? 'Head of the Department(HOD)' : post}</p>
                                            </div>}
                                            {bio.length > 0 && <div title={`${bio}`} className="codeDetails py-2 lg:py-4 mb-1">
                                                <p className='font-jost text-xl text-justify'>{isMobile ? truncatedBio : bio}</p>
                                            </div>}
                                            {profileUrl.length > 0 && <div title={`Full Bio`} className="codeDetails flex">
                                                <Link target='_blank' href={`${profileUrl}`}>
                                                    <p className='group font-bold bg-[rgba(255,255,255,0.5)] p-2 px-3 hover:px-4 hover:shadow-2xl transition-all duration-300 rounded-lg'>Full Bio
                                                        <FaArrowRight className='inline-block group-hover:translate-x-1 transition-all duration-300 ml-1' />
                                                    </p>
                                                </Link>
                                            </div>}
                                        </div>
                                    </div>
                                </>
                            )
                        }
                        )}
                    </div>
                </motion.div>)}
        </>
    )
}

export default Faculty
