import React, { useContext, useEffect, useState } from 'react';
import noteContext from '@/context/notes/noteContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import loadingContext from '@/context/loading/loadingContext';
import roleContext from '@/context/role/roleContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaPen, FaTrash } from 'react-icons/fa';
import Loader from '@/components/Layout/Loader';
import DeleteComponent from '@/components/Layout/DeleteComponent';
import { convertStringToDateTime, extractFileId } from '@/utils/commonFunctions';
import UpdateComponent from '@/components/Layout/UpdateComponent';

const Notes = () => {

    const [showModal, setShowModal] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState({ $id: '', url: '' });
    const [subjectNotes, setSubjectNotes] = useState([]);
    const NoteContext = useContext(noteContext);
    const { notes, fetchSemestersNotes, deleteNote, updateNoteDocument } = NoteContext;
    const LoadingContext = useContext(loadingContext);
    const { loading } = LoadingContext;
    const RoleContext = useContext(roleContext);
    const { role } = RoleContext;
    const router = useRouter();
    const { semester, subject, unit, course } = router.query;
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
        if (notes.length === 0 || targetSemester !== notes[0]?.semester) {
            fetchNotesData();
        } else {
            applyFilter();
        }
    }, [targetSemester]);

    useEffect(() => {
        applyFilter();
    }, [notes]);

    const fetchNotesData = async () => {
        await fetchSemestersNotes(targetSemester, subject, -1);
    };

    const applyFilter = () => {
        const filteredNotes = notes.filter(
            (note) => note.subjectCode === subject && note.course === course && note.unit === unit
        );
        setSubjectNotes(filteredNotes);
    };

    const deleteCard = async (id, fileId) => {
        await deleteNote(id, fileId);
        handleHideModal();
    }

    const removeNote = (id, url) => {
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

    const handleShowUpdateModal = ($id) => {
        setShowUpdateModal(true);
        setUpdateId($id)
    }

    const handleHideUpdateModal = () => {
        setShowUpdateModal(false);
        setUpdateId('');
    }

    const updateNote = async (id, formData) => {
        await updateNoteDocument(id, formData);
        handleHideUpdateModal();
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
            {loading ?
                <Loader />
                :
                (subjectNotes.length == 0 ?
                    <div className="404 flex space-y-5 flex-col items-center justify-center h-screen">
                        <Image src='/images/error.gif' width={300} height={300} alt='notes' />
                        <h1 className='text-3xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold'>No data has been uploaded</h1>
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
                                const getExt = extension.substring(1);
                                const ext = ['pdf', 'docx', 'pptx', 'txt', 'xlsx'].includes(getExt) ? getExt : 'txt';
                                const dateTime = convertStringToDateTime($updatedAt);
                                const truncatedName = name.length > 20 ? `${name.substring(0, 20)}...` : name;
                                return (
                                    <div key={$id} className="semester bg-[#D7D9DD] shadow-2xl shadow-black p-4 rounded-2xl mb-6 mx-2 lg:mx-4 md:w-[45%] lg:w-[30%] flex justify-center">
                                        <Link className='w-1/2 flex items-center justify-center lg:mr-4' target='_blank' href={`${url}`}>
                                            <Image title='Click to view' className='cursor-pointer lg:w-52 hover:scale-105 transition-all duration-300' src={`/images/extensions/${ext}.svg`} width={300} height={300} alt='subjectFolder' />
                                        </Link>
                                        <div className="details w-3/4 ml-2 lg:w-full flex flex-col justify-center">
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
                                                <p className='font-bold whitespace-nowrap'>Subject Code :&nbsp;</p>
                                                <p className=''>{subjectCode}</p>
                                            </div>}
                                            {targetSemester > 0 && <div title={`Semester ${targetSemester}`} className="codeDetails">
                                                <div className='flex items-center '>
                                                    <p className='font-bold'>Semester :&nbsp;</p>
                                                    <p className=''>{targetSemester}</p>
                                                </div>
                                                {url && <div title={`Download ${name}`} className="codeDetails flex">
                                                    <Link target='_blank' href={`${url}`}>
                                                        <p className='font-bold hover:underline'>Download</p>
                                                    </Link>
                                                </div>}
                                            </div>}
                                        </div>
                                        {role.role === 'admin' ? <div className="update relative">
                                            <FaPen title='Update' onClick={() => handleShowUpdateModal($id)} className="text-3xl bg-pureWhite p-[0.38rem] rounded-md absolute right-10 bottom-0 hover:scale-110 transition-all duration-300 cursor-pointer" />
                                        </div> : ''}
                                        {
                                            showUpdateModal && <UpdateComponent data={{ name, subjectCode}} handleHideUpdateModal={handleHideUpdateModal} updateFunction={updateNote} $id={updateId} />
                                        }
                                        {(role.role === 'admin' || role.role === 'faculty') ? <div className="delete relative">
                                            <FaTrash title='Delete' onClick={() => handleShowModal($id, url)} className="text-3xl bg-pureWhite p-[0.38rem] rounded-md absolute right-0 bottom-0 hover:scale-110 transition-all duration-300 cursor-pointer" />
                                        </div> : ''}
                                        {showModal && <DeleteComponent handleHideModal={handleHideModal} showModal={showModal} removeCard={removeNote} $id={deleteItem.$id} url={deleteItem.url} />}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>)}
        </>
    );
};

export default Notes;
