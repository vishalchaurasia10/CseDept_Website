import React, { useContext, useState, useEffect } from 'react';
import noteContext from '@/context/notes/noteContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import loadingContext from '@/context/loading/loadingContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Subject = () => {
    const [subject, setSubject] = useState([]);
    const NoteContext = useContext(noteContext);
    const { notes, fetchNotes } = NoteContext;
    const LoadingContext = useContext(loadingContext);
    const { loading } = LoadingContext;
    const router = useRouter();
    const { semester } = router.query;
    const targetSemester = semester ? semester[semester.length - 1] : null;
    const [ref, inView] = useInView({
        triggerOnce: true, // Only trigger the animation once
        threshold: 0.1, // Customize the threshold for triggering the animation
    });

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    useEffect(() => {
        if (notes.length === 0) {
            fetchNotes().then(() => {
                applyFilter();
            });
        } else {
            applyFilter();
        }
    }, [notes, fetchNotes]);

    const applyFilter = () => {
        // Create a Set to store unique subject codes
        const uniqueSubjects = new Set();

        // Filter the notes array based on the specified semester and add unique subject codes to the Set
        const filteredSubjects = notes.filter((note) => {
            if (note.semester === targetSemester && !uniqueSubjects.has(note.subjectCode)) {
                uniqueSubjects.add(note.subjectCode);
                return true;
            }
            return false;
        });

        setSubject(filteredSubjects);
    };

    return (
        <>
            {loading ?
                <div className="loading flex items-center justify-center h-screen">
                    <Image src='/images/loading.gif' width={300} height={300} alt='notes' />
                </div>
                :
                (subject.length == 0 ?
                    <div className="404 flex space-y-5 flex-col items-center justify-center h-screen">
                        <Image src='/images/error.gif' width={300} height={300} alt='notes' />
                        <h1 className='text-5xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold'>No data has been uploaded</h1>
                    </div>
                    :
                    <motion.div
                        className="semesters lg:px-28 px-4 py-20 md:py-28 font-jost"
                        ref={ref}
                        initial="hidden"
                        animate={inView ? 'visible' : 'hidden'}
                        variants={variants}
                        transition={{ duration: 0.5 }}>
                        <h1 className='text-7xl pb-8 lg:px-6 font-jost font-extrabold'>Subjects</h1>
                        <div className="wrapper flex flex-wrap">
                            {subject.map((item) => {
                                const { subjectCode, $id } = item;
                                return (
                                    <div key={$id} className="semester mb-6 mx-2 lg:mx-5 flex flex-col justify-center items-center">
                                        <Link href={`/courses/${semester}/${subjectCode}`}>
                                            <Image className='cursor-pointer w-40 lg:w-52 hover:scale-105 transition-all duration-300' src='/images/folder.svg' width={300} height={300} alt='subjectFolder' />
                                        </Link>
                                        <Link href={`/courses/${router.query}/${subjectCode}`}>
                                            <h2 className=' text-xl py-2 font-jost'>{subjectCode}</h2>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>)}
        </>
    );
};

export default Subject;
