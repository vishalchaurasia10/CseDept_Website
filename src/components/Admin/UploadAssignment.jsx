import React, { useContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import commonContext from '@/context/CommonStates/commonContex';
import assignmentContext from '@/context/assignments/assignmentContext';
import { courseOptions, semesterOptions } from '@/utils/constants';

const failure = (message) => toast.error(message, { duration: 3000 });
const failureLong = (message) => toast.error(message, { duration: 3000, style: { minWidth: '380px' } });

const UploadAssignments = () => {
    const [loading, setLoading] = useState(false);
    const { fetchSubjects, subjects } = useContext(commonContext);
    const { uploadAssignmentFile } = useContext(assignmentContext);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState({ subjectCode: '', subject: '' });
    const [assignmentDetails, setAssignmentDetails] = useState({
        name: '',
        subject: '',
        subjectCode: '',
        url: null,
        extension: '',
    });

    useEffect(() => {
        if (selectedSemester !== '' && selectedCourse !== '') {
            fetchSubjects(selectedSemester, selectedCourse);
        }
    }, [selectedSemester, selectedCourse]);


    const manageAssignmentFileUpload = (e) => {

        const fileInput = document.getElementById('assignmentFile');
        const file = fileInput.files[0];

        if (assignmentDetails.name === '' || assignmentDetails.subject === '' || assignmentDetails.subjectCode === '' || selectedCourse === '') {
            failure('Please fill all the fields');
            fileInput.value = null;
            return;
        } else if (selectedSemester === '') {
            failure('Please select the semester')
            fileInput.value = null;
            return
        }
        else if (assignmentDetails.name.length < 5) {
            failureLong('Name should be atleast 5 characters long');
            fileInput.value = null;
            return
        }
        else if (assignmentDetails.subject.length < 5) {
            failureLong('Subject should be atleast 5 characters long');
            fileInput.value = null;
            return
        }
        else if (assignmentDetails.subjectCode.length < 3) {
            failureLong('Sub Code should be atleast 3 characters long');
            fileInput.value = null;
            return
        }

        uploadAssignmentFile(file, assignmentDetails, setAssignmentDetails, selectedCourse, setSelectedCourse, selectedSemester, setSelectedSemester)
        fileInput.value = null;
        setSelectedSubject({ subjectCode: '', subject: '' });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssignmentDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));

        if (name === 'course')
            setSelectedCourse(value);

        if (name === 'semester')
            setSelectedSemester(value);
    };

    const handleSelectedSubjectChange = (e) => {
        const { value } = e.target;
        const subjectCode = value.split(':')[0];
        const subject = value.split(':')[1];
        setSelectedSubject({ subjectCode, subject });
        if (subjectCode !== '' && subject !== '') {
            setAssignmentDetails((prevDetails) => ({
                ...prevDetails,
                subjectCode,
                subject
            }));
        }
    };

    const renderFileUpload = () => {
        if (!assignmentDetails.url) {
            return (
                <>
                    <label className='preview flex flex-col items-center justify-center p-2 mb-8' htmlFor="assignmentFile">
                        <Image className=" h-full w-full cursor-pointer" src="/images/upload.svg" width={200} height={200} alt='Upload Image' />
                        {loading && <Image className='relative mx-auto mb-4 lg:mb-0 h-10 w-10' src='https://samherbert.net/svg-loaders/svg-loaders/three-dots.svg' width={500} height={500} alt='clip' />}
                        {/* <FaCloudUploadAlt className="text-[#F02D65] -mt-20 text-[15rem] cursor-pointer" /> */}
                        <input onChange={manageAssignmentFileUpload} className="hidden" type="file" name="assignmentFile" id="assignmentFile" />
                    </label>
                    <button className='text-white text-sm mb-4'>Click on above image to upload file</button>
                </>
            );
        }

        return (
            <div className="preview flex flex-col items-center justify-center mb-8">
                <Image className=" h-full w-full" src="/images/uploaded.svg" width={200} height={200} alt='Upload Image' />
                <Link target='_blank' href={assignmentDetails.url}>
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
                            <h1 className=" text-5xl lg:text-7xl font-jost">Upload Assignments</h1>
                        </div>
                        <div className="formContent order-2 lg:order-1 py-5 lg:py-10 px-6 lg:px-12   lg:w-[60%] flex-col items-center justify-center">
                            <div className="heading hidden font-bold lg:block mb-8">
                                <h1 className=" text-5xl lg:text-7xl font-jost">Upload Assignments</h1>
                            </div>
                            <form>
                                <div className="datetime flex space-x-4">
                                    <select
                                        onChange={handleInputChange}
                                        className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white select-arrow"
                                        name="course"
                                        id="course"
                                        value={selectedCourse}
                                        defaultValue=''
                                    >
                                        <option disabled value=''>
                                            Select Course
                                        </option>
                                        {courseOptions.map((option, index) => (
                                            <option key={index} value={option.value} className="bg-white">
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        onChange={handleInputChange}
                                        className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white select-arrow"
                                        name="semester"
                                        id="semester"
                                        value={selectedSemester}
                                        defaultValue=''
                                    >
                                        <option disabled value=''>Select Semester</option>
                                        {semesterOptions.map((option, index) => (
                                            <option key={index} value={option.value} className="bg-white">
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <input
                                    onChange={handleInputChange}
                                    required
                                    className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={assignmentDetails.name}
                                    placeholder="Enter the assignment name..."
                                />

                                <select
                                    value={selectedSubject.subjectCode !== '' ? `${selectedSubject.subjectCode}:${selectedSubject.subject}` : ''}
                                    onChange={handleSelectedSubjectChange}
                                    className="p-4 my-2 rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                >
                                    <option value="">Select a subject</option>
                                    {subjects.map((subject, index) => (
                                        <option key={index} value={`${subject.subjectCode}:${subject.subjectName}`}>
                                            {subject.subjectCode} : {subject.subjectName}
                                        </option>
                                    ))}
                                </select>

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

export default UploadAssignments;