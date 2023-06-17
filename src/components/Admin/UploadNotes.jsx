import React, { useState } from 'react';
import { Client, Databases, Storage, ID } from 'appwrite';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

const success = (message) => toast.success(message, { duration: 3000 });
const failure = (message) => toast.error(message, { duration: 3000 });
const failureLong = (message) => toast.error(message, { duration: 3000, style: { minWidth: '380px' } });

const UploadNotes = () => {
    const [loading, setLoading] = useState(false);
    const [notesDetails, setNotesDetails] = useState({
        name: '',
        subject: '',
        subjectCode: '',
        unit: '',
        semester: '',
        url: null
    });

    const handleFileUpload = async (e) => {
        try {
            setLoading(true);
            const fileInput = document.getElementById('notesFile');
            const file = fileInput.files[0];

            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
            const storage = new Storage(client);

            const result = await storage.createFile(
                process.env.NEXT_PUBLIC_NOTES_BUCKET_ID,
                ID.unique(),
                file
            );

            const fileId = result.$id;
            const uploadedFile = storage.getFileView(
                process.env.NEXT_PUBLIC_NOTES_BUCKET_ID,
                fileId
            );
            setNotesDetails((prevDetails) => ({
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
        setNotesDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleInputSubmit = async () => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const result = await databases.createDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID,
                ID.unique(),
                {
                    name: notesDetails.name,
                    subject: notesDetails.subject,
                    subjectCode: notesDetails.subjectCode,
                    unit: notesDetails.unit,
                    semester: notesDetails.semester,
                    url: notesDetails.url
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

        setNotesDetails({
            name: '',
            subject: '',
            subjectCode: '',
            unit: '',
            semester: '',
            url: null
        });
    };

    const CheckValidity = () => {
        if (notesDetails.name === '' || notesDetails.subject === '' || notesDetails.subjectCode === '' || notesDetails.unit === '' || notesDetails.semester === '') {
            failure('Please fill all the fields');
        }
        else if (notesDetails.name.length < 5) {
            failureLong('Name should be atleast 5 characters long');
        }
        else if (notesDetails.subject.length < 5) {
            failureLong('Subject should be atleast 5 characters long');
        }
        else if (notesDetails.subjectCode.length < 3) {
            failureLong('Sub Code should be atleast 3 characters long');
        }
        else if (notesDetails.url === null) {
            failure('Please upload a file');
        }
        else {
            handleInputSubmit();
        }
    };

    const renderFileUpload = () => {
        if (!notesDetails.url) {
            return (
                <label htmlFor="notesFile">
                    <Image className=" h-full w-full cursor-pointer" src="/images/upload.svg" width={200} height={200} alt='Upload Image' />
                    {loading && <Image className='relative mx-auto mb-4 lg:mb-0 h-10 w-10' src='https://samherbert.net/svg-loaders/svg-loaders/three-dots.svg' width={500} height={500} alt='clip' />}
                    {/* <FaCloudUploadAlt className="text-[#F02D65] -mt-20 text-[15rem] cursor-pointer" /> */}
                    <input onChange={handleFileUpload} className="hidden" type="file" name="notesFile" id="notesFile" />
                </label>
            );
        }

        return (
            <div className="preview flex flex-col items-center justify-center mb-8">
                <Image className=" h-full w-full" src="/images/uploaded.svg" width={200} height={200} alt='Upload Image' />
                {/* <FaFilePdf className="text-[#F02D65] -mt-10 mb-8 lg:-mt-20 cursor-pointer text-[15rem]" /> */}
                <Link target='_blank' href={notesDetails.url}>
                    <button className="group relative mt-10 inline-flex items-center justify-center overflow-hidden rounded-md px-8 py-3 font-medium tracking-wide text-white text-xl shadow-2xl border border-slate-100/20 hover:scale-110 transition duration-300 ease-out  hover:shadow-orange-600 active:translate-y-1">
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
            <div className="wrapper px-2 lg:px-40 flex items-center justify-center">
                <div className="container shadow-2xl shadow-black bg-[#D7D9DD] text-[#262626] font-jost mt-28 w-full rounded-2xl border-2 border-white">
                    <div className="content flex flex-col lg:flex-row">
                        <div className="heading lg:hidden block mt-6 px-7 font-bold">
                            <h1 className=" text-5xl lg:text-7xl font-jost">Upload Notes</h1>
                        </div>
                        <div className="formContent order-2 lg:order-1 py-5 lg:py-10 px-6 lg:px-12   lg:w-[60%] flex-col items-center justify-center">
                            <div className="heading hidden font-bold lg:block mb-8">
                                <h1 className=" text-5xl lg:text-7xl font-jost">Upload Notes</h1>
                            </div>
                            <form>
                                <select
                                    onChange={handleInputChange}
                                    className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white select-arrow"
                                    name="semester"
                                    id="semester"
                                >
                                    <option disabled selected>Select Semester</option>
                                    <option className='bg-white' value="3">
                                        Semester 3
                                    </option>
                                    <option className=" bg-white" value="4">
                                        Semester 4
                                    </option>
                                    <option className="bg-white" value="5">
                                        Semester 5
                                    </option>
                                    <option className="bg-white" value="6">
                                        Semester 6
                                    </option>
                                    <option className="bg-white" value="7">
                                        Semester 7
                                    </option>
                                    <option className="bg-white" value="8">
                                        Semester 8
                                    </option>
                                </select>

                                <input
                                    onChange={handleInputChange}
                                    required
                                    className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={notesDetails.name}
                                    placeholder="Enter the file name..."
                                />

                                <input
                                    onChange={handleInputChange}
                                    required
                                    className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                    type="text"
                                    name="subject"
                                    id="subject"
                                    value={notesDetails.subject}
                                    placeholder="Enter the Subject..."
                                />

                                <input
                                    onChange={handleInputChange}
                                    required
                                    className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                    type="text"
                                    name="subjectCode"
                                    id="subjectCode"
                                    value={notesDetails.subjectCode}
                                    placeholder="Enter the Subject Code..."
                                />

                                <div className="unitRadio lg:my-3 flex flex-wrap lg:space-x-3">
                                    {[1, 2, 3, 4, 5].map((unit) => (
                                        <label
                                            key={unit}
                                            htmlFor={`unit${unit}`}
                                            className={`radioLabel ${notesDetails.unit === `unit${unit}` ? 'bg-[#b2b4b6]' : ''
                                                } cursor-pointer transition-all duration-150 hover:shadow-2xl hover:-translate-y-1 hover:shadow-black hover:bg-[#b2b4b6]  border-2 border-[#b2b4b6] p-2 px-6 rounded-3xl mt-1 mr-2 lg:mr-0`}
                                        >
                                            Unit {unit}
                                            <input
                                                className="hidden"
                                                value={`unit${unit}`}
                                                onChange={handleInputChange}
                                                type="radio"
                                                name="unit"
                                                id={`unit${unit}`}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </form>
                            <div className="button mt-2 lg:mt-0">
                                <button onClick={CheckValidity} className="group bg-pink-500 relative inline-flex items-center justify-center overflow-hidden rounded-3xl px-8 p-2 font-medium tracking-wide text-xl shadow-2xl border border-[#b2b4b6] hover:scale-105 transition duration-300 ease-out text-white hover:shadow-orange-600 active:translate-y-1">
                                    <span className="absolute inset-0 bg-pink-500 opacity-0  transition duration-300 ease-out  group-hover:opacity-100  group-active:opacity-90"></span>
                                    <span className="relative">Upload</span>
                                </button>
                            </div>
                        </div>
                        <div className="fileUpload bg-[#262626] rounded-2xl shadow-2xl shadow-black order-1 lg:order-2 m-5 lg:w-[40%]">
                            {renderFileUpload()}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default UploadNotes;