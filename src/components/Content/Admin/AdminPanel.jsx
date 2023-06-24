import React from 'react'
import UploadNotes from '../../Admin/UploadNotes';
import MakeAnnouncements from '../../Admin/MakeAnnouncements';
import ManageFaculty from '@/components/Admin/ManageFaculty';
import UploadTimeTable from '@/components/Admin/UploadTimeTable';
import UploadImportantLinks from '@/components/Admin/UploadImportantLinks';

const AdminPanel = () => {
    return (
        <>
            <UploadImportantLinks />
            <UploadNotes />
            <MakeAnnouncements />
            <ManageFaculty />
            <UploadTimeTable />
        </>
    )
}

export default AdminPanel
