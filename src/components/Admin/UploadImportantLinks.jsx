import React, { useState } from 'react';
import { Client, Databases, ID } from 'appwrite';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

const failure = (message) => toast.error(message, { duration: 3000 });
const failureLong = (message) => toast.error(message, { duration: 3000, style: { minWidth: '380px' } });

const UploadImportantLinks = () => {

    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState({
        topic: '',
        url: '',
    });

    const handleUpload = async () => {
        try {
            setLoading(true);
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const result = await databases.createDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_IMPORTANTLINKS_COLLECTION_ID,
                ID.unique(),
                {
                    topic: links.topic,
                    url: links.url,
                },
            );
            setLoading(false);

            toast.promise(
                Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Link successfully uploaded!',
                    error: () => 'Error uploading Link.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

        } catch (error) {
            failure(error.message);
            setLoading(false);
        }

        setLinks({
            topic: '',
            url: '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLinks((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const CheckValidity = () => {
        if (links.topic === '' || links.url === '') {
            failure('Please fill all the fields');
        }
        else {
            handleUpload();
        }
    };

    return (
        <>
            <Toaster />
            <div className="wrapper px-2 lg:px-40 mt-10 md:-mt-60 lg:-mt-28 -mb-4 flex items-center justify-center">
                <div className="container shadow-2xl shadow-black bg-[#D7D9DD] text-[#262626] font-jost mt-20 w-full rounded-2xl border-2 border-white">
                    <div className="content flex flex-col lg:flex-row">
                        <div className="heading lg:hidden block mt-6 px-7 font-bold">
                            <h1 className=" text-5xl lg:text-7xl font-jost">Upload Links</h1>
                        </div>
                        <div className="formContent order-2 lg:order-1 py-5 lg:py-10 px-6 lg:px-12 w-full flex-col items-center justify-center">
                            <div className="heading hidden font-bold lg:block mb-8">
                                <h1 className=" text-5xl lg:text-7xl font-jost">Upload Links</h1>
                            </div>
                            <div className='flex flex-col lg:flex-row w-full lg:space-x-4 items-center'>
                                <form className='flex flex-col lg:flex-row lg:space-x-4 w-full'>
                                    <input
                                        onChange={handleInputChange}
                                        required
                                        className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                        type="text"
                                        name="topic"
                                        id="topic"
                                        value={links.topic}
                                        placeholder="Enter the topic of the link"
                                    />

                                    <input
                                        onChange={handleInputChange}
                                        required
                                        className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                        type="text"
                                        name="url"
                                        id="url"
                                        value={links.url}
                                        placeholder="Enter the link"
                                    />
                                </form>
                                <div className="button mt-4 lg:mt-0">
                                    <button onClick={CheckValidity} className="group bg-pink-500 relative inline-flex items-center justify-center overflow-hidden rounded-3xl px-8 p-2 font-medium tracking-wide text-xl shadow-2xl border border-[#b2b4b6] hover:scale-105 transition duration-300 ease-out text-white hover:shadow-orange-600 active:translate-y-1">
                                        {loading && <Image className='relative mx-auto pr-2 lg:mb-0 h-10 w-10' src='https://samherbert.net/svg-loaders/svg-loaders/three-dots.svg' width={500} height={500} alt='clip' />}
                                        <span className="relative">Upload</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default UploadImportantLinks
