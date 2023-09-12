import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import announcementContext from '@/context/announcement/announcementContext';
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
  const AnnouncementContext = useContext(announcementContext);
  const { announcements, fetchAnnouncements, deleteAnnouncement, updateAnnouncementDocument } = AnnouncementContext;
  const LoadingContext = useContext(loadingContext);
  const RoleContext = useContext(roleContext);
  const { role } = RoleContext;
  const { loading } = LoadingContext;
  const [ref, inView] = useInView({
    triggerOnce: true, // Only trigger the animation once
    threshold: 0.1, // Customize the threshold for triggering the animation
  });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    if (announcements.length === 0)
      fetchAnnouncements();
  }, [])

  const deleteCard = async (id, fileId) => {
    await deleteAnnouncement(id, fileId);
    handleHideModal();
  }

  const removeAnnouncement = (id, url) => {
    let fileId = null;
    if (url !== null) {
      fileId = extractFileId(url);
    }
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

  const updateAnnouncement = async (id, formData) => {
    await updateAnnouncementDocument(id, formData);
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
        (announcements.length == 0 ?
          <div className="404 flex space-y-5 flex-col items-center justify-center h-screen">
            <Image src='/images/error.gif' width={300} height={300} alt='notes' />
            <h1 className='text-3xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold'>No announcement has been uploaded</h1>
          </div>
          :
          <motion.div
            className="announcements lg:px-28 px-4 py-20 md:py-28 font-jost"
            ref={ref}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={variants}
            transition={{ duration: 0.5 }}>
            <h1 className='text-5xl md:text-6xl lg:text-7xl pb-8 lg:px-6 font-jost font-extrabold'>Announcements</h1>
            <div className="wrapper flex flex-wrap">
              {announcements.map((item) => {
                const { date, description, title, venue, url, $id, $updatedAt } = item;
                const upDateTime = convertStringToDateTime($updatedAt);
                const dateTime = convertStringToDateTime(date);
                const imgUrl = 'https://cloud.appwrite.io/v1/storage/buckets/648db2adc766d7035259/files/649e5e4d78294a13f2ba/view?project=6478c5e7959a86375ccd&mode=admin'
                const fileUrl = url === null ? imgUrl : url;
                const truncatedDescription = description.length > 10 ? `${description.substring(0, 10)}...` : description; // Truncate name if it exceeds 20 characters
                return (
                  <div key={$id} className="semester bg-[#D7D9DD] shadow-2xl shadow-black p-5 rounded-2xl mb-6 mx-2 lg:mx-4 md:w-[45%] lg:w-[30%] flex justify-center">
                    <Link className="w-1/2 flex items-center justify-center lg:mr-0" target="_blank" href={`${imgUrl}`}>
                      <Image title="Click to view" className="cursor-pointer h-full rounded-2xl hover:scale-105 transition-all duration-300" src={`${imgUrl}`} width={300} height={300} alt="" />
                    </Link>
                    <div className="details ml-2 lg:w-3/4 flex flex-col justify-center">
                      <div className="updateDetails whitespace-nowrap text-xs flex my-1">
                        <p className="font-bold">Updated At:&nbsp;</p>
                        <p className="whitespace-nowrap">
                          <span className="font-extralight">
                            <span className="font-bold">:</span>
                            {upDateTime.date} |&nbsp;{upDateTime.time}
                          </span>
                        </p>
                      </div>
                      {title.length > 0 && (
                        <div title={`Title: ${title}`} className="codeDetails whitespace-nowrap flex">
                          <p className="font-bold">Title:&nbsp;</p>
                          <p className="">{title}</p>
                        </div>
                      )}
                      {date.length > 0 && (
                        <div className="updateDetails whitespace-nowrap text-xs flex my-1">
                          <p className="font-bold">Date&nbsp;</p>
                          <span className="font-extralight">
                            <span className="font-bold">: </span>
                            {dateTime.date} |&nbsp;
                          </span>
                          <span className="font-extralight">{dateTime.time}</span>
                        </div>
                      )}
                      {venue.length > 0 && (
                        <div title={`Venue: ${venue}`} className="codeDetails whitespace-nowrap flex">
                          <p className="font-bold">Venue&nbsp;</p>
                          <p className="">
                            <span className="font-bold">: </span>
                            {venue}
                          </p>
                        </div>
                      )}
                      {description.length > 0 && (
                        <div title={`Description : ${description}`} className="semesterDetails whitespace-nowrap flex w-full">
                          <p className="font-bold whitespace-nowrap">Description&nbsp;</p>
                          <p className="overflow-hidden whitespace-nowrap overflow-ellipsis">
                            <span className="font-bold">: </span>
                            {truncatedDescription}
                          </p>
                        </div>
                      )}
                      {(
                        <div title="Download Announcement" className="codeDetails flex">
                          <Link target="_blank" href={`${fileUrl}`}>
                            <p className="font-bold hover:underline">View</p>
                          </Link>
                        </div>
                      )}
                    </div>
                    {role.role === 'admin' ? <div className="update relative">
                      <FaPen title='Delete' onClick={() => handleShowUpdateModal($id)} className="text-3xl bg-pureWhite p-[0.38rem] rounded-md absolute right-10 bottom-0 hover:scale-110 transition-all duration-300 cursor-pointer" />
                    </div> : ''}
                    {
                      showUpdateModal && <UpdateComponent data={{ description, title, venue }} handleHideUpdateModal={handleHideUpdateModal} updateFunction={updateAnnouncement} $id={updateId} />
                    }
                    {role.role === 'admin' ? <div className="delete relative">
                      <FaTrash title='Delete' onClick={() => handleShowModal($id, url)} className="text-3xl bg-pureWhite p-[0.38rem] rounded-md absolute right-0 bottom-0 hover:scale-110 transition-all duration-300 cursor-pointer" />
                    </div> : ''}
                    {showModal && <DeleteComponent handleHideModal={handleHideModal} showModal={showModal} removeCard={removeAnnouncement} $id={deleteItem.$id} url={deleteItem.url} />}
                  </div>
                );
              })}
            </div>
          </motion.div>)}
    </>
  )
}

export default TimeTable
