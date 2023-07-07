import React, { useState } from 'react';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { Client, Databases, ID } from 'appwrite';

const failure = (message) => toast.error(message, { duration: 3000 });

const UploadSubjects = () => {
    const [loading, setLoading] = useState(false);
    const [semester, setSemester] = useState('');
    const [subjects, setSubjects] = useState([{ subjectCode: '', subjectName: '' }]);

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const updatedSubjects = [...subjects];
        updatedSubjects[index] = { ...updatedSubjects[index], [name]: value };
        setSubjects(updatedSubjects);

        if (name === 'semester') {
            setSemester(value);
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
                },
            );

            if (result.$id) {
                setLoading(false);
                toast.success('Subjects uploaded successfully', { duration: 3000 });
                setSubjects([{ subjectCode: '', subjectName: '' }]);
                setSemester('');
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            failure('Something went wrong');
            setLoading(false);
        }
    }

    const CheckValidity = () => {

        for (let i = 0; i < subjects.length; i++) {
            if (subjects[i].subjectCode === '' || subjects[i].subjectName === '') {
                failure('Please fill all the fields');
                return;
            }
        }

        handleUpload();
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
                                    </button>
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