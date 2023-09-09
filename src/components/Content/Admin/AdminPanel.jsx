import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import roleContext from '@/context/role/roleContext';
import UploadSubjects from '@/components/Admin/UploadSubjects';
import UploadImportantLinks from '@/components/Admin/UploadImportantLinks';
import UploadNotes from '@/components/Admin/UploadNotes';
import UploadAssignments from '@/components/Admin/UploadAssignment';
import MakeAnnouncements from '@/components/Admin/MakeAnnouncements';
import UploadTimeTable from '@/components/Admin/UploadTimeTable';
import Loader from '@/components/Layout/Loader';

const AdminPanel = () => {
    const router = useRouter();
    const RoleContext = useContext(roleContext);
    const { role } = RoleContext;

    const [activeTab, setActiveTab] = useState('notes');

    const checkVerification = async () => {
        if (role.role === 'student') {
            router.push('/sign-in');
        }
    }

    useEffect(() => {
        checkVerification();
    }, []);

    const tabOptions = [
        { key: 'subjects', label: 'Upload Subjects' },
        { key: 'links', label: 'Upload Important Links' },
        { key: 'notes', label: 'Upload Notes' },
        { key: 'assignments', label: 'Upload Assignments' },
        { key: 'announcements', label: 'Upload Announcements' },
        { key: 'timetable', label: 'Upload TimeTable' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'subjects':
                return <UploadSubjects />;
            case 'links':
                return <UploadImportantLinks />;
            case 'notes':
                return <UploadNotes />;
            case 'assignments':
                return <UploadAssignments />;
            case 'announcements':
                return <MakeAnnouncements />;
            case 'timetable':
                return <UploadTimeTable />;
            default:
                return null;
        }
    }

    return (
        <>
            {(role.role !== 'student') ?
                <div className=''>
                    <div className="tabs pt-24 md:pt-28 px-3 lg:px-40 flex flex-wrap items-center justify-stretch md:justify-center">
                        {role.role === 'admin' ?
                            tabOptions.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`tab-button mr-2 my-1 p-2 rounded-lg transition-all duration-150 ${activeTab === tab.key ? 'active bg-slate-500 text-white' : 'bg-slate-300'}`}
                                >
                                    {tab.label}
                                </button>
                            )) :
                            tabOptions.filter((tab) => tab.key === 'notes' || tab.key === 'assignments').map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`tab-button mr-2 my-1 p-2 rounded-lg transition-all duration-150 ${activeTab === tab.key ? 'active bg-slate-500 text-white' : 'bg-slate-300'}`}
                                >
                                    {tab.label}
                                </button>
                            ))
                        }
                    </div>
                    <div className="tab-content mt-12 md:mt-4 mb-14">
                        {renderTabContent()}
                    </div>
                </div>
                :
                <div className="loading flex items-center justify-center h-screen">
                    <Loader />
                </div>
            }
        </>
    )
}

export default AdminPanel;
