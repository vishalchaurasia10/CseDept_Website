import React from 'react'
import UploadNotes from '../../Admin/UploadNotes';
import MakeAnnouncements from '../../Admin/MakeAnnouncements';
import ManageFaculty from '@/components/Admin/ManageFaculty';

const AdminPanel = () => {
    return (
        <>
            <UploadNotes />
            <MakeAnnouncements />
            <ManageFaculty />
        </>
    )
}

export default AdminPanel
