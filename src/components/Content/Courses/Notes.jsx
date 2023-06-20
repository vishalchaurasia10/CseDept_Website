import React, { useContext, useEffect, useState } from 'react';
import noteContext from '@/context/notes/noteContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const Notes = () => {
    const [subjectNotes, setSubjectNotes] = useState([]);
    const NoteContext = useContext(noteContext);
    const { notes } = NoteContext;
    const router = useRouter();
    const { semester, subject, unit } = router.query;
    const targetSemester = semester[semester.length - 1];
    console.log(targetSemester, subject);

    useEffect(() => {
        // Filter the notes array based on the specified semester and subject
        const filteredNotes = notes.filter(
            (note) => note.semester === targetSemester && note.subjectCode === subject && note.unit === unit
        );
        setSubjectNotes(filteredNotes);
    }, [notes, semester, subject]);

    useEffect(() => {
        console.log(subjectNotes);
    }, [subjectNotes]);

    return (
        <>
            <div className="semesters lg:px-28 px-4 py-20 md:py-28 font-jost">
                <h1 className='text-7xl pb-8 lg:px-6 font-jost font-extrabold'>Notes</h1>
                <div className="wrapper flex flex-wrap">
                    {subjectNotes.map((item) => {
                        const { name, $id, url, extension } = item;
                        const ext = extension.substring(1);
                        return (
                            <div key={$id} className="semester mb-6 mx-2 lg:mx-5 flex flex-col justify-center items-center">
                                <Link target='_blank' href={`${url}`}>
                                    <Image className='cursor-pointer w-40 lg:w-64 hover:scale-105 transition-all duration-300' src={`/images/extensions/${ext}.svg`} width={300} height={300} alt='subjectFolder' />
                                </Link>
                                <Link href={`${url}`}>
                                    <h2 className=' text-xl py-2 font-jost'>{name}</h2>
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

export default Notes;
