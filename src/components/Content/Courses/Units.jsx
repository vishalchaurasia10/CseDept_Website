import React, { useContext, useEffect, useState } from 'react';
import noteContext from '@/context/notes/noteContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const Units = () => {
    const [subjectUnits, setSubjectUnits] = useState([]);
    const NoteContext = useContext(noteContext);
    const { notes, fetchNotes } = NoteContext;
    const router = useRouter();
    const { semester, subject, } = router.query;
    const targetSemester = semester ? semester[semester.length - 1] : null;
    console.log(targetSemester, subject);

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
        const uniqueUnits = new Set();

        const filteredUnits = notes.filter((note) => {
            if (note.semester === targetSemester && note.subjectCode === subject && !uniqueUnits.has(note.unit)) {
                uniqueUnits.add(note.unit);
                return true;
            }
            return false;
        });

        setSubjectUnits(filteredUnits);
    };


    return (
        <>
            <div className="semesters lg:px-28 px-4 py-20 md:py-28 font-jost">
                <h1 className='text-7xl pb-8 lg:px-6 font-jost font-extrabold'>Units</h1>
                <div className="wrapper flex flex-wrap">
                    {subjectUnits.map((item) => {
                        const { unit, $id } = item;
                        return (
                            <div key={$id} className="semester mb-6 mx-2 lg:mx-5 flex flex-col justify-center items-center">
                                <Link href={`/courses/${semester}/${subject}/${unit}`}>
                                    <Image className='cursor-pointer w-40 lg:w-52 hover:scale-105 transition-all duration-300' src='/images/folder.svg' width={300} height={300} alt='subjectFolder' />
                                </Link>
                                <Link href={`/courses/${semester}/${subject}/${unit}`}>
                                    <h2 className=' text-xl py-2 font-jost'>{unit}</h2>
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

export default Units;
