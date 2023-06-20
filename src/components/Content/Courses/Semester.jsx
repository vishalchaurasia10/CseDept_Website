import Image from 'next/image'
import React, { useContext, useEffect } from 'react'
import { semesterDetails } from '@/utils/constants';
import Link from 'next/link';
import { Client, Databases } from "appwrite";
import noteContext from '@/context/notes/noteContext';

const Semester = () => {

    const NoteContext = useContext(noteContext);
    const { notes, setNotes } = NoteContext;

    useEffect(() => {

        const fetchNotes = async () => {
            try {
                const client = new Client();
                const databases = new Databases(client);
                client
                    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

                const result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID,);

                setNotes(result.documents);
            } catch (error) {
                console.log(error);
            }
        }

        fetchNotes();
    }, [])

    return (
        <>
            <div className="semesters lg:px-28 px-4 py-20 md:py-24 font-jost">
                <h1 className='text-7xl pb-8 lg:px-6 font-jost font-extrabold'>Courses</h1>
                <div className="wrapper flex flex-wrap">
                    {semesterDetails.map((item) => {
                        const { key, title, url } = item;
                        return (
                            <div key={key} className="semester mb-6 mx-2 lg:mx-5 flex flex-col justify-center items-center">
                                <Link href={`${url}`}>
                                    <Image className='cursor-pointer w-40 lg:w-64 hover:scale-105 transition-all duration-300' src='/images/folder.svg' width={300} height={300} alt='folder' />
                                </Link>
                                <Link href={`${url}`}>
                                    <h2 className=' text-xl py-2 font-jost'>{title}</h2>
                                </Link>
                            </div>
                        )
                    }
                    )}
                </div>
            </div>
        </>
    )
}

export default Semester
