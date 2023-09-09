import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import announcementContext from '@/context/announcement/announcementContext';
import { inputFields1, inputFields2 } from '@/utils/constants';


const failure = (message) => toast.error(message, { duration: 3000 });
const failureLong = (message) => toast.error(message, { duration: 3000, style: { minWidth: '380px' } });

const MakeAnnouncements = () => {

    const [loading, setLoading] = useState(false);
    const { uploadAnnouncementFile, uploadAnnouncementDocument } = useContext(announcementContext);
    const [announcementDetails, setAnnouncementDetails] = useState({ title: '', description: '', url: null, date: '', venue: '', time: '' })

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
        else {
            uploadAnnouncementDocument(announcementDetails);
            setAnnouncementDetails({
                title: '',
                description: '',
                url: null,
                date: '',
                venue: '',
                time: ''
            });
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
            <div className="wrapper px-2 md:scale-90 lg:px-40 flex items-center justify-center">
                <div className="container shadow-2xl shadow-black bg-[#D7D9DD] text-[#262626] font-jost w-full rounded-2xl border-2 border-white">
                    <div className="content flex flex-col lg:flex-row">
                        <div className="heading lg:hidden block mt-6 px-7 font-bold">
                            <h1 className=" text-5xl lg:text-7xl font-jost">Upload Announcements</h1>
                        </div>
                        <div className="formContent order-2 lg:order-1 py-5 lg:py-10 px-6 lg:px-12   lg:w-[60%] flex-col items-center justify-center">
                            <div className="heading hidden font-bold lg:block mb-8">
                                <h1 className=" text-5xl lg:text-7xl font-jost">Upload Announcements</h1>
                            </div>
                            <form>

                                {inputFields1.map((field, index) => (
                                    <input
                                        key={index} // Use a unique key for each input element
                                        onChange={handleInputChange}
                                        required
                                        className="p-4 my-2 rounded-lg w-full shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                        type={field.type}
                                        name={field.name}
                                        id={field.name}
                                        value={announcementDetails[field.name]}
                                        placeholder={field.placeholder}
                                    />
                                ))}

                                <div className="datetime flex space-x-4">

                                    {inputFields2.map((field, index) => (
                                        <input
                                            key={index} // Use a unique key for each input element
                                            onChange={handleInputChange}
                                            required
                                            className="p-4 my-2 w-1/2  rounded-lg shadow shadow-black outline-none bg-[#b2b4b6] placeholder:text-[#262626] border border-white"
                                            type={field.type}
                                            name={field.name}
                                            id={field.name}
                                            value={announcementDetails[field.name]}
                                            placeholder={field.placeholder}
                                        />
                                    ))}
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
                                            onChange={async () => {
                                                let file = document.getElementById('announcementsFile').files[0]
                                                let announcementUrl = await uploadAnnouncementFile(file, announcementDetails)
                                                setAnnouncementDetails((prevDetails) => ({
                                                    ...prevDetails,
                                                    url: announcementUrl
                                                }));
                                                file = null;
                                            }}
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
                                    {!announcementDetails.url ? '' :
                                        <Link target='_blank' href={announcementDetails.url}>
                                            <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-md px-4 lg:px-8 py-3 font-medium tracking-wide text-white text-xl shadow-2xl border border-[rgba(255,255,255,0.5)]  hover:border-slate-100/20 hover:scale-110 transition duration-300 ease-out  hover:shadow-orange-600 active:translate-y-1">
                                                <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500  to-purple-500 opacity-0  transition duration-300 ease-out  group-hover:opacity-100  group-active:opacity-90"></span>
                                                <span className="relative">Preview</span>
                                            </button>
                                        </Link>}
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
