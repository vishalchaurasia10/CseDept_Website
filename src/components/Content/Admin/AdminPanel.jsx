import React, { useEffect, useState } from 'react'
import UploadNotes from '../../Admin/UploadNotes';
import MakeAnnouncements from '../../Admin/MakeAnnouncements';
import ManageFaculty from '@/components/Admin/ManageFaculty';
import UploadTimeTable from '@/components/Admin/UploadTimeTable';
import UploadImportantLinks from '@/components/Admin/UploadImportantLinks';
import UploadAssignments from '@/components/Admin/UploadAssignment';
import { Client, Account } from "appwrite";
import { useRouter } from 'next/router';
import Image from 'next/image';

const AdminPanel = () => {
    const router = useRouter()
    const [user, setUser] = useState(false)

    const checkVerification = async () => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
            const account = new Account(client);

            const response = await account.get();

            if (response.emailVerification === false) {
                router.push('/sign-in')
            } else {
                setUser(true)
            }

        } catch (error) {
            router.push('/sign-in')
        }
    }

    useEffect(() => {
        checkVerification()
    }, [])

    return (
        <>
            {user ?
                <div>
                    <UploadImportantLinks />
                    <UploadNotes />
                    <UploadAssignments />
                    <MakeAnnouncements />
                    <ManageFaculty />
                    <UploadTimeTable />
                </div>
                :
                <div className="loading flex items-center justify-center h-screen">
                    <Image src='/images/loading.gif' width={300} height={300} alt='notes' />
                </div>
            }
        </>
    )
}

export default AdminPanel
