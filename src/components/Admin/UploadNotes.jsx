import React, { useEffect, useState } from 'react';
import { FaCloudUploadAlt, FaFilePdf } from 'react-icons/fa';
import { Client, Databases, Storage, ID } from 'appwrite';
import Button from '../Button';
import toast, { Toaster } from 'react-hot-toast';

const success = (message) => toast.success(message, { duration: 3000 });
const failure = (message) => toast.error(message, { duration: 3000 });

const UploadNotes = () => {
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
            const fileInput = document.getElementById('notesFile');
            const file = fileInput.files[0];

            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
            const storage = new Storage(client);

            const result = await storage.createFile(
                process.env.NEXT_PUBLIC_BUCKET_ID,
                ID.unique(),
                file
            );

            const fileId = result.$id;
            const uploadedFile = storage.getFileView(
                process.env.NEXT_PUBLIC_BUCKET_ID,
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
        } catch (error) {
            failure('Something went wrong');
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
                process.env.NEXT_PUBLIC_COLLECTION_ID,
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

    const renderFileUpload = () => {
        if (!notesDetails.url) {
            return (
                <label htmlFor="notesFile">
                    <FaCloudUploadAlt className="text-[#F02D65] -mt-20 text-[15rem] cursor-pointer" />
                    <input onChange={handleFileUpload} className="hidden" type="file" name="notesFile" id="notesFile" />
                </label>
            );
        }

        return (
            <div className="preview flex flex-col items-center justify-center mb-8">
                <FaFilePdf className="text-[#F02D65] -mt-10 mb-8 lg:-mt-20 cursor-pointer text-[15rem]" />
                <Button destination="/ads" content="Preview" />
            </div>
        );
    };

    return (
        <>
            <Toaster />
            <div className="wrapper px-2 flex items-center justify-center">
                <div className="container mt-24 lg:mt-24 px-6 lg:px-20 py-12 w-full rounded-2xl border-2 border-white">
                    <div className="heading mb-8">
                        <h1 className="text-white text-5xl lg:text-7xl font-jost">Upload Notes</h1>
                    </div>
                    <div className="content flex flex-col lg:flex-row">
                        <div className="formContent order-2 lg:order-1 lg:w-[60%] flex-col items-center justify-center">
                            <form>
                                <select
                                    onChange={handleInputChange}
                                    className="p-4 my-2 text-white rounded-lg w-full outline-none bg-white border border-white select-arrow"
                                    name="semester"
                                    id="semester"
                                >
                                    <option disabled selected>Select Semester</option>
                                    <option className="text-black" value="3">
                                        Semester 3
                                    </option>
                                    <option className="text-black" value="4">
                                        Semester 4
                                    </option>
                                    <option className="text-black" value="5">
                                        Semester 5
                                    </option>
                                    <option className="text-black" value="6">
                                        Semester 6
                                    </option>
                                    <option className="text-black" value="7">
                                        Semester 7
                                    </option>
                                    <option className="text-black" value="8">
                                        Semester 8
                                    </option>
                                </select>

                                <input
                                    onChange={handleInputChange}
                                    required
                                    className="p-4 my-2 text-white rounded-lg w-full outline-none bg-white border border-white"
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={notesDetails.name}
                                    placeholder="Enter the file name..."
                                />

                                <input
                                    onChange={handleInputChange}
                                    required
                                    className="p-4 my-2 text-white rounded-lg w-full outline-none bg-white border border-white"
                                    type="text"
                                    name="subject"
                                    id="subject"
                                    value={notesDetails.subject}
                                    placeholder="Enter the Subject..."
                                />

                                <input
                                    onChange={handleInputChange}
                                    required
                                    className="p-4 my-2 text-white rounded-lg w-full outline-none bg-white border border-white"
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
                                            className={`radioLabel ${notesDetails.unit === `unit${unit}` ? 'bg-white' : ''
                                                } cursor-pointer transition-all duration-300 hover:bg-white text-white border-2 border-white p-2 px-6 rounded-3xl mt-1 mr-2 lg:mr-0`}
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
                        </div>
                        <div className="fileUpload order-1 lg:order-2 mt-10 lg:mt-0 lg:w-[40%] flex items-center justify-center">
                            {renderFileUpload()}
                        </div>
                    </div>
                    <div className="button mt-2 lg:mt-0">
                        <button
                            onClick={handleInputSubmit}
                            className="group relative inline-flex items-center justify-center overflow-hidden rounded-md px-12 py-3 font-medium tracking-wide text-white text-xl shadow-2xl border-2 border-slate-100/20 hover:scale-110 transition duration-300 ease-out hover:shadow-teal-500 active:translate-y-1"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0 transition duration-300 ease-out group-hover:opacity-100 group-active:opacity-90"></span>
                            <span className="relative font-jost">Upload</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UploadNotes;