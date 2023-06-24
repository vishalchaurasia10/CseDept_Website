import React from 'react'
import UploadNotes from '../../Admin/UploadNotes';
import MakeAnnouncements from '../../Admin/MakeAnnouncements';
import ManageFaculty from '@/components/Admin/ManageFaculty';
import UploadTimeTable from '@/components/Admin/UploadTimeTable';
import UploadImportantLinks from '@/components/Admin/UploadImportantLinks';
import UploadAssignments from '@/components/Admin/UploadAssignment';

const AdminPanel = () => {
    return (
        <>
            <UploadImportantLinks />
            <UploadNotes />
            <UploadAssignments />
            <MakeAnnouncements />
            <ManageFaculty />
            <UploadTimeTable />
        </>
    )
}

export default AdminPanel
