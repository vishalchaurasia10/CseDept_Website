import React, { useContext, useEffect, useState } from 'react';
import noteContext from '@/context/notes/noteContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import loadingContext from '@/context/loading/loadingContext';
import roleContext from '@/context/role/roleContext';
import assignmentContext from '@/context/assignments/assignmentContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaTrash } from 'react-icons/fa';
import Loader from '@/components/Layout/Loader';
import DeleteComponent from '@/components/Layout/DeleteComponent';
import { convertStringToDateTime, extractFileId } from '@/utils/commonFunctions';

const Units = () => {

    const [showModal, setShowModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState({ $id: '', url: '' });
    const [subjectUnits, setSubjectUnits] = useState([]);
    const [assignmentUnits, setAssignmentUnits] = useState([]);
    const NoteContext = useContext(noteContext);
    const { notes, fetchSemestersNotes } = NoteContext;
    const LoadingContext = useContext(loadingContext);
    const { loading } = LoadingContext;
    const RoleContext = useContext(roleContext);
    const { role } = RoleContext;
    const AssignmentContext = useContext(assignmentContext);
    const { assignment, fetchSemestersAssignments, deleteAssignment } = AssignmentContext;
    const router = useRouter();
    const { semester, subject, course } = router.query;
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
        if (notes.length === 0 || targetSemester !== notes[0]?.semester) {
            fetchNotesData();
        } else {
            applyFilter();
        }

        if (assignment.length === 0 || targetSemester !== assignment[0]?.semester) {
            fetchAssignmentData();
        } else {
            setAssignmentUnits(assignment);
        }
    }, [targetSemester]);

    useEffect(() => {
        applyFilter();
    }, [notes]);

    useEffect(() => {
        applyAssignmentFilter();
    }, [assignment]);

    const fetchNotesData = async () => {
        await fetchSemestersNotes(targetSemester, subject, -1);
    };

    const fetchAssignmentData = async () => {
        await fetchSemestersAssignments(targetSemester, subject);
    };

    const applyFilter = () => {
        const uniqueUnits = new Set();
        const filteredUnits = notes.filter((note) => {
            if (note.subjectCode === subject && note.course === course && !uniqueUnits.has(note.unit)) {
                uniqueUnits.add(note.unit);
                return true;
            }
            return false;
        });
        setSubjectUnits(filteredUnits);
    };

    const applyAssignmentFilter = () => {
        const uniqueAssignments = new Set();
        const filteredAssignments = assignment.filter((assignment) => {
            if (assignment.subjectCode === subject && assignment.course === course && assignment.length !== 0) {
                uniqueAssignments.add(assignment.unit);
                return true;
            }
            return false;
        });
        setAssignmentUnits(filteredAssignments);

    };

    const deleteCard = async (id, fileId) => {
        await deleteAssignment(id, fileId);
        handleHideModal();
    }

    const removeAssignment = (id, url) => {
        const fileId = extractFileId(url);
        deleteCard(id, fileId);
    }

    const handleShowModal = ($id, url) => {
        setShowModal(true);
        setDeleteItem({ $id, url });
    }

    const handleHideModal = () => {
        setShowModal(false);
        setDeleteItem({ $id: '', url: '' });
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setShowModal(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <>
            {loading ? (
                <Loader />
            ) : subjectUnits.length === 0 ? (
                <div className="404 flex space-y-5 flex-col items-center justify-center h-screen">
                    <Image src="/images/error.gif" width={300} height={300} alt="notes" />
                    <h1 className="text-5xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold">No notes have been uploaded</h1>
                    <h4 className="text-lg pb-8 px-4 text-center lg:px-6 font-jost">Scroll down for any assignments</h4>
                </div>
            ) : (
                <motion.div
                    className="semesters lg:px-28 px-4 pt-20 md:pt-28 font-jost"
                    ref={ref}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    variants={variants}
                    transition={{ duration: 0.5 }}
                >
                    <div className="heading text-left w-full" >
                        <h1 className="text-5xl lg:text-7xl pb-8 mx-4  font-jost font-extrabold">{(subjectUnits[0].unit).includes('unit') ? 'Units' : 'Labs'}</h1>
                    </div>
                    <div className="wrapper flex flex-wrap lg:w-full justify-around lg:justify-normal items-center">
                        {subjectUnits.map((item) => {
                            const { unit, $id } = item;
                            return (
                                <div key={$id} className="units mb-6 mx-2 lg:mx-5 flex flex-col justify-center items-center">
                                    <Link href={`/courses/${course}/${semester}/${subject}/${unit}`}>
                                        <Image className="cursor-pointer w-36 lg:w-44 hover:scale-105 transition-all duration-300" src="/images/folder.svg" width={300} height={300} alt="subjectFolder" />
                                    </Link>
                                    <Link href={`/courses/${course}/${semester}/${subject}/${unit}`}>
                                        <h2 className="text-xl py-2 font-jost">{unit}</h2>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {assignmentUnits.length === 0 ?
                <div className="404 lg:px-28 flex space-y-5 flex-col items-center lg:items-start justify-center my-14">
                    <h1 className="text-5xl lg:text-7xl pb-8 mx-4  font-jost font-extrabold">Assignments</h1>
                    <h1 className="text-3xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold">No assignment has been uploaded</h1>
                </div>
                :
                <motion.div
                    className="semesters lg:px-28 px-4 py-20 md:py-28 font-jost"
                    ref={ref}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    variants={variants}
                    transition={{ duration: 0.5 }}
                >
                    <div className="heading text-left w-full" >
                        <h1 className="text-5xl lg:text-7xl pb-8 mx-4  font-jost font-extrabold">Assignments</h1>
                    </div>
                    <div className="wrapper flex flex-wrap lg:w-full justify-around lg:justify-normal items-center">
                        {assignmentUnits.map((item) => {
                            const { name, $id, url, extension, $updatedAt, subjectCode } = item;
                            const getExt = extension.substring(1);
                            const ext = ['pdf', 'docx', 'pptx', 'txt', 'xlsx'].includes(getExt) ? getExt : 'txt';
                            const dateTime = convertStringToDateTime($updatedAt);
                            const truncatedName = name.length > 20 ? `${name.substring(0, 20)}...` : name;
                            return (
                                <div key={$id} className="assignments bg-[#D7D9DD] shadow-2xl shadow-black p-4 rounded-2xl mb-6 mx-2 lg:mx-4 md:w-[45%] lg:w-[30%] flex justify-center">
                                    <Link className="w-1/2 flex items-center justify-center lg:mr-4" target="_blank" href={`${url}`}>
                                        <Image title="Click to view" className="cursor-pointer lg:w-52 hover:scale-105 transition-all duration-300" src={`/images/extensions/${ext}.svg`} width={300} height={300} alt="subjectFolder" />
                                    </Link>
                                    <div className="details w-3/4 ml-2 lg:w-full flex flex-col justify-center">
                                        <div className="updateDetails text-xs flex my-1 ">
                                            <p className="font-bold whitespace-nowrap">Updated At:&nbsp;</p>
                                            <p className="whitespace-nowrap">
                                                <span className="font-extralight">{dateTime.date} |&nbsp;</span>
                                                <span className="font-extralight">{dateTime.time}</span>
                                            </p>
                                        </div>
                                        {name.length > 0 && (
                                            <div title={name} className="nameDetails flex w-full">
                                                <p className="font-bold">Name&nbsp;</p>
                                                <Link target="_blank" href={`${url}`}>
                                                    <p className="overflow-hidden hover:underline whitespace-nowrap overflow-ellipsis">
                                                        <span className="font-bold">:</span> {truncatedName}
                                                    </p>
                                                </Link>
                                            </div>
                                        )}
                                        {subjectCode.length > 0 && (
                                            <div title={subjectCode} className="codeDetails flex">
                                                <p className="font-bold whitespace-nowrap">Subject Code:&nbsp;</p>
                                                <p className="">{subjectCode}</p>
                                            </div>
                                        )}
                                        {targetSemester > 0 && (
                                            <div title={`Semester ${targetSemester}`} className="codeDetails flex items-center">
                                                <div className="flex items-center justify-center">
                                                    <p className="font-bold">Semester:&nbsp;</p>
                                                    <p className="mt-[0.1rem]">{targetSemester} |&nbsp;</p>
                                                </div>
                                                {url && (
                                                    <div title={`Download ${name}`} className="codeDetails flex">
                                                        <Link target="_blank" href={`${url}`}>
                                                            <p className="font-bold hover:underline">Download</p>
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {(role.role === 'admin' || role.role === 'faculty') ? <div className="delete relative">
                                        <FaTrash title='Delete' onClick={() => handleShowModal($id, url)} className="text-3xl bg-pureWhite p-[0.38rem] rounded-md absolute right-0 bottom-0 hover:scale-110 transition-all duration-300 cursor-pointer" />
                                    </div> : ''}
                                    {showModal && <DeleteComponent handleHideModal={handleHideModal} showModal={showModal} removeCard={removeAssignment} $id={deleteItem.$id} url={deleteItem.url} />}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>}
        </>
    );
};

export default Units;
