import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { Client, Databases, Storage, ID } from 'appwrite';
import toast, { Toaster } from 'react-hot-toast';


const failure = (message) => toast.error(message, { duration: 3000 });
const failureLong = (message) => toast.error(message, { duration: 3000, style: { minWidth: '380px' } });

const MakeAnnouncements = () => {

    const [loading, setLoading] = useState(false);
    const [announcementDetails, setAnnouncementDetails] = useState({ title: '', description: '', url: 'https://cloud.appwrite.io/v1/storage/buckets/648db2adc766d7035259/files/648db31fcb900eebb380/view?project=6478c5e7959a86375ccd&mode=admin', date: '', venue: '', time: '' })

    const handleFileUpload = async (e) => {
        try {
            setLoading(true);
            const fileInput = document.getElementById('announcementsFile');
            const file = fileInput.files[0];

            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
            const storage = new Storage(client);

            const result = await storage.createFile(
                process.env.NEXT_PUBLIC_ANNOUNCEMENTS_BUCKET_ID,
                ID.unique(),
                file
            );


            const fileId = result.$id;
            const uploadedFile = storage.getFileView(
                process.env.NEXT_PUBLIC_ANNOUNCEMENTS_BUCKET_ID,
                fileId
            );
            setAnnouncementDetails((prevDetails) => ({
                ...prevDetails,
                url: uploadedFile.href,
            }));

            toast.promise(
                Promise.resolve(fileId), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Document successfully uploaded!',
                    error: () => 'Error uploading document.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

            fileInput.value = null; // Clear the file input value after successful upload
            setLoading(false);
        } catch (error) {
            failure('Something went wrong');
            setLoading(false);
        }
    };

    const handleInputSubmit = async () => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const formattedDateTime = `${announcementDetails.date} ${announcementDetails.time}:00.000`;

            const result = await databases.createDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_ANNOUNCEMENTS_COLLECTION_ID,
                ID.unique(),
                {
                    title: announcementDetails.title,
                    description: announcementDetails.description,
                    venue: announcementDetails.venue,
                    date: formattedDateTime,
                    url: announcementDetails.url,
                },
            );

            toast.promise(
                Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Notes successfully uploaded!',
                    error: () => 'Error uploading notes.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

        } catch (error) {
            failure('Something went wrong');
        }

        setAnnouncementDetails({
            title: '',
            description: '',
            url: 'https://cloud.appwrite.io/v1/storage/buckets/648db2adc766d7035259/files/648db31fcb900eebb380/view?project=6478c5e7959a86375ccd&mode=admin',
            date: '',
            venue: '',
            time: ''
        });
    };

    const CheckValidity = () => {
        if (announcementDetails.title === '' || announcementDetails.description === '') {
            failure('Please fill all the required fields');
        }
        else if (announcementDetails.title.length < 5) {
            failureLong('Title should be atleast 5 characters long');
        }
        else if (announcementDetails.description.length < 10) {
            failureLong('Description should be atleast 10 characters long');
        }
        else if (announcementDetails.url === null) {
            failure('Please upload a file');
        }
        else {
            handleInputSubmit();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAnnouncementDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    return (
        <>
            <Toaster />
            <div className="wrapper px-2 lg:px-40 mb-5 lg:mb-10 flex items-center justify-center">
                <div className="container shadow-2xl shadow-black bg-[#D7D9DD] text-[#262626] font-jost mt-16 mb-8 w-full rounded-2xl border-2 border-white">
                    <div className="content flex flex-col lg:flex-row">
                        <div className="heading lg:hidden block mt-6 px-7 font-bold">
                            <h1 className=" text-5xl lg:text-7xl font-jost">Upload Announcements</h1>
                        </div>
                        <div className="formContent order-2 lg:order-1 py-5 lg:py-10 px-6 lg:px-12   lg:w-[60%] flex-col items-center justify-center">
                            <div className="heading hidden font-bold lg:block mb-8">
                                <h1 className=" text-5xl lg:text-7xl font-jost">Upload Announcements</h1>
                            </div>
                            <form>

                                <input
                                    onChange={handleInputChange}
                                    required
                                    className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={announcementDetails.title}
                                    placeholder="Enter the announcement title"
                                />

                                <input
                                    onChange={handleInputChange}
                                    required
                                    className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                    type="text"
                                    name="description"
                                    id="description"
                                    value={announcementDetails.description}
                                    placeholder="Enter the description"
                                />

                                <input
                                    onChange={handleInputChange}
                                    required
                                    className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                    type="text"
                                    name="venue"
                                    id="venue"
                                    value={announcementDetails.venue}
                                    placeholder="Enter the venue(if any)"
                                />

                                <div className="datetime flex space-x-4">
                                    <input
                                        onChange={handleInputChange}
                                        required
                                        className="p-4 my-2 w-1/2  rounded-lg shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                        type="date"
                                        name="date"
                                        id="date"
                                        value={announcementDetails.date}
                                        placeholder="Enter the date(if any)"
                                    />

                                    <input
                                        onChange={handleInputChange}
                                        required
                                        className="p-4 my-2  rounded-lg w-1/2 shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                        type="time"
                                        name="time"
                                        id="time"
                                        value={announcementDetails.time}
                                        placeholder="Enter the time(if any)"
                                    />
                                </div>


                            </form>
                            <div className="button mt-2">
                                <button onClick={CheckValidity} className="group bg-pink-500 relative inline-flex items-center justify-center overflow-hidden rounded-3xl px-8 p-2 font-medium tracking-wide text-xl shadow-2xl border border-[#b2b4b6] hover:scale-105 transition duration-300 ease-out text-white hover:shadow-orange-600 active:translate-y-1">
                                    <span className="absolute inset-0 bg-pink-500 opacity-0  transition duration-300 ease-out  group-hover:opacity-100  group-active:opacity-90"></span>
                                    <span className="relative">Upload</span>
                                </button>
                            </div>
                        </div>
                        <div className="fileUpload bg-[#262626] rounded-2xl shadow-2xl shadow-black order-1 lg:order-2 m-5 lg:w-[40%]">
                            <div className="preview flex flex-col items-center justify-center p-2 mb-8">
                                <Image className=" rounded-2xl mb-2 lg:mb-5 w-full" src="/images/announcements.svg" width={200} height={200} alt='Upload Image' />
                                {loading && <Image className='relative mx-auto -mt-4 lg:-mt-8 h-10 w-10' src='https://samherbert.net/svg-loaders/svg-loaders/three-dots.svg' width={500} height={500} alt='clip' />}
                                {/* <FaFilePdf className="text-[#F02D65] -mt-10 mb-8 lg:-mt-20 cursor-pointer text-[15rem]" /> */}
                                <div className="buttons flex space-x-2 lg:space-x-4">

                                    <button className="group cursor-default relative inline-flex items-center justify-center overflow-hidden rounded-md px-4 lg:px-8 py-3 font-medium tracking-wide text-white text-xl shadow-2xl border border-[rgba(255,255,255,0.5)]  hover:border-slate-100/20 hover:scale-110 transition duration-300 ease-out  hover:shadow-orange-600 active:translate-y-1">
                                        <input
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            type="file"
                                            name="announcementsFile"
                                            id="announcementsFile"
                                        />
                                        <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500  to-purple-500 opacity-0  transition duration-300 ease-out  group-hover:opacity-100  group-active:opacity-90"></span>
                                        <label htmlFor="announcementsFile" className="relative h-full w-full cursor-pointer">
                                            <span className="relative">Change</span>
                                        </label>
                                    </button>
                                    <Link target='_blank' href={announcementDetails.url}>
                                        <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-md px-4 lg:px-8 py-3 font-medium tracking-wide text-white text-xl shadow-2xl border border-[rgba(255,255,255,0.5)]  hover:border-slate-100/20 hover:scale-110 transition duration-300 ease-out  hover:shadow-orange-600 active:translate-y-1">
                                            <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500  to-purple-500 opacity-0  transition duration-300 ease-out  group-hover:opacity-100  group-active:opacity-90"></span>
                                            <span className="relative">Preview</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default MakeAnnouncements
