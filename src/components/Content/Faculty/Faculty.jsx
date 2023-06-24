import Image from 'next/image'
import React, { useContext, useEffect } from 'react'
import Link from 'next/link';
import facultyContext from '@/context/faculty/facultyContext';
import { FaArrowRight } from 'react-icons/fa';
import loadingContext from '@/context/loading/loadingContext';

const Faculty = () => {

    const FacultyContext = useContext(facultyContext);
    const { faculty, fetchFaculty } = FacultyContext;
    const LoadingContext = useContext(loadingContext);
    const { loading } = LoadingContext;

    useEffect(() => {
        if (faculty.length === 0)
            fetchFaculty();
    }, [])


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
            <div className="semesters lg:px-52 px-4 py-20 md:py-24 font-jost">
                <h1 className='text-7xl pb-8 lg:px-6 font-jost font-extrabold'>Faculties</h1>
                <div className="wrapper flex flex-wrap">
                    {faculty.length > 0 && faculty.map((item) => {
                        const { $id, name, bio, post, profileUrl, url } = item;
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
                                        {bio.length > 0 && <div title={`bio`} className="codeDetails py-2 lg:py-4 mb-1">
                                            <p className='font-jost text-xl text-justify'>{bio}</p>
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
            </div>}
        </>
    )
}

export default Faculty
