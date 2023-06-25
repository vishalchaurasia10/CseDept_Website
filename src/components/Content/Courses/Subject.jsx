import React, { useContext, useState, useEffect } from 'react';
import noteContext from '@/context/notes/noteContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import loadingContext from '@/context/loading/loadingContext';
import assignmentContext from '@/context/assignments/assignmentContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Subject = () => {
    const [data, setData] = useState({ subjects: [], assignments: [] });
    const NoteContext = useContext(noteContext);
    const { notes, fetchNotes } = NoteContext;
    const LoadingContext = useContext(loadingContext);
    const { loading } = LoadingContext;
    const AssignmentContext = useContext(assignmentContext);
    const { assignment, fetchAssignment } = AssignmentContext;
    const router = useRouter();
    const { semester } = router.query;
    const targetSemester = semester ? semester[semester.length - 1] : null;
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchNotes(), fetchAssignment()]);
            applyFilter();
            applyAssignmentFilter();
        };

        if (notes.length === 0 || assignment.length === 0) {
            fetchData();
        } else {
            applyFilter();
            applyAssignmentFilter();
        }
    }, [notes, assignment]);

    const applyFilter = () => {
        const uniqueSubjects = new Set();
        const filteredSubjects = notes.filter((note) => {
            if (note.semester === targetSemester && !uniqueSubjects.has(note.subjectCode)) {
                uniqueSubjects.add(note.subjectCode);
                return true;
            }
            return false;
        });

        setData((prevData) => ({ ...prevData, subjects: filteredSubjects }));
    };

    const applyAssignmentFilter = () => {
        const uniqueAssignments = new Set();
        if (assignment.length !== 0) {
            const filteredAssignments = assignment.filter((assignment) => {
                if (assignment.semester === targetSemester && !uniqueAssignments.has(assignment.subjectCode)) {
                    uniqueAssignments.add(assignment.unit);
                    return true;
                }
                return false;
            });
            setData((prevData) => ({ ...prevData, assignments: filteredAssignments }));
        }
    };

    return (
        <>
            {loading ? (
                <div className="loading flex items-center justify-center h-screen">
                    <Image src="/images/loading.gif" width={300} height={300} alt="notes" />
                </div>
            ) : data.subjects.length === 0 ? (
                <div className="404 flex space-y-5 flex-col items-center justify-center h-screen">
                    <Image src="/images/error.gif" width={300} height={300} alt="notes" />
                    <h1 className="text-5xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold">No data has been uploaded</h1>
                </div>
            ) : (
                <motion.div
                    className="semesters lg:px-28 px-4 pt-20 md:pt-28 flex flex-col items-center justify-center font-jost"
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={variants}
                    transition={{ duration: 0.5 }}
                >
                    <div className="heading text-left w-full" >
                        <h1 className="text-5xl lg:text-7xl pb-8 mx-4  font-jost font-extrabold">Subjects</h1>
                    </div>
                    <div className="wrapper flex flex-wrap lg:w-full justify-around lg:justify-normal items-center">
                        {data.subjects.map((item) => {
                            const { subjectCode, $id } = item;
                            return (
                                <div key={$id} className="subject mb-6 mx-2 lg:mx-5 flex flex-col justify-center items-center">
                                    <Link href={`/courses/${semester}/${subjectCode}`}>
                                        <Image
                                            className="cursor-pointer w-36 lg:w-44 hover:scale-105 transition-all duration-300"
                                            src="/images/folder.svg"
                                            width={300}
                                            height={300}
                                            alt="subjectFolder"
                                        />
                                    </Link>
                                    <Link href={`/courses/${semester}/${subjectCode}`}>
                                        <h2 className=" text-xl py-2 font-jost">{subjectCode}</h2>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {data.assignments.length === 0 && data.subjects.length === 0 ? (
                'No assignments or subjects available'
            ) : data.assignments.length === 0 ? (
                <div className="404 flex space-y-5 flex-col items-center justify-center h-screen">
                    <Image src="/images/error.gif" width={300} height={300} alt="notes" />
                    <h1 className="text-5xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold">No assignment has been uploaded</h1>
                </div>
            ) : (
                <motion.div
                    className="semesters lg:px-28 px-4 py-20 md:py-28 font-jost"
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={variants}
                    transition={{ duration: 0.5 }}
                >
                    <div className="heading text-left w-full" >
                        <h1 className="text-5xl lg:text-7xl pb-8 mx-4  font-jost font-extrabold">Assignments</h1>
                    </div>
                    <div className="wrapper flex flex-wrap lg:w-full justify-around lg:justify-normal items-center">
                        {data.assignments.map((item) => {
                            const { subjectCode, $id } = item;
                            return (
                                <div key={$id} className="assignments mb-6 mx-2 lg:mx-5 flex flex-col justify-center items-center">
                                    <Link href={`/courses/${semester}/${subjectCode}`}>
                                        <Image
                                            className="cursor-pointer w-36 lg:w-44 hover:scale-105 transition-all duration-300"
                                            src="/images/folder.svg"
                                            width={300}
                                            height={300}
                                            alt="subjectFolder"
                                        />
                                    </Link>
                                    <Link href={`/courses/${semester}/${subjectCode}`}>
                                        <h2 className=" text-xl py-2 font-jost">{subjectCode}</h2>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default Subject;
