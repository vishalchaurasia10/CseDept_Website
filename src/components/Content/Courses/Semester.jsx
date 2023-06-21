import Image from 'next/image'
import React, { useContext, useEffect } from 'react'
import { semesterDetails } from '@/utils/constants';
import Link from 'next/link';
import noteContext from '@/context/notes/noteContext';

const Semester = () => {

    const NoteContext = useContext(noteContext);
    const { notes, fetchNotes } = NoteContext;

    useEffect(() => {
        if(notes.length===0)
            fetchNotes();
    }, [])

    return (
        <>
            <div className="semesters lg:px-28 px-4 py-20 md:py-24 font-jost">
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
            </div>
        </>
    )
}

export default Semester
