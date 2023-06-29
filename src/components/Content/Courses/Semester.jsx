import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link';
import loadingContext from '@/context/loading/loadingContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import noteContext from '@/context/notes/noteContext';

const Semester = () => {

    const [ref, inView] = useInView({
        triggerOnce: true, // Only trigger the animation once
        threshold: 0.1, // Customize the threshold for triggering the animation
    });

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const LoadingContext = useContext(loadingContext);
    const { loading } = LoadingContext;
    const NoteContext = useContext(noteContext);
    const { notes, fetchSemestersNotes } = NoteContext;
    const [ugsemester, setUgsemester] = useState([]);
    const [pgsemester, setPgsemester] = useState([]);
    const [vocationalsemester, setVocationalsemester] = useState([]);
    const [coresemester, setCoresemester] = useState([]);
    const [opensemester, setOpensemester] = useState([]);

    useEffect(() => {
        fetchSemestersNotes(-1, -1, -1);
    }, []);

    useEffect(() => {
        applyFilter();
    }, [notes]);

    const applyFilter = () => {
        const UgSemesters = new Set();
        const filteredUgSemesters = notes.filter((note) => {
            if (note.course === 'ug' && !UgSemesters.has(note.semester)) {
                UgSemesters.add(note.semester);
                return true;
            }
            return false;
        });

        const PgSemesters = new Set();
        const filteredPgSemesters = notes.filter((note) => {
            if (note.course === 'pg' && !PgSemesters.has(note.semester)) {
                PgSemesters.add(note.semester);
                return true;
            }
            return false;
        });

        const VocationalSemesters = new Set();
        const filteredVocationalSemesters = notes.filter((note) => {
            if (note.course === 'vocational' && !VocationalSemesters.has(note.semester)) {
                VocationalSemesters.add(note.semester);
                return true;
            }
            return false;
        });

        const CoreSemesters = new Set();
        const filteredCoreSemesters = notes.filter((note) => {
            if (note.course === 'core' && !CoreSemesters.has(note.semester)) {
                CoreSemesters.add(note.semester);
                return true;
            }
            return false;
        });

        const OpenSemesters = new Set();
        const filteredOpenSemesters = notes.filter((note) => {
            if (note.course === 'open' && !OpenSemesters.has(note.semester)) {
                OpenSemesters.add(note.semester);
                return true;
            }
            return false;
        });

        setUgsemester(filteredUgSemesters);
        setPgsemester(filteredPgSemesters);
        setVocationalsemester(filteredVocationalSemesters);
        setCoresemester(filteredCoreSemesters);
        setOpensemester(filteredOpenSemesters);
    }

    return (
        <>
            {loading ?
                <div className="loading flex items-center justify-center h-screen">
                    <Image src='/images/loading.gif' width={300} height={300} alt='notes' />
                </div>
                :
                (
                    <>
                        {ugsemester.length === 0 ?
                            <div className="404 px-4 lg:px-28 flex space-y-5 flex-col items-center lg:items-start justify-center my-14">
                                <h1 className="text-5xl lg:text-7xl pb-8 mx-4 lg:mt-10 font-jost font-extrabold">UG Courses</h1>
                                <h1 className="text-3xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold">No data has been uploaded</h1>
                            </div>
                            :
                            <motion.div
                                className="semesters lg:px-28 px-4 py-20 md:py-24 flex flex-col items-center justify-center font-jost"
                                ref={ref}
                                initial="hidden"
                                animate={inView ? 'visible' : 'hidden'}
                                variants={variants}
                                transition={{ duration: 0.5 }}>
                                <div className="heading text-left w-full ">
                                    <h1 className='text-5xl lg:text-7xl pb-8 mx-4 lg: font-jost font-extrabold'>UG Courses</h1>
                                </div>
                                <div className="wrapper flex flex-wrap lg:w-full justify-around lg:justify-normal items-center">
                                    {ugsemester.map((item) => {
                                        const { $id, semester, course } = item;
                                        const url = `/courses/${course}/${`semester${semester}`}`;
                                        return (
                                            <div key={$id} className="semester mb-6 mx-2 lg:mx-5 flex flex-col justify-center items-center">
                                                <Link href={`${url}`}>
                                                    <Image className='cursor-pointer w-36 lg:w-44 hover:scale-105 transition-all duration-300' src='/images/folder.svg' width={300} height={300} alt='folder' />
                                                </Link>
                                                <Link href={`${url}`}>
                                                    <h2 className=' text-lg  py-2 font-jost'>{`Semester ${semester}`}</h2>
                                                </Link>
                                            </div>
                                        )
                                    }
                                    )}
                                </div>
                            </motion.div>}

                        {pgsemester.length === 0 ?
                            <div className="404 px-4 lg:px-28 flex space-y-5 flex-col items-center lg:items-start justify-center my-14">
                                <h1 className="text-5xl lg:text-7xl pb-8 mx-4  font-jost font-extrabold">PG Courses</h1>
                                <h1 className="text-3xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold">No data has been uploaded</h1>
                            </div>
                            :
                            <motion.div
                                className="semesters lg:px-28 px-4 py-20 md:py-24 flex flex-col items-center justify-center font-jost"
                                ref={ref}
                                initial="hidden"
                                animate={inView ? 'visible' : 'hidden'}
                                variants={variants}
                                transition={{ duration: 0.5 }}>
                                <div className="heading text-left w-full ">
                                    <h1 className='text-5xl lg:text-7xl pb-8 mx-4  font-jost font-extrabold'>PG Courses</h1>
                                </div>
                                <div className="wrapper flex flex-wrap lg:w-full justify-around lg:justify-normal items-center">
                                    {pgsemester.map((item) => {
                                        const { $id, semester, course } = item;
                                        const url = `/courses/${course}/${`semester${semester}`}`;
                                        return (
                                            <div key={$id} className="semester mb-6 mx-2 lg:mx-5 flex flex-col justify-center items-center">
                                                <Link href={`${url}`}>
                                                    <Image className='cursor-pointer w-36 lg:w-44 hover:scale-105 transition-all duration-300' src='/images/folder.svg' width={300} height={300} alt='folder' />
                                                </Link>
                                                <Link href={`${url}`}>
                                                    <h2 className=' text-lg  py-2 font-jost'>{`Semester ${semester}`}</h2>
                                                </Link>
                                            </div>
                                        )
                                    }
                                    )}
                                </div>
                            </motion.div>}

                        {vocationalsemester.length === 0 ?
                            <div className="404 px-4 lg:px-28 flex space-y-5 flex-col items-center lg:items-start justify-center my-14">
                                <h1 className="text-5xl lg:text-7xl pb-8 mx-4 text-center font-jost font-extrabold">Vocational Courses</h1>
                                <h1 className="text-3xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold">No data has been uploaded</h1>
                            </div>
                            :
                            <motion.div
                                className="semesters lg:px-28 px-4 py-20 md:py-24 flex flex-col items-center justify-center font-jost"
                                ref={ref}
                                initial="hidden"
                                animate={inView ? 'visible' : 'hidden'}
                                variants={variants}
                                transition={{ duration: 0.5 }}>
                                <div className="heading text-left w-full ">
                                    <h1 className='text-5xl lg:text-7xl pb-8 mx-4  font-jost font-extrabold'>Vocational Courses</h1>
                                </div>
                                <div className="wrapper flex flex-wrap lg:w-full justify-around lg:justify-normal items-center">
                                    {vocationalsemester.map((item) => {
                                        const { $id, semester, course } = item;
                                        const url = `/courses/${course}/${`semester${semester}`}`;
                                        return (
                                            <div key={$id} className="semester mb-6 mx-2 lg:mx-5 flex flex-col justify-center items-center">
                                                <Link href={`${url}`}>
                                                    <Image className='cursor-pointer w-36 lg:w-44 hover:scale-105 transition-all duration-300' src='/images/folder.svg' width={300} height={300} alt='folder' />
                                                </Link>
                                                <Link href={`${url}`}>
                                                    <h2 className=' text-lg  py-2 font-jost'>{`Semester ${semester}`}</h2>
                                                </Link>
                                            </div>
                                        )
                                    }
                                    )}
                                </div>
                            </motion.div>}

                        {coresemester.length === 0 ?
                            <div className="404 px-4 lg:px-28 flex space-y-5 flex-col items-center lg:items-start justify-center my-14">
                                <h1 className="text-5xl lg:text-7xl pb-8 mx-4 text-center font-jost font-extrabold">Core Courses</h1>
                                <h1 className="text-3xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold">No data has been uploaded</h1>
                            </div>
                            :
                            <motion.div
                                className="semesters lg:px-28 px-4 py-20 md:py-24 flex flex-col items-center justify-center font-jost"
                                ref={ref}
                                initial="hidden"
                                animate={inView ? 'visible' : 'hidden'}
                                variants={variants}
                                transition={{ duration: 0.5 }}>
                                <div className="heading text-left w-full ">
                                    <h1 className='text-5xl lg:text-7xl pb-8 mx-4  font-jost font-extrabold'>Core Courses</h1>
                                </div>
                                <div className="wrapper flex flex-wrap lg:w-full justify-around lg:justify-normal items-center">
                                    {coresemester.map((item) => {
                                        const { $id, semester, course } = item;
                                        const url = `/courses/${course}/${`semester${semester}`}`;
                                        return (
                                            <div key={$id} className="semester mb-6 mx-2 lg:mx-5 flex flex-col justify-center items-center">
                                                <Link href={`${url}`}>
                                                    <Image className='cursor-pointer w-36 lg:w-44 hover:scale-105 transition-all duration-300' src='/images/folder.svg' width={300} height={300} alt='folder' />
                                                </Link>
                                                <Link href={`${url}`}>
                                                    <h2 className=' text-lg  py-2 font-jost'>{`Semester ${semester}`}</h2>
                                                </Link>
                                            </div>
                                        )
                                    }
                                    )}
                                </div>
                            </motion.div>}
                    </>
                )}
        </>
    )
}

export default Semester
