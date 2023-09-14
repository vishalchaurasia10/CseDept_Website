import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import timetableContext from '@/context/timetable/timetableContext';
import loadingContext from '@/context/loading/loadingContext';
import roleContext from '@/context/role/roleContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaPen, FaTrash } from 'react-icons/fa';
import Loader from '@/components/Layout/Loader';
import { convertStringToDateTime, extractFileId } from '@/utils/commonFunctions';
import DeleteComponent from '@/components/Layout/DeleteComponent';
import UpdateComponent from '@/components/Layout/UpdateComponent';

const TimeTable = () => {

    const [showModal, setShowModal] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState({ $id: '', url: '' });
    const TimetableContext = useContext(timetableContext);
    const { timetable, fetchTimeTable, deleteTimetable, updateTimeTableDocument } = TimetableContext;
    const LoadingContext = useContext(loadingContext);
    const { loading } = LoadingContext;
    const RoleContext = useContext(roleContext);
    const { role } = RoleContext;
    const [ref, inView] = useInView({
        triggerOnce: true, // Only trigger the animation once
        threshold: 0.1, // Customize the threshold for triggering the animation
    });

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    useEffect(() => {
        if (timetable.length === 0)
            fetchTimeTable();
    }, [])

    const deleteCard = async (id, fileId) => {
        await deleteTimetable(id, fileId);
        handleHideModal();
    }

    const removeTimetable = (id, url) => {
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

    const updateTimeTable = async (id, formData) => {
        await updateTimeTableDocument(id, formData);
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
                (timetable.length == 0 ?
                    <div className="404 flex space-y-5 flex-col items-center justify-center h-screen">
                        <Image src='/images/error.gif' width={300} height={300} alt='notes' />
                        <h1 className='text-3xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold'>No timetable has been uploaded</h1>
                    </div>
                    :
                    <motion.div
                        className="timetable lg:px-28 px-4 py-20 md:py-28 font-jost"
                        ref={ref}
                        initial="hidden"
                        animate={inView ? 'visible' : 'hidden'}
                        variants={variants}
                        transition={{ duration: 0.5 }}>
                        <h1 className='text-5xl md:text-6xl lg:text-7xl pb-8 lg:px-6 font-jost font-extrabold'>TimeTable</h1>
                        <div className="wrapper flex flex-wrap">
                            {timetable.map((item) => {
                                const { semester, $id, url, section, $updatedAt } = item;
                                const dateTime = convertStringToDateTime($updatedAt);
                                return (
                                    <div key={$id} className="semester bg-[#D7D9DD] shadow-2xl shadow-black p-5 rounded-2xl mb-6 mx-2 lg:mx-5 flex justify-center w-full md:w-[47%] lg:w-[30%]">
                                        <Link className='w-1/4 lg:w-1/2 flex items-center justify-center mr-4' target='_blank' href={`${url}`}>
                                            <Image title='Click to view' className='cursor-pointer  mb-3 lg:w-52 hover:scale-105 transition-all duration-300' src={`/images/calender.svg`} width={300} height={300} alt='subjectFolder' />
                                        </Link>
                                        <div className="details w-3/4 ml-2 lg:w-full flex flex-col justify-center">
                                            <div className="updateDetails text-xs flex my-1 ">
                                                <p className='font-bold whitespace-nowrap'>Updated At :&nbsp;</p>
                                                <p className='whitespace-nowrap'>
                                                    <span className='font-extralight'>{dateTime.date} |&nbsp;</span>
                                                    <span className='font-extralight'>{dateTime.time}</span>
                                                </p>
                                            </div>
                                            {semester.length > 0 && <div title={`Semester : ${semester}`} className="semesterDetails flex w-full">
                                                <p className='font-bold'>Semester&nbsp;</p>
                                                <p className='overflow-hidden whitespace-nowrap overflow-ellipsis'><span className='font-bold'>: </span>{semester}</p>
                                            </div>}
                                            {section.length > 0 && <div title={`Section : ${section}`} className="codeDetails flex">
                                                <p className='font-bold'>Section :&nbsp;</p>
                                                <p className=''>{section.toUpperCase()}</p>
                                            </div>}
                                            {url && <div title={`Download Timetable`} className="codeDetails flex">
                                                <Link target='_blank' href={`${url}`}>
                                                    <p className='font-bold hover:underline'>Download</p>
                                                </Link>
                                            </div>}
                                        </div>
                                        {role.role === 'admin' ? <div className="update relative">
                                            <FaPen title='Update' onClick={() => handleShowUpdateModal($id)} className="text-3xl bg-pureWhite p-[0.38rem] rounded-md absolute right-10 bottom-0 hover:scale-110 transition-all duration-300 cursor-pointer" />
                                        </div> : ''}
                                        {
                                            showUpdateModal && <UpdateComponent data={{ semester, section }} handleHideUpdateModal={handleHideUpdateModal} updateFunction={updateTimeTable} $id={updateId} />
                                        }
                                        {role.role === 'admin' ? <div className="delete relative">
                                            <FaTrash title='Delete' onClick={() => handleShowModal($id, url)} className="text-3xl bg-pureWhite p-[0.38rem] rounded-md absolute right-0 bottom-0 hover:scale-110 transition-all duration-300 cursor-pointer" />
                                        </div> : ''}
                                        {showModal && <DeleteComponent handleHideModal={handleHideModal} showModal={showModal} removeCard={removeTimetable} $id={deleteItem.$id} url={deleteItem.url} />}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>)}
        </>
    )
}

export default TimeTable
