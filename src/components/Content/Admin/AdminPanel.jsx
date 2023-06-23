import React from 'react'
import UploadNotes from '../../Admin/UploadNotes';
import MakeAnnouncements from '../../Admin/MakeAnnouncements';
import ManageFaculty from '@/components/Admin/ManageFaculty';
import UploadTimeTable from '@/components/Admin/UploadTimeTable';

const AdminPanel = () => {
    return (
        <>
            <UploadNotes />
            <MakeAnnouncements />
            <ManageFaculty />
            <UploadTimeTable />
        </>
    )
}

export default AdminPanel
