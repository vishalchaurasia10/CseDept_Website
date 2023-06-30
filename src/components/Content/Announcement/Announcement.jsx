import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react'
import announcementContext from '@/context/announcement/announcementContext';
import loadingContext from '@/context/loading/loadingContext';
import roleContext from '@/context/role/roleContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaExclamation, FaTrash, FaWindowClose } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const TimeTable = () => {

  const [showModal, setShowModal] = React.useState(false);
  const AnnouncementContext = useContext(announcementContext);
  const { announcements, fetchAnnouncements, deleteAnnouncement } = AnnouncementContext;
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

  const deleteCard = async (id, fileId) => {
    const result = await deleteAnnouncement(id, fileId);
    toast.promise(
      Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
      {
        success: () => 'Announcement successfully deleted!',
        error: () => 'Error deleting announcement.',
        duration: 3000,
        position: 'top-center',
      }
    );
    handleHideModal();
  }

  function extractFileId(url) {
    const segments = url.split('/');
    const filesIndex = segments.indexOf('files');

    if (filesIndex !== -1 && filesIndex < segments.length - 1) {
      return segments[filesIndex + 1];
    }

    return null; // Return null if file ID is not found
  }

  const removeAnnouncement = (id, url) => {
    let fileId = null;
    if (url !== null) {
      fileId = extractFileId(url);
    }
    deleteCard(id, fileId);
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

  return (
    <>
      {loading ?
        <div className="loading flex items-center justify-center h-screen">
          <Image src='/images/loading.gif' width={300} height={300} alt='notes' />
        </div>
        :
        (announcements.length == 0 ?
          <div className="404 flex space-y-5 flex-col items-center justify-center h-screen">
            <Image src='/images/error.gif' width={300} height={300} alt='notes' />
            <h1 className='text-3xl pb-8 px-4 text-center lg:px-6 font-jost font-extrabold'>No data has been uploaded</h1>
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
                  <div key={$id} className="semester bg-[#D7D9DD] shadow-2xl shadow-black p-5 rounded-2xl mb-6 mx-2 lg:mx-4 md:w-[45%] lg:w-[30%] space-x-2 flex justify-center">
                    <Link className="w-1/2 flex items-center justify-center lg:mr-0" target="_blank" href={`${imgUrl}`}>
                      <Image title="Click to view" className="cursor-pointer h-full rounded-2xl hover:scale-105 transition-all duration-300" src={`${imgUrl}`} width={300} height={300} alt="" />
                    </Link>
                    <div className="details lg:w-3/4 flex flex-col justify-center">
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
                        <div title={`Description: ${description}`} className="semesterDetails whitespace-nowrap flex w-full">
                          <p className="font-bold">Description&nbsp;</p>
                          <p className="overflow-hidden whitespace-nowrap overflow-ellipsis">
                            <span className="font-bold">: </span>
                            {truncatedDescription}
                          </p>
                        </div>
                      )}
                      {(
                        <div title="Download Timetable" className="codeDetails flex">
                          <Link target="_blank" href={`${fileUrl}`}>
                            <p className="font-bold hover:underline">View</p>
                          </Link>
                        </div>
                      )}
                    </div>
                    {role.role === 'admin' ? <div className="delete relative">
                      <FaTrash title='Delete' onClick={handleShowModal} className="text-3xl bg-pureWhite p-[0.38rem] rounded-md absolute right-0 bottom-0 hover:scale-110 transition-all duration-300 cursor-pointer" />
                    </div> : ''}
                    <div className={`modalWrapper ${showModal ? '' : 'hidden'} bg-[rgba(0,0,0,0.8)] font-jost z-50 absolute top-0 -left-2 w-screen h-screen flex items-center justify-center`}>
                      <dialog id='modal' className="modal bg-[#3e3e3f] absolute z-50 p-6 px-8 mx-4 md:mx-auto lg:px-10 rounded-2xl shadow-2xl shadow-black text-white">
                        <form className="">
                          <header className="modal-header py-3 flex items-center justify-between">
                            <div className="excalmation flex space-x-2 items-center">
                              <FaExclamation className="bg-[#F58601] text-4xl p-1 rounded-full" />
                              <h4 className="modal-title text-2xl font-bold">Delete Document</h4>
                            </div>
                            <FaWindowClose title='Close' onClick={handleHideModal} className="text-2xl cursor-pointer" />
                          </header>
                          <div className="modal-content pb-6 text-lg">
                            <p>Are you sure you want to delete <span className='font-bold'>the document from Announcements</span>?</p>
                          </div>
                          <div className="modal-footer py-5 border-t">
                            <div className="flex space-x-2">
                              <button title='Cancel' onClick={handleHideModal} className="button p-2 hover:bg-white transition-all duration-300 border border-white rounded-lg" type="button">Cancel</button>
                              <button title='Delete' onClick={() => { removeAnnouncement($id, url) }} className="button p-2 hover:bg-white transition-all duration-300 border border-white rounded-lg" type="button">Delete</button>
                            </div>
                          </div>
                        </form>
                      </dialog>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>)}
    </>
  )
}

export default TimeTable
