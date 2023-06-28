import React, { useContext, useEffect, useState } from 'react'
import UploadNotes from '../../Admin/UploadNotes';
import MakeAnnouncements from '../../Admin/MakeAnnouncements';
import ManageFaculty from '@/components/Admin/ManageFaculty';
import UploadTimeTable from '@/components/Admin/UploadTimeTable';
import UploadImportantLinks from '@/components/Admin/UploadImportantLinks';
import UploadAssignments from '@/components/Admin/UploadAssignment';
import { Client, Account, Databases, Query } from "appwrite";
import { useRouter } from 'next/router';
import Image from 'next/image';
import roleContext from '@/context/role/roleContext';

const AdminPanel = () => {
    const router = useRouter()
    const [user, setUser] = useState(false)
    const RoleContext = useContext(roleContext)
    const { role, setRole } = RoleContext

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
                decideRole(response.$id)
            }

        } catch (error) {
            router.push('/sign-in')
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

            console.log(response.documents[0].role)

            if (response.documents[0].role === 'admin') {
                setRole('admin')
            } else if (response.documents[0].role === 'faculty') {
                setRole('faculty')
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
            {user ?
                <div>
                    {role === 'admin' ?
                        <div>
                            <UploadImportantLinks />
                            <UploadNotes />
                            <UploadAssignments />
                            <MakeAnnouncements />
                            <ManageFaculty />
                            <UploadTimeTable />
                        </div>
                        :
                        <div>
                            <UploadNotes />
                            <UploadAssignments />
                        </div>
                    }

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
