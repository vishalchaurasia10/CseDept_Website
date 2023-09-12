import { useContext, useState } from "react";
import AnnouncementContext from "./announcementContext";
import { Client, Databases, ID, Storage } from "appwrite";
import loadingContext from "../loading/loadingContext";
import { Toaster, toast } from "react-hot-toast";

const AnnouncementState = (props) => {

    const [announcements, setAnnouncement] = useState([])
    const LoadingContext = useContext(loadingContext);
    const { setLoading } = LoadingContext;
    const failure = (message) => toast.error(message, { duration: 3000 });

    const uploadAnnouncementFile = async (file) => {
        try {
            setLoading(true);

            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
            const storage = new Storage(client);

            const result = await storage.createFile(
                process.env.NEXT_PUBLIC_ANNOUNCEMENTS_BUCKET_ID,
                ID.unique(),
                file
            );


            const fileId = result.$id;
            const uploadedFile = storage.getFileView(
                process.env.NEXT_PUBLIC_ANNOUNCEMENTS_BUCKET_ID,
                fileId
            );

            toast.promise(
                Promise.resolve(fileId), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Link successfully uploaded!',
                    error: () => 'Error uploading link.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

            setLoading(false);
            return uploadedFile.href;

        } catch (error) {
            failure('Something went wrong');
            setLoading(false);
        }
    };

    const uploadAnnouncementDocument = async (announcement) => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const formattedDateTime = `${announcement.date} ${announcement.time}:00.000`;

            const result = await databases.createDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_ANNOUNCEMENTS_COLLECTION_ID,
                ID.unique(),
                {
                    title: announcement.title,
                    description: announcement.description,
                    venue: announcement.venue,
                    date: formattedDateTime,
                    url: announcement.url,
                },
            );

            toast.promise(
                Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Announcement successfully uploaded!',
                    error: () => 'Error uploading announcement.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

        } catch (error) {
            failure(error.message);
        }

    };

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_ANNOUNCEMENTS_COLLECTION_ID,);

            setAnnouncement(result.documents.reverse());
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteFile = async (fileId) => {
        try {
            const client = new Client();
            const storage = new Storage(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            await storage.deleteFile(process.env.NEXT_PUBLIC_ANNOUNCEMENTS_BUCKET_ID, fileId);

        } catch (error) {
            console.log(error);
        }
    }

    const deleteAnnouncement = async (id, fileId) => {
        try {
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.deleteDocument(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_ANNOUNCEMENTS_COLLECTION_ID, id);

            if (fileId) {
                await deleteFile(fileId);
            }
            toast.promise(
                Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Announcement successfully deleted!',
                    error: () => 'Error deleting announcement.',
                    duration: 3000,
                    position: 'top-center',
                }
            );
            fetchAnnouncements();
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    const updateAnnouncementDocument = async (id, newData) => {
        try {
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.updateDocument(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_ANNOUNCEMENTS_COLLECTION_ID, id, newData);

            toast.promise(
                Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Announcement successfully updated!',
                    error: () => 'Error updating timetable.',
                    duration: 3000,
                    position: 'top-center',
                }
            );
            fetchAnnouncements();
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <Toaster />
            <AnnouncementContext.Provider value={{ announcements, setAnnouncement, fetchAnnouncements, deleteAnnouncement, uploadAnnouncementFile, uploadAnnouncementDocument, updateAnnouncementDocument }}>
                {props.children}
            </AnnouncementContext.Provider>
        </>
    )
}

export default AnnouncementState