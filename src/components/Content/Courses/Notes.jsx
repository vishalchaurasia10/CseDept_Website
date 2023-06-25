import React, { useContext, useEffect, useState } from 'react';
import noteContext from '@/context/notes/noteContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import loadingContext from '@/context/loading/loadingContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Notes = () => {
    const [subjectNotes, setSubjectNotes] = useState([]);
    const NoteContext = useContext(noteContext);
    const { notes, fetchNotes } = NoteContext;
    const LoadingContext = useContext(loadingContext);
    const { loading } = LoadingContext;
    const router = useRouter();
    const { semester, subject, unit } = router.query;
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
        const filteredNotes = notes.filter(
            (note) => note.semester === targetSemester && note.subjectCode === subject && note.unit === unit
        );
        setSubjectNotes(filteredNotes);
    };

    function convertStringToDateTime(dateTimeString) {
        const dateTime = new Date(dateTimeString);

        // Define month names
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Extract the date components
        const day = dateTime.getDate();
        const monthIndex = dateTime.getMonth();
        const year = dateTime.getFullYear();

        // Extract the time components
        let hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const amPm = hours >= 12 ? 'pm' : 'am';

        // Convert hours to 12-hour format
        hours = hours % 12 || 12;

        // Return the formatted date and time
        const formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${amPm}`;

        return { date: formattedDate, time: formattedTime };
    }


    return (
        <>
            {loading ?
                <div className="loading flex items-center justify-center h-screen">
                    <Image src='/images/loading.gif' width={300} height={300} alt='notes' />
                </div>
                :
                (subjectNotes.length == 0 ?
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
                        <h1 className='text-5xl lg:text-7xl pb-8 lg:px-6 font-jost font-extrabold'>{unit ? unit.toUpperCase() : ''}</h1>
                        <div className="wrapper flex flex-wrap">
                            {subjectNotes.map((item) => {
                                const { name, $id, url, extension, $updatedAt, subjectCode } = item;
                                const ext = extension.substring(1);
                                const dateTime = convertStringToDateTime($updatedAt);
                                const truncatedName = name.length > 20 ? `${name.substring(0, 20)}...` : name; // Truncate name if it exceeds 20 characters
                                return (
                                    <div key={$id} className="semester bg-[#D7D9DD] shadow-2xl shadow-black p-4 rounded-2xl mb-6 mx-2 lg:mx-4 md:w-[45%] lg:w-[30%] space-x-2 flex justify-center">
                                        <Link className='w-1/2 flex items-center justify-center lg:mr-4' target='_blank' href={`${url}`}>
                                            <Image title='Click to view' className='cursor-pointer lg:w-52 hover:scale-105 transition-all duration-300' src={`/images/extensions/${ext}.svg`} width={300} height={300} alt='subjectFolder' />
                                        </Link>
                                        <div className="details w-3/4 lg:w-full flex flex-col justify-center">
                                            <div className="updateDetails text-xs flex my-1 ">
                                                <p className='font-bold whitespace-nowrap'>Updated At :&nbsp;</p>
                                                <p className='whitespace-nowrap'>
                                                    <span className='font-extralight'>{dateTime.date} |&nbsp;</span>
                                                    <span className='font-extralight'>{dateTime.time}</span>
                                                </p>
                                            </div>
                                            {name.length > 0 && <div title={name} className="nameDetails flex w-full">
                                                <p className='font-bold'>Name&nbsp;</p>
                                                <Link target='_blank' href={`${url}`}>
                                                    <p className='overflow-hidden hover:underline whitespace-nowrap overflow-ellipsis'><span className='font-bold'>:</span> {truncatedName}</p>
                                                </Link>
                                            </div>}
                                            {subjectCode.length > 0 && <div title={subjectCode} className="codeDetails flex">
                                                <p className='font-bold'>Subject Code :&nbsp;</p>
                                                <p className=''>{subjectCode}</p>
                                            </div>}
                                            {targetSemester > 0 && <div title={`Semester ${targetSemester}`} className="codeDetails flex items-center">
                                                <div className='flex items-center justify-center'>
                                                    <p className='font-bold'>Semester :&nbsp;</p>
                                                    <p className='mt-[0.1rem]'>{targetSemester} |&nbsp;</p>
                                                </div>
                                                {url && <div title={`Download ${name}`} className="codeDetails flex">
                                                    <Link target='_blank' href={`${url}`}>
                                                        <p className='font-bold hover:underline'>Download</p>
                                                    </Link>
                                                </div>}
                                            </div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>)}
        </>
    );
};

export default Notes;
