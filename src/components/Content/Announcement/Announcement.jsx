import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react'
import announcementContext from '@/context/announcement/announcementContext';
import loadingContext from '@/context/loading/loadingContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TimeTable = () => {

  const AnnouncementContext = useContext(announcementContext);
  const { announcements, fetchAnnouncements } = AnnouncementContext;
  const LoadingContext = useContext(loadingContext);
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
                const { date, description, title, venue, $id, url, $updatedAt } = item;
                const upDateTime = convertStringToDateTime($updatedAt);
                const dateTime = convertStringToDateTime(date);
                const truncatedDescription = description.length > 10 ? `${description.substring(0, 10)}...` : description; // Truncate name if it exceeds 20 characters
                return (
                  <>
                    <div key={$id} className="semester bg-[#D7D9DD] shadow-2xl shadow-black p-5 rounded-2xl mb-6 mx-2 lg:mx-4 md:w-[45%] lg:w-[30%] space-x-2 flex justify-center">
                      <Link className="w-1/2 flex items-center justify-center lg:mr-0" target="_blank" href={`${url}`}>
                        <Image title="Click to view" className="cursor-pointer h-full rounded-2xl hover:scale-105 transition-all duration-300" src={`${url}`} width={300} height={300} alt="subjectFolder" />
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
                        {url && (
                          <div title="Download Timetable" className="codeDetails flex">
                            <Link target="_blank" href={`${url}`}>
                              <p className="font-bold hover:underline">View</p>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </motion.div>)}
    </>
  )
}

export default TimeTable
