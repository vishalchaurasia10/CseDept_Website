import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link';
import importantlinkContext from '@/context/importantLinks/importantlinkContext';
import loadingContext from '@/context/loading/loadingContext';
import roleContext from '@/context/role/roleContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaPen, FaTrash } from 'react-icons/fa';
import Loader from '@/components/Layout/Loader';
import DeleteComponent from '@/components/Layout/DeleteComponent';
import { convertStringToDateTime, extractFileId } from '@/utils/commonFunctions';
import UpdateComponent from '@/components/Layout/UpdateComponent';

const Importantlink = () => {

    const [showModal, setShowModal] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState({ $id: '', url: '' });
    const ImportantlinkContext = useContext(importantlinkContext);
    const { importantlink, fetchImportantlink, deleteImportantlink, updateImportantlinkDocument } = ImportantlinkContext;
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
        if (importantlink.length === 0)
            fetchImportantlink();
    }, [])

    const deleteCard = async (id, fileId) => {
        await deleteImportantlink(id, fileId);
        handleHideModal();
    }

    const removeImportantLink = (id, url) => {
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

    const updateImportantLink = async (id, formData) => {
        await updateImportantlinkDocument(id, formData);
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
                (importantlink.length == 0 ?
                    <div className="404 flex space-y-5 flex-col items-center justify-center h-screen">
                        <Image src='/images/error.gif' width={300} height={300} alt='notes' />
                        <h1 className='text-3xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold'>No link has been uploaded</h1>
                    </div>
                    :
                    <motion.div
                        className="semesters lg:px-40 px-4 py-20 md:py-24 font-jost"
                        ref={ref}
                        initial="hidden"
                        animate={inView ? 'visible' : 'hidden'}
                        variants={variants}
                        transition={{ duration: 0.5 }}>
                        <h1 className='text-5xl md:text-6xl lg:text-7xl pb-8 lg:px-6 font-jost font-extrabold'>Important Links</h1>
                        <div className="wrapper flex flex-wrap">
                            {importantlink.map((item) => {
                                const { $id, topic, url, $updatedAt } = item;
                                const dateTime = convertStringToDateTime($updatedAt);
                                const truncatedTopic = topic.length > 18 ? `${topic.substring(0, 18)}...` : topic;
                                return (
                                    <div key={$id} className="bg-[#D7D9DD] w-full shadow-2xl shadow-black p-4 rounded-2xl mb-6 mx-2 lg:mx-4 md:w-[45%] lg:w-[30%] flex ">
                                        <div className="details w-full flex flex-col justify-center">
                                            <div className="updateDetails text-xs flex my-1 ">
                                                <p className='font-bold whitespace-nowrap'>Updated At :&nbsp;</p>
                                                <p className='whitespace-nowrap'>
                                                    <span className='font-extralight'>{dateTime.date} |&nbsp;</span>
                                                    <span className='font-extralight'>{dateTime.time}</span>
                                                </p>
                                            </div>
                                            {topic.length > 0 &&
                                                <div title={topic} className="topic flex">
                                                    <Link target='_blank' href={`${url}`}>
                                                        <p className='text-[1.9rem] whitespace-nowrap hover:underline lg:text-2xl font-extrabold capitalize'>{truncatedTopic}
                                                        </p>
                                                    </Link>
                                                </div>}
                                        </div>
                                        {role.role === 'admin' ? <div className="update relative">
                                            <FaPen title='Delete' onClick={() => handleShowUpdateModal($id)} className="text-3xl bg-pureWhite p-[0.38rem] rounded-md absolute right-10 bottom-0 hover:scale-110 transition-all duration-300 cursor-pointer" />
                                        </div> : ''}
                                        {
                                            showUpdateModal && <UpdateComponent data={{ topic }} handleHideUpdateModal={handleHideUpdateModal} updateFunction={updateImportantLink} $id={updateId} />
                                        }
                                        {role.role === 'admin' ? <div className="delete relative">
                                            <FaTrash title='Delete' onClick={() => handleShowModal($id, url)} className="text-3xl bg-pureWhite p-[0.38rem] rounded-md absolute right-0 bottom-0 hover:scale-110 transition-all duration-300 cursor-pointer" />
                                        </div> : ''}
                                        {showModal && <DeleteComponent handleHideModal={handleHideModal} showModal={showModal} removeCard={removeImportantLink} $id={deleteItem.$id} url={deleteItem.url} />}

                                    </div>
                                )
                            }
                            )}
                        </div>
                    </motion.div>)}
        </>
    )
}

export default Importantlink
