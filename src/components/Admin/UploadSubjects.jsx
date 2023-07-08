import React, { useEffect, useState } from 'react';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { Client, Databases, ID, Query } from 'appwrite';

const failure = (message) => toast.error(message, { duration: 3000 });

const UploadSubjects = () => {
    const [loading, setLoading] = useState(false);
    const [semester, setSemester] = useState('');
    const [course, setCourse] = useState('')
    const [subjects, setSubjects] = useState([{ subjectCode: '', subjectName: '' }]);
    const [alreadyUploaded, setAlreadyUploaded] = useState(false)
    const [subjectID, setSubjectID] = useState('')

    const fetchSubjects = async () => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const result = await databases.listDocuments(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_SUBJECTS_COLLECTION_ID,
                [Query.equal('semester', semester), Query.equal('course', course)]
            );

            if (result.total === 0) {
                setSubjects([{ subjectCode: '', subjectName: '' }]);
                setAlreadyUploaded(false)
                return;
            } else {
                toast.success("Subjects already uploaded you can now edit them", { duration: 3000 })
                setSubjects(JSON.parse(result.documents[0].subjects));
                setCourse(result.documents[0].course)
                setSubjectID(result.documents[0].$id)
                setAlreadyUploaded(true)
            }
        } catch (error) {
            console.log(error);
            failure('Ask Admin to upload the subjects first');
        }
    }

    useEffect(() => {
        if (semester !== '' && course !== '') {
            fetchSubjects();
        }
    }, [semester, course]);

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const updatedSubjects = [...subjects];
        updatedSubjects[index] = { ...updatedSubjects[index], [name]: value };
        setSubjects(updatedSubjects);

        if (name === 'semester') {
            setSemester(value);
        }

        if (name === 'course') {
            setCourse(value)
        }
    };

    const handleAddInput = () => {
        setSubjects([...subjects, { subjectCode: '', subjectName: '' }]);
    };

    const handleRemoveInput = (index) => {
        const updatedSubjects = [...subjects];
        updatedSubjects.splice(index, 1);
        setSubjects(updatedSubjects);
    };

    const handleUpload = async () => {
        setLoading(true);
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const result = await databases.createDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_SUBJECTS_COLLECTION_ID,
                ID.unique(),
                {
                    subjects: JSON.stringify(subjects),
                    semester: semester,
                    course: course
                },
            );

            if (result.$id) {
                setLoading(false);
                toast.success('Subjects uploaded successfully', { duration: 3000 });
                setSubjects([{ subjectCode: '', subjectName: '' }]);
                setSemester('');
                setCourse('')
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            failure('Something went wrong');
            setLoading(false);
        }
    }

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const result = await databases.updateDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_SUBJECTS_COLLECTION_ID,
                subjectID,
                {
                    subjects: JSON.stringify(subjects),
                    semester: semester,
                    course: course
                },
            );

            if (result.$id) {
                setLoading(false);
                toast.success('Subjects updated successfully', { duration: 3000 });
                setSubjects([{ subjectCode: '', subjectName: '' }]);
                setSemester('');
                setCourse('')
                setSubjectID('')
                setAlreadyUploaded(false)
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            failure('Something went wrong');
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const result = await databases.deleteDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_SUBJECTS_COLLECTION_ID,
                subjectID,
            );

            if (result) {
                toast.success('Subjects deleted successfully', { duration: 3000 });
                setSubjects([{ subjectCode: '', subjectName: '' }]);
                setSemester('');
                setCourse('')
                setSubjectID('')
                setAlreadyUploaded(false)
            }
        } catch (error) {
            console.log(error);
            failure('Something went wrong');
        }
    }


    const CheckValidity = () => {

        for (let i = 0; i < subjects.length; i++) {
            if (subjects[i].subjectCode === '' || subjects[i].subjectName === '') {
                failure('Please fill all the fields');
                return;
            }
        }

        if (semester === '' || course === '') {
            failure('Please fill all the fields');
            return;
        }

        handleUpload();
    };

    const CheckUpdateValidity = () => {

        for (let i = 0; i < subjects.length; i++) {
            if (subjects[i].subjectCode === '' || subjects[i].subjectName === '') {
                failure('Please fill all the fields');
                return;
            }
        }

        if (semester === '' || course === '') {
            failure('Please fill all the fields');
            return;
        }

        handleUpdate();
    };

    return (
        <>
            <Toaster />
            <div className="wrapper md:scale-90 px-2 lg:px-40 mt-10 lg:mt-14 -mb-4 flex items-center justify-center">
                <div className="container shadow-2xl shadow-black bg-[#D7D9DD] text-[#262626] font-jost mt-20 w-full rounded-2xl border-2 border-white">
                    <div className="content flex flex-col lg:flex-row">
                        <div className="heading lg:hidden block mt-6 px-7 font-bold">
                            <h1 className="text-5xl lg:text-7xl font-jost">Upload Subjects</h1>
                        </div>
                        <div className="formContent order-2 lg:order-1 py-5 lg:py-10 px-6 lg:px-12 w-full flex-col items-center justify-center">
                            <div className="heading hidden font-bold lg:block mb-8">
                                <h1 className="text-5xl lg:text-7xl font-jost">Upload Subjects</h1>
                            </div>
                            <div className="flex flex-col lg:flex-row w-full lg:space-x-4 items-center">
                                <form className="flex items-center flex-col lg:mr-4 w-full">
                                    <select
                                        onChange={handleInputChange}
                                        className="p-4 my-2  rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white select-arrow"
                                        name="course"
                                        id="course"
                                        value={course}
                                        defaultValue=''
                                    >
                                        <option disabled value=''>
                                            Select Course
                                        </option>
                                        <option className='bg-white' value="ug">
                                            UG
                                        </option>
                                        <option className=" bg-white" value="pg">
                                            PG
                                        </option>
                                        <option className=" bg-white" value="vocational">
                                            Vocational Courses
                                        </option>
                                        <option className=" bg-white" value="core">
                                            Core Courses
                                        </option>
                                        <option className=" bg-white" value="open">
                                            Open Electives
                                        </option>
                                    </select>
                                    <input
                                        onChange={(event) => handleInputChange(event)}
                                        required
                                        className="p-4 my-2 rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                        type="text"
                                        name="semester"
                                        value={semester}
                                        placeholder="Enter the semester number"
                                    />
                                    {subjects.map((subject, index) => (
                                        <div key={index} className='flex w-full items-center'>
                                            <input
                                                onChange={(event) => handleInputChange(event, index)}
                                                required
                                                className="p-4 mr-4 my-2 rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                                type="text"
                                                name="subjectCode"
                                                value={subject.subjectCode}
                                                placeholder="Enter the subject code"
                                            />

                                            <input
                                                onChange={(event) => handleInputChange(event, index)}
                                                required
                                                className="p-4 my-2 rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                                type="text"
                                                name="subjectName"
                                                value={subject.subjectName}
                                                placeholder="Enter the subject name"
                                            />
                                            {index > 0 && (
                                                <FaMinusCircle
                                                    className="text-6xl mx-2 text-[#262626] cursor-pointer"
                                                    onClick={() => handleRemoveInput(index)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </form>
                                <FaPlusCircle
                                    className="text-5xl text-[#262626] cursor-pointer"
                                    onClick={handleAddInput}
                                />
                                <div className="button mt-4 lg:mt-0">
                                    {!alreadyUploaded ?
                                        <button
                                            onClick={CheckValidity}
                                            className="group bg-pink-500 relative inline-flex items-center justify-center overflow-hidden rounded-3xl px-8 p-2 font-medium tracking-wide text-xl shadow-2xl border border-[#b2b4b6] hover:scale-105 transition duration-300 ease-out text-white hover:shadow-orange-600 active:translate-y-1"
                                        >
                                            {loading && (
                                                <Image
                                                    className="relative mx-auto pr-2 lg:mb-0 h-10 w-10"
                                                    src="https://samherbert.net/svg-loaders/svg-loaders/three-dots.svg"
                                                    width={500}
                                                    height={500}
                                                    alt="clip"
                                                />
                                            )}
                                            <span className="relative">Upload</span>
                                        </button> :
                                        <div className='buttons flex flex-col space-y-2 lg:space-y-4'>
                                            <button
                                                onClick={CheckUpdateValidity}
                                                className="group bg-pink-500 relative inline-flex items-center justify-center overflow-hidden rounded-3xl px-8 p-2 font-medium tracking-wide text-xl shadow-2xl border border-[#b2b4b6] hover:scale-105 transition duration-300 ease-out text-white hover:shadow-orange-600 active:translate-y-1"
                                            >
                                                {loading && (
                                                    <Image
                                                        className="relative mx-auto pr-2 lg:mb-0 h-10 w-10"
                                                        src="https://samherbert.net/svg-loaders/svg-loaders/three-dots.svg"
                                                        width={500}
                                                        height={500}
                                                        alt="clip"
                                                    />
                                                )}
                                                <span className="relative whitespace-nowrap">Save Changes</span>
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="group bg-pink-500 relative inline-flex items-center justify-center overflow-hidden rounded-3xl px-8 p-2 font-medium tracking-wide text-xl shadow-2xl border border-[#b2b4b6] hover:scale-105 transition duration-300 ease-out text-white hover:shadow-orange-600 active:translate-y-1"
                                            >
                                                {loading && (
                                                    <Image
                                                        className="relative mx-auto pr-2 lg:mb-0 h-10 w-10"
                                                        src="https://samherbert.net/svg-loaders/svg-loaders/three-dots.svg"
                                                        width={500}
                                                        height={500}
                                                        alt="clip"
                                                    />
                                                )}
                                                <span className="relative">Delete</span>
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UploadSubjects;
// {"subjectCode":"FAFL(CS44)","subjectName":"Formal Automata and Finite Language"},{"subjectCode":"NTPM(CS41)","subjectName":"Numerical Technique and Probability Measurement"},{"subjectCode":"DAA(CS45)","subjectName":"Design Analysis and Algorithm"}