import React, { useContext, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import timetableContext from '@/context/timetable/timetableContext';
import { timeTableFields } from '@/utils/constants';

const failure = (message) => toast.error(message, { duration: 3000 });

const UploadTimeTable = () => {
    const [loading, setLoading] = useState(false);
    const { uploadTimeTableFile } = useContext(timetableContext);
    const [timeTableDetails, setTimeTableDetails] = useState({
        semester: '',
        section: '',
        url: null,
    });

    const manageUpload = async (e) => {

        const fileInput = document.getElementById('timeTableFile');
        const file = fileInput.files[0];

        if (timeTableDetails.semester === '' || timeTableDetails.section === '') {
            failure('Please fill all the fields');
            fileInput.value = null;
            return;
        }

        uploadTimeTableFile(file, timeTableDetails, setTimeTableDetails)
        fileInput.value = null;

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTimeTableDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const renderFileUpload = () => {
        if (!timeTableDetails.url) {
            return (
                <>
                    <label className='preview flex flex-col items-center justify-center p-2 mb-5' htmlFor="timeTableFile">
                        <Image className=" h-full w-full cursor-pointer" src="/images/timetable.svg" width={200} height={200} alt='Upload Image' />
                        {loading && <Image className='relative mx-auto mb-4 lg:mb-0 h-10 w-10' src='https://samherbert.net/svg-loaders/svg-loaders/three-dots.svg' width={500} height={500} alt='clip' />}
                        {/* <FaCloudUploadAlt className="text-[#F02D65] -mt-20 text-[15rem] cursor-pointer" /> */}
                        <input onChange={manageUpload} className="hidden" type="file" name="timeTableFile" id="timeTableFile" />
                    </label>
                    <button className='text-white text-sm mb-2'>Click on above image to upload file</button>
                </>
            );
        }

        return (
            <div className="preview flex flex-col items-center justify-center mb-8">
                <Image className=" h-full w-full" src="/images/timetable.svg" width={200} height={200} alt='Upload Image' />
                {/* <FaFilePdf className="text-[#F02D65] -mt-10 mb-8 lg:-mt-20 cursor-pointer text-[15rem]" /> */}
                <Link target='_blank' href={timeTableDetails.url}>
                    <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-md px-8 py-3 font-medium tracking-wide text-white text-xl shadow-2xl border border-[rgba(255,255,255,0.5)]  hover:border-slate-100/20 hover:scale-110 transition duration-300 ease-out  hover:shadow-orange-600 active:translate-y-1">
                        <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500  to-purple-500 opacity-0  transition duration-300 ease-out  group-hover:opacity-100  group-active:opacity-90"></span>
                        <span className="relative">Preview</span>
                    </button>
                </Link>
            </div>
        );
    };

    return (
        <>
            <Toaster />
            <div className="wrapper px-2 md:scale-90 lg:px-40 flex items-center justify-center">
                <div className="container shadow-2xl shadow-black bg-[#D7D9DD] text-[#262626] font-jost w-full rounded-2xl border-2 border-white">
                    <div className="content flex flex-col lg:flex-row">
                        <div className="heading lg:hidden block mt-6 px-7 font-bold">
                            <h1 className=" text-5xl lg:text-7xl font-jost">Upload TimeTable</h1>
                        </div>
                        <div className="formContent order-2 lg:order-1 py-5 lg:py-10 px-6 lg:px-12   lg:w-[60%] flex-col items-center justify-center">
                            <div className="heading hidden font-bold lg:block mb-8">
                                <h1 className=" text-5xl lg:text-7xl font-jost">Upload TimeTable</h1>
                            </div>
                            <form>
                                {timeTableFields.map((field, index) => (
                                    <input
                                        key={index} // Use a unique key for each input element
                                        onChange={handleInputChange}
                                        required
                                        className="p-4 my-2 rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                        type={field.type}
                                        name={field.name}
                                        id={field.name}
                                        value={timeTableDetails[field.name]}
                                        placeholder={field.placeholder}
                                    />
                                ))}
                            </form>
                        </div>
                        <div className="fileUpload bg-[#262626] text-center rounded-2xl shadow-2xl shadow-black order-1 lg:order-2 m-5 lg:w-[40%]">
                            {renderFileUpload()}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default UploadTimeTable;