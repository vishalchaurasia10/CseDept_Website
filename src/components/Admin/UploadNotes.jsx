import React, { useEffect, useState } from 'react';
import { FaCloudUploadAlt, FaFilePdf } from 'react-icons/fa';
import { Client, Storage, ID } from 'appwrite';
import Button from '../Button';

const UploadNotes = () => {
    const [uploadedFileDetails, setUploadedFileDetails] = useState(null);
    const [notesDetails, setNotesDetails] = useState({
        name: '',
        subject: '',
        subjectCode: '',
        unit: '',
        semester: '',
        url: ''
    });

    useEffect(() => {
        const client = new Client()
            .setEndpoint('https://cloud.appwrite.io/v1')
            .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
        const storage = new Storage(client);

        const handleFileUpload = async (e) => {
            try {
                const fileInput = document.getElementById('notesFile');
                const file = fileInput.files[0];

                const result = await storage.createFile(
                    process.env.NEXT_PUBLIC_BUCKET_ID,
                    ID.unique(),
                    file
                );
                console.log(result); // Success

                const fileId = result.$id;
                console.log(fileId);
                const uploadedFile = storage.getFileView(
                    process.env.NEXT_PUBLIC_BUCKET_ID,
                    fileId
                );
                console.log(uploadedFile.href);
                setUploadedFileDetails(uploadedFile.href);
            } catch (error) {
                console.log(error); // Failure
            }
        };

        const fileInput = document.getElementById('notesFile');
        fileInput.addEventListener('change', handleFileUpload);

        return () => {
            fileInput.removeEventListener('change', handleFileUpload);
        };
    }, []);

    useEffect(() => {
        setNotesDetails((prevDetails) => ({
            ...prevDetails,
            url: uploadedFileDetails
        }));
    }, [uploadedFileDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNotesDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleClick = () => {
        console.log(notesDetails);
        setNotesDetails({
            name: '',
            subject: '',
            subjectCode: '',
            unit: '',
            semester: '',
            url: ''
        });
        setUploadedFileDetails(null);
    };

    const renderFileUpload = () => {
        if (!uploadedFileDetails) {
            return (
                <label htmlFor="notesFile">
                    <FaCloudUploadAlt className="text-[#F02D65] -mt-20 text-[15rem] cursor-pointer" />
                    <input className="hidden" type="file" name="notesFile" id="notesFile" />
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
        <div className="wrapper px-2 flex items-center justify-center">
            <div className="container mt-24 lg:mt-24 px-6 lg:px-20 py-12 w-full rounded-2xl border-2 border-white">
                <div className="heading mb-8">
                    <h1 className="text-white text-5xl lg:text-7xl font-jost">Upload Notes</h1>
                </div>
                <div className="content flex flex-col lg:flex-row">
                    <div className="formContent order-2 lg:order-1 lg:w-[60%] flex-col items-center justify-center">
                        <form>
                            <select
                                onChange={handleChange}
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
                                onChange={handleChange}
                                required
                                className="p-4 my-2 text-white rounded-lg w-full outline-none bg-white border border-white"
                                type="text"
                                name="name"
                                id="name"
                                value={notesDetails.name}
                                placeholder="Enter the file name..."
                            />

                            <input
                                onChange={handleChange}
                                required
                                className="p-4 my-2 text-white rounded-lg w-full outline-none bg-white border border-white"
                                type="text"
                                name="subject"
                                id="subject"
                                value={notesDetails.subject}
                                placeholder="Enter the Subject..."
                            />

                            <input
                                onChange={handleChange}
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
                                            onChange={handleChange}
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
                        onClick={handleClick}
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-md px-12 py-3 font-medium tracking-wide text-white text-xl shadow-2xl border-2 border-slate-100/20 hover:scale-110 transition duration-300 ease-out hover:shadow-teal-500 active:translate-y-1"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0 transition duration-300 ease-out group-hover:opacity-100 group-active:opacity-90"></span>
                        <span className="relative font-jost">Upload</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadNotes;
