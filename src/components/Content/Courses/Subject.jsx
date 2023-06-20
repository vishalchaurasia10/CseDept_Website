import React, { useContext, useState, useEffect } from 'react';
import noteContext from '@/context/notes/noteContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const Subject = () => {
    const [subject, setSubject] = useState([]);
    const NoteContext = useContext(noteContext);
    const { notes } = NoteContext;
    const router = useRouter();
    const { semester } = router.query;
    const targetSemester = semester[semester.length - 1]

    useEffect(() => {
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
    }, []);


    return (
        <>
            <div className="semesters lg:px-28 px-4 py-20 md:py-28 font-jost">
                <h1 className='text-7xl pb-8 lg:px-6 font-jost font-extrabold'>Subjects</h1>
                <div className="wrapper flex flex-wrap">
                    {subject.map((item) => {
                        const { subjectCode, $id } = item;
                        return (
                            <div key={$id} className="semester mb-6 mx-2 lg:mx-5 flex flex-col justify-center items-center">
                                <Link href={`/courses/${semester}/${subjectCode}`}>
                                    <Image className='cursor-pointer w-40 lg:w-64 hover:scale-105 transition-all duration-300' src='/images/folder.svg' width={300} height={300} alt='subjectFolder' />
                                </Link>
                                <Link href={`/courses/${router.query}/${subjectCode}`}>
                                    <h2 className=' text-xl py-2 font-jost'>{subjectCode}</h2>
                                </Link>
                            </div>
                        )
                    }
                    )}
                </div>
            </div>
        </>
    );
};

export default Subject;
