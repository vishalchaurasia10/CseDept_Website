import React, { useState } from 'react';
import { Client, Databases, Storage, ID } from 'appwrite';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import faculty from '@/pages/faculty';

const failure = (message) => toast.error(message, { duration: 3000 });
const failureLong = (message) => toast.error(message, { duration: 3000, style: { minWidth: '380px' } });

const ManageFaculty = () => {
    const [loading, setLoading] = useState(false);
    const [facultyDetails, setFacultyDetails] = useState({
        name: '',
        bio: '',
        post: '',
        url: null,
        profileUrl: '',
    });

    const handleImageUpload = async (e) => {
        try {
            setLoading(true);
            const fileInput = document.getElementById('facultyImage');
            const file = fileInput.files[0];

            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
            const storage = new Storage(client);

            const result = await storage.createFile(
                process.env.NEXT_PUBLIC_FACULTY_BUCKET_ID,
                ID.unique(),
                file
            );

            const fileId = result.$id;
            const uploadedFile = storage.getFileView(
                process.env.NEXT_PUBLIC_FACULTY_BUCKET_ID,
                fileId
            );

            setFacultyDetails((prevDetails) => ({
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFacultyDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleImageInputSubmit = async () => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const result = await databases.createDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_FACULTY_COLLECTION_ID,
                ID.unique(),
                {
                    name: facultyDetails.name,
                    url: facultyDetails.url,
                    bio: facultyDetails.bio,
                    post: facultyDetails.post,
                    profileUrl: facultyDetails.profileUrl,
                },
            );

            toast.promise(
                Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Faculty data successfully uploaded!',
                    error: () => 'Error uploading faculty data.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

        } catch (error) {
            failure(error.message);
        }

        setFacultyDetails({
            name: '',
            bio: '',
            post: '',
            url: null,
            profileUrl: '',
        });
    };

    const CheckInputValidity = () => {
        if (facultyDetails.name === '' || facultyDetails.profileUrl === '' || facultyDetails.bio === '') {
            failure('Please fill all the fields');
        } else if (facultyDetails.post === '') {
            failure('Please select the post of the faculty');
        } else if (facultyDetails.name.length < 5) {
            failureLong('Name should be atleast 5 characters long');
        }
        else if (facultyDetails.bio.length < 10) {
            failureLong('Bio should be atleast 10 characters long');
        }
        else if (facultyDetails.url === null) {
            failure('Please upload the image');
        }
        else {
            handleImageInputSubmit();
        }
    };

    const renderFileUpload = () => {
        if (!facultyDetails.url) {
            return (
                <>
                    <label className='preview flex flex-col items-center justify-center p-2 mb-1' htmlFor="facultyImage">
                        <Image className=" h-full w-full cursor-pointer" src="/images/faculty.svg" width={200} height={200} alt='Upload Image' />
                        {loading && <Image className='relative mx-auto mb-4 lg:mb-0 h-10 w-10' src='https://samherbert.net/svg-loaders/svg-loaders/three-dots.svg' width={500} height={500} alt='clip' />}
                        {/* <FaCloudUploadAlt className="text-[#F02D65] -mt-20 text-[15rem] cursor-pointer" /> */}
                        <input onChange={handleImageUpload} className="hidden" type="file" name="facultyImage" id="facultyImage" />
                    </label>
                    <button className='text-white text-sm mb-4'>Click on above image to upload file</button>
                </>
            );
        }

        return (
            <div className="preview flex flex-col items-center justify-center mb-8">
                <Image className=" h-full w-full" src="/images/uploaded.svg" width={200} height={200} alt='Upload Image' />
                {/* <FaFilePdf className="text-[#F02D65] -mt-10 mb-8 lg:-mt-20 cursor-pointer text-[15rem]" /> */}
                <Link target='_blank' href={facultyDetails.url}>
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
            <div className="wrapper px-2 md:scale-90 lg:px-40 mb-5 lg:mb-10 flex items-center justify-center">
                <div className="container shadow-2xl shadow-black bg-[#D7D9DD] text-[#262626] font-jost mt-8 w-full rounded-2xl border-2 border-white">
                    <div className="content flex flex-col lg:flex-row">
                        <div className="heading lg:hidden block mt-6 px-7 font-bold">
                            <h1 className=" text-5xl lg:text-7xl font-jost">Manage Faculty</h1>
                        </div>
                        <div className="formContent order-2 lg:order-1 py-5 lg:py-10 px-6 lg:px-12   lg:w-[60%] flex-col items-center justify-center">
                            <div className="heading hidden font-bold lg:block mb-8">
                                <h1 className=" text-5xl lg:text-7xl font-jost">Manage Faculty</h1>
                            </div>
                            <form>
                                <div className="datetime flex space-x-4">
                                    <select
                                        onChange={handleInputChange}
                                        className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white select-arrow"
                                        name="post"
                                        id="post"
                                        defaultValue=''
                                    >
                                        <option disabled value=''>
                                            Select Post of the faculty
                                        </option>
                                        <option className='bg-white' value="hod">
                                            HOD
                                        </option>
                                        <option className=" bg-white" value="associate professor">
                                            Associate Professor
                                        </option>
                                        <option className="bg-white" value="assistant professor">
                                            Assistant Professor
                                        </option>
                                    </select>
                                </div>

                                <input
                                    onChange={handleInputChange}
                                    required
                                    className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={facultyDetails.name}
                                    placeholder="Enter the name of faculty"
                                />

                                <input
                                    onChange={handleInputChange}
                                    required
                                    className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                    type="text"
                                    name="profileUrl"
                                    id="profileUrl"
                                    value={facultyDetails.profileUrl}
                                    placeholder="Enter the link to full profile"
                                />

                                <textarea
                                    onChange={handleInputChange}
                                    required
                                    value={facultyDetails.bio}
                                    className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                    placeholder='Enter the bio of the faculty' name="bio" id="bio" cols="10" rows="4">
                                </textarea>

                            </form>
                            <div className="button mt-2 lg:mt-3s">
                                <button onClick={CheckInputValidity} className="group bg-pink-500 relative inline-flex items-center justify-center overflow-hidden rounded-3xl px-8 p-2 font-medium tracking-wide text-xl shadow-2xl border border-[#b2b4b6] hover:scale-105 transition duration-300 ease-out text-white hover:shadow-orange-600 active:translate-y-1">
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

export default ManageFaculty;