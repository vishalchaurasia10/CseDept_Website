import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { navbarDetails } from '@/utils/constants';
import Button from './Button';
import Image from 'next/image';
import roleContext from '@/context/role/roleContext';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { Client, Account, Databases, Query } from "appwrite";

const Navbar = () => {

    const router = useRouter();
    const [navExpand, setNavExpand] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const RoleContext = useContext(roleContext)
    const { role, setRole } = RoleContext

    const expandNav = () => {
        setNavExpand(!navExpand)
    }

    const expandDetails = () => {
        setShowDetails(!showDetails)
    }

    const checkVerification = async () => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
            const account = new Account(client);

            const response = await account.get();

            if (response !== null) {
                setRole({ name: response.name, email: response.email, status: response.emailVerification, })
                decideRole(response.$id)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const decideRole = async (id) => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
            const databases = new Databases(client);

            const response = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_USERS_COLLECTION_ID, [Query.search('id', id)]
            );


            if (response.documents[0].role === 'admin') {
                setRole((prevRole) => ({ ...prevRole, role: 'admin' }));
            } else if (response.documents[0].role === 'faculty') {
                setRole((prevRole) => ({ ...prevRole, role: 'faculty' }));
            }
        } catch (error) {
            console.log(error)
        }
    }

    const signOut = async () => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
            const account = new Account(client);

            const response = await account.deleteSession('current');

            if (response !== null) {
                setRole({ name: '', email: '', status: false, role: 'student' })
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        checkVerification()
    }, [])

    return (
        <>
            <nav
                className='z-20 text-white font-jost fixed top-0 left-0 right-0 bg-black flex justify-between items-center px-5 md:px-10 pb-2 lg:pb-0 pt-2'>

                <div className="left w-1/2 lg:w-full ">
                    <Link href='/'>
                        <Image className='relative top-1 scale-110 lg:top-0 lg:scale-100' src='/images/logo.png' width={200} height={200} alt='msrit_logo' />
                    </Link>
                </div>

                <div className="center lg:w-full hidden lg:-mt-1 lg:block">
                    <ul className='flex items-center justify-center space-x-6 text-xl'>
                        {
                            navbarDetails.map((item) => {
                                const { key, title, url } = item;
                                return (
                                    <Link key={key} href={`${url}`}>
                                        <div className="relative group whitespace-nowrap">
                                            <span className={`hover:bg-[rgba(255,255,255,0.2)] ${router.pathname === url ? 'bg-[rgba(255,255,255,0.2)]' : ''} p-1 px-4 rounded-md transition-all duration-300 cursor-pointer`}>{title}</span>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </ul>
                </div>

                <div className="right w-3/4 lg:-mt-1 lg:w-full flex justify-end">
                    {role.role === 'student' ?
                        <Button destination='/sign-in' content='LogIn' />
                        :
                        <div onClick={expandDetails} className={`relative flex items-center space-x-3`}>
                            <Button destination='/adminPanel' content='Upload' />
                            <FaUserCircle className='text-2xl hover:scale-110 transition-all duration-300 cursor-pointer' />
                            <div className={`credentials ${showDetails ? 'opacity-100' : 'opacity-0'} transition-all duration-300 py-4 pb-6 bg-pureWhite text-[#565656] font-jost rounded-2xl shadow-2xl shadow-black absolute right-0 top-14 text-sm tracking-wide space-y-1`}>
                                <div className="name py-2 px-10">
                                    <p className='font-bold text-black -mb-1' title={role.name} >{role.name}</p>
                                    <p className='text-[#565656] text-sm font-extralight' title={role.email}>{role.email}</p>
                                </div>
                                <div className="status py-2 px-10 hover:bg-[#f5f5f5]">
                                    <p>Status : {role.status ? 'verified' : 'unverified'}</p>
                                </div>
                                <div className="role py-2 px-10 hover:bg-[#f5f5f5]">
                                    <p>Role : {role.role}</p>
                                </div>
                                <div onClick={signOut} className="signout cursor-pointer py-2 px-10 hover:bg-[#f5f5f5]">
                                    <FaSignOutAlt className='text-lg inline mr-2' />
                                    <p className='inline'>Sign Out</p>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <div className="hamburger relative -mr-2 ml-2 lg:hidden space-y-1">
                    <div onClick={expandNav} className={`${navExpand ? '-rotate-45 translate-y-[0.45rem]' : ''} w-6 transition-all duration-300 rounded-full bg-pureWhite h-1`}></div>
                    <div onClick={expandNav} className={`${navExpand ? 'scale-0' : ''} w-6 transition-all duration-300 rounded-full bg-pureWhite h-1`}></div>
                    <div onClick={expandNav} className={`${navExpand ? 'rotate-45 -translate-y-2' : ''} w-6 transition-all duration-300 rounded-full bg-pureWhite h-1`}></div>
                </div>
            </nav >

            <div className={`expanded lg:hidden w-full ${router.pathname.includes('/[unit]') ? 'text-black' : (router.pathname.includes('/courses') ? 'text-gray-400' : 'text-white')} z-[15] h-screen flex flex-col items-center justify-center backdrop-blur-3xl fixed top-0 transition-all duration-500 ${navExpand ? '' : 'translate-x-[60rem]'}`}>
                <h1 className={`logo font-jost my-4 font-extrabold text-5xl`}>Msrit<span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500'>CSE</span> </h1>
                <ul className={`flex text-2xl space-y-4 flex-col justify-center font-jost text-center items-center`}>
                    <li onClick={expandNav} className='cursor-pointer'><Link href='/'>Home</Link></li>
                    <li onClick={expandNav} className='cursor-pointer'><Link href='/courses'>Courses</Link></li>
                    <li onClick={expandNav} className='cursor-pointer'><Link href='/faculty'>Faculty</Link></li>
                    <li onClick={expandNav} className='cursor-pointer'><Link href='/timetable'>Time Table</Link></li>
                    <li onClick={expandNav} className='cursor-pointer'><Link href='/announcements'>Announcements</Link></li>
                    <li onClick={expandNav} className='cursor-pointer'><Link href='/importantlinks'>Important Links</Link></li>
                </ul>
            </div>

        </>
    )
}

export default Navbar