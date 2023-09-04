import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link';
import importantlinkContext from '@/context/importantLinks/importantlinkContext';
import loadingContext from '@/context/loading/loadingContext';
import roleContext from '@/context/role/roleContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaExclamation, FaLink, FaTrash, FaWindowClose } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import Loader from '@/components/Layout/Loader';

const Importantlink = () => {

    const [showModal, setShowModal] = useState(false);
    const ImportantlinkContext = useContext(importantlinkContext);
    const { importantlink, fetchImportantlink, deleteImportantlink } = ImportantlinkContext;
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


    function capitalizeWords(str) {
        // Split the string into an array of words
        const words = str.split(' ');

        // Capitalize the first letter of each word
        const capitalizedWords = words.map(word => {
            const firstLetter = word.charAt(0).toUpperCase();
            const restOfWord = word.slice(1).toLowerCase();
            return `${firstLetter}${restOfWord}`;
        });

        // Join the capitalized words back into a string
        const capitalizedString = capitalizedWords.join(' ');

        return capitalizedString;
    }

    const deleteCard = async (id) => {
        const result = await deleteImportantlink(id);
        toast.promise(
            Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
            {
                success: () => 'Link successfully deleted!',
                error: () => 'Error deleting link.',
                duration: 3000,
                position: 'top-center',
            }
        );
        handleHideModal();
    }


    const removeImportantLink = (id) => {
        deleteCard(id);
    }

    const handleShowModal = () => {
        setShowModal(true);
        const modal = document.getElementById('modal');
        document.body.classList.add('overflow-hidden');
        modal.showModal();
    }

    const handleHideModal = () => {
        setShowModal(false);
        const modal = document.getElementById('modal');
        document.body.classList.remove('overflow-hidden');
        modal.close();
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setShowModal(false);
                document.body.classList.remove('overflow-hidden');
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
            <Toaster />
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
                                    <div key={$id} className="bg-[#D7D9DD] w-full shadow-2xl shadow-black p-4 rounded-2xl mb-6 mx-2 lg:mx-4 md:w-[45%] lg:w-[30%] space-x-2 flex ">
                                        <div className="details w-full flex flex-col justify-center">
                                            <div className="updateDetails text-xs flex my-1 ">
                                                <p className='font-bold whitespace-nowrap'>Updated At :&nbsp;</p>
                                                <p className='whitespace-nowrap'>
                                                    <span className='font-extralight'>{dateTime.date} |&nbsp;</span>
                                                    <span className='font-extralight'>{dateTime.time}</span>
                                                </p>
                                            </div>
                                            {topic.length > 0 &&
                                                <div title={capitalizeWords(topic)} className="topic flex">
                                                    <Link target='_blank' href={`${url}`}>
                                                        <p className='text-[1.9rem] whitespace-nowrap hover:underline lg:text-2xl font-extrabold'>{capitalizeWords(truncatedTopic)}
                                                        </p>
                                                    </Link>
                                                </div>}
                                        </div>
                                        {role.role === 'admin' ? <div className="delete relative">
                                            <FaTrash title='Delete' onClick={handleShowModal} className="text-3xl bg-pureWhite p-[0.38rem] rounded-md absolute right-0 bottom-0 hover:scale-110 transition-all duration-300 cursor-pointer" />
                                        </div> : ''}
                                        <div className={`modalWrapper ${showModal ? '' : 'hidden'} bg-[rgba(0,0,0,0.8)] font-jost z-50 absolute top-0 -left-2 lg:-left-2 w-screen h-screen flex items-center justify-center`}>
                                            <dialog id='modal' className="modal bg-[#3e3e3f] absolute z-50 p-6 px-8 mx-4 md:mx-auto lg:px-10 rounded-2xl shadow-2xl shadow-black text-white">
                                                <form className="">
                                                    <header className="modal-header py-3 flex items-center justify-between">
                                                        <div className="excalmation flex space-x-2 items-center">
                                                            <FaExclamation className="bg-[#F58601] text-4xl p-1 rounded-full" />
                                                            <h4 className="modal-title text-2xl font-bold">Delete Link</h4>
                                                        </div>
                                                        <FaWindowClose title='Close' onClick={handleHideModal} className="text-2xl cursor-pointer" />
                                                    </header>
                                                    <div className="modal-content pb-6 text-lg">
                                                        <p>Are you sure you want to delete <span className='font-bold'>this Link</span>?</p>
                                                    </div>
                                                    <div className="modal-footer py-5 border-t">
                                                        <div className="flex space-x-2">
                                                            <button title='Cancel' onClick={handleHideModal} className="button p-2 hover:bg-white transition-all duration-300 border border-white rounded-lg" type="button">Cancel</button>
                                                            <button title='Delete' onClick={() => { removeImportantLink($id) }} className="button p-2 hover:bg-white transition-all duration-300 border border-white rounded-lg" type="button">Delete</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </dialog>
                                        </div>

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
