import React, { useContext, useEffect, useState } from 'react'
import UploadNotes from '../../Admin/UploadNotes';
import MakeAnnouncements from '../../Admin/MakeAnnouncements';
// import ManageFaculty from '@/components/Admin/ManageFaculty';
import UploadTimeTable from '@/components/Admin/UploadTimeTable';
import UploadImportantLinks from '@/components/Admin/UploadImportantLinks';
import UploadAssignments from '@/components/Admin/UploadAssignment';
import { useRouter } from 'next/router';
import Image from 'next/image';
import roleContext from '@/context/role/roleContext';
import UploadSubjects from '@/components/Admin/UploadSubjects';

const AdminPanel = () => {
    const router = useRouter()
    const RoleContext = useContext(roleContext)
    const { role } = RoleContext

    const checkVerification = async () => {
        if (role.role === 'student') {
            router.push('/sign-in')
        }
    }

    useEffect(() => {
        checkVerification()
    }, [])

    return (
        <>
            {(role.role !== 'student') ?
                <div>
                    {role.role === 'admin' ?
                        <div>
                            <UploadSubjects />
                            <UploadImportantLinks />
                            <UploadNotes />
                            <UploadAssignments />
                            <MakeAnnouncements />
                            {/* <ManageFaculty /> */}
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
