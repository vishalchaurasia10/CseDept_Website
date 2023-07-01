import React, { useState } from 'react';
import { Client, Databases, Storage, ID } from 'appwrite';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

const failure = (message) => toast.error(message, { duration: 3000 });
const failureLong = (message) => toast.error(message, { duration: 3000, style: { minWidth: '380px' } });

const UploadTimeTable = () => {
    const [loading, setLoading] = useState(false);
    const [timeTableDetails, settimeTableDetails] = useState({
        semester: '',
        section: '',
        url: null,
    });

    const handleFileUpload = async (e) => {
        try {
            setLoading(true);
            const fileInput = document.getElementById('timeTableFile');
            const file = fileInput.files[0];

            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
            const storage = new Storage(client);

            const result = await storage.createFile(
                process.env.NEXT_PUBLIC_TIMETABLE_BUCKET_ID,
                ID.unique(),
                file
            );

            const fileId = result.$id;
            const uploadedFile = storage.getFileView(
                process.env.NEXT_PUBLIC_TIMETABLE_BUCKET_ID,
                fileId
            );
            settimeTableDetails((prevDetails) => ({
                ...prevDetails,
                url: uploadedFile.href,
            }));

            toast.promise(
                Promise.resolve(fileId), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'TimeTable successfully uploaded!',
                    error: () => 'Error uploading timetable.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

            fileInput.value = null; // Clear the file input value after successful upload
            setLoading(false);
        } catch (error) {
            failure(error.message);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        settimeTableDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleTimeTableInputSubmit = async () => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const result = await databases.createDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_TIMETABLE_COLLECTION_ID,
                ID.unique(),
                {
                    semester: timeTableDetails.semester,
                    section: timeTableDetails.section,
                    url: timeTableDetails.url,
                },
            );

            toast.promise(
                Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'TimeTable successfully uploaded!',
                    error: () => 'Error uploading TimeTable.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

        } catch (error) {
            failure('Something went wrong');
        }

        settimeTableDetails({
            semester: '',
            section: '',
            url: null,
        });
    };

    const CheckValidity = () => {
        if (timeTableDetails.semester === '' || timeTableDetails.section === '') {
            failure('Please fill all the fields');
        }
        else if (timeTableDetails.url === null) {
            failure('Please upload a file');
        }
        else {
            handleTimeTableInputSubmit();
        }
    };

    const renderFileUpload = () => {
        if (!timeTableDetails.url) {
            return (
                <>
                    <label className='preview flex flex-col items-center justify-center p-2 mb-5' htmlFor="timeTableFile">
                        <Image className=" h-full w-full cursor-pointer" src="/images/timetable.svg" width={200} height={200} alt='Upload Image' />
                        {loading && <Image className='relative mx-auto mb-4 lg:mb-0 h-10 w-10' src='https://samherbert.net/svg-loaders/svg-loaders/three-dots.svg' width={500} height={500} alt='clip' />}
                        {/* <FaCloudUploadAlt className="text-[#F02D65] -mt-20 text-[15rem] cursor-pointer" /> */}
                        <input onChange={handleFileUpload} className="hidden" type="file" name="timeTableFile" id="timeTableFile" />
                    </label>
                    <button className='text-white text-sm mb-2'>Click on above image to upload file</button>
                </>
            );
        }

        return (
            <div className="preview flex flex-col items-center justify-center mb-8">
                <Image className=" h-full w-full" src="/images/uploaded.svg" width={200} height={200} alt='Upload Image' />
                {/* <FaFilePdf className="text-[#F02D65] -mt-10 mb-8 lg:-mt-20 cursor-pointer text-[15rem]" /> */}
                <Link target='_blank' href={timeTableDetails.url}>
                    <button className="group relative mt-10 inline-flex items-center justify-center overflow-hidden rounded-md px-8 py-3 font-medium tracking-wide text-white text-xl shadow-2xl border border-[rgba(255,255,255,0.5)]  hover:border-slate-100/20 hover:scale-110 transition duration-300 ease-out  hover:shadow-orange-600 active:translate-y-1">
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
            <div className="wrapper px-2 md:scale-90 lg:px-40 mb-5 md:mb-8 lg:mb-10 flex items-center justify-center">
                <div className="container shadow-2xl shadow-black bg-[#D7D9DD] text-[#262626] font-jost mt-20 w-full rounded-2xl border-2 border-white">
                    <div className="content flex flex-col lg:flex-row">
                        <div className="heading lg:hidden block mt-6 px-7 font-bold">
                            <h1 className=" text-5xl lg:text-7xl font-jost">Upload TimeTable</h1>
                        </div>
                        <div className="formContent order-2 lg:order-1 py-5 lg:py-10 px-6 lg:px-12   lg:w-[60%] flex-col items-center justify-center">
                            <div className="heading hidden font-bold lg:block mb-8">
                                <h1 className=" text-5xl lg:text-7xl font-jost">Upload TimeTable</h1>
                            </div>
                            <form>
                                <input
                                    onChange={handleInputChange}
                                    required
                                    className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                    type="number"
                                    name="semester"
                                    id="semester"
                                    value={timeTableDetails.semester}
                                    placeholder="Enter the semester number"
                                />

                                <input
                                    onChange={handleInputChange}
                                    required
                                    className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                    type="text"
                                    name="section"
                                    id="section"
                                    value={timeTableDetails.section}
                                    placeholder="Enter the section"
                                />
                            </form>
                            <div className="button mt-2 lg:mt-0">
                                <button onClick={CheckValidity} className="group bg-pink-500 relative inline-flex items-center justify-center overflow-hidden rounded-3xl px-8 p-2 mt-5 font-medium tracking-wide text-xl shadow-2xl border border-[#b2b4b6] hover:scale-105 transition duration-300 ease-out text-white hover:shadow-orange-600 active:translate-y-1">
                                    <span className="absolute inset-0 bg-pink-500 opacity-0  transition duration-300 ease-out  group-hover:opacity-100  group-active:opacity-90"></span>
                                    <span className="relative">Upload</span>
                                </button>
                            </div>
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