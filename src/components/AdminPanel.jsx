import React, { useEffect, useState } from 'react'
import { Client, Storage, ID } from 'appwrite'
import UploadNotes from './Admin/UploadNotes';

const AdminPanel = () => {
    // const [fileDetails, setFileDetails] = useState(null);

    // useEffect(() => {
    //     const client = new Client()
    //         .setEndpoint('https://cloud.appwrite.io/v1')
    //         .setProject('6478c5e7959a86375ccd');
    //     const storage = new Storage(client);
    //     const handleFileUpload = async (e) => {
    //         try {
    //             const fileInput = document.getElementById('uploader');
    //             const file = fileInput.files[0];

    //             const result = await storage.createFile('648b2acada1ff137005c', ID.unique(), file);
    //             console.log(result); // Success

    //             const fileId = result.$id;
    //             console.log(fileId);
    //             const uploadedFile = storage.getFileView('648b2acada1ff137005c', fileId);
    //             console.log(uploadedFile);
    //         } catch (error) {
    //             console.log(error); // Failure
    //         }
    //     }

    //     document.getElementById('uploader').addEventListener('change', handleFileUpload);

    //     return () => {
    //         document.getElementById('uploader').removeEventListener('change', handleFileUpload);
    //     };
    // }, [])

    return (
        <UploadNotes />
        // <MakeAnnouncement />
    )
}

export default AdminPanel
