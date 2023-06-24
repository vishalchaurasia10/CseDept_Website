import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react'
import timetableContext from '@/context/timetable/timetableContext';
import loadingContext from '@/context/loading/loadingContext';

const TimeTable = () => {

    const TimetableContext = useContext(timetableContext);
    const { timetable, fetchTimeTable } = TimetableContext;
    const LoadingContext = useContext(loadingContext);
    const { loading } = LoadingContext;

    useEffect(() => {
        if (timetable.length === 0)
            fetchTimeTable();
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
        <>{loading ?
            <div className="loading flex items-center justify-center h-screen">
                <Image src='/images/loading.gif' width={300} height={300} alt='notes' />
            </div>
            :
            (timetable.length == 0 ?
                <div className="404 flex space-y-5 flex-col items-center justify-center h-screen">
                    <Image src='/images/error.gif' width={300} height={300} alt='notes' />
                    <h1 className='text-5xl pb-8 lg:px-6 font-jost font-extrabold'>No data has been uploaded</h1>
                </div>
                :
                <div className="timetable lg:px-28 px-4 py-20 md:py-28 font-jost">
                    <h1 className='text-7xl pb-8 lg:px-6 font-jost font-extrabold'>TimeTable</h1>
                    <div className="wrapper flex flex-wrap">
                        {timetable.map((item) => {
                            const { semester, $id, url, section, $updatedAt } = item;
                            const dateTime = convertStringToDateTime($updatedAt);
                            return (
                                <>
                                    <div key={$id} className="semester bg-[#D7D9DD] shadow-2xl shadow-black p-5 rounded-2xl mb-6 mx-2 lg:mx-5 space-x-4 flex justify-center w-full md:w-[47%] lg:w-[30%]">
                                        <Link className='w-1/4 lg:w-1/2 flex items-center justify-center mr-4 lg:mr-0' target='_blank' href={`${url}`}>
                                            <Image title='Click to view' className='cursor-pointer  mb-3 lg:w-52 hover:scale-105 transition-all duration-300' src={`/images/calender.svg`} width={300} height={300} alt='subjectFolder' />
                                        </Link>
                                        <div className="details w-3/4 lg:w-full flex flex-col justify-center">
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
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </div>)}
        </>
    )
}

export default TimeTable
