import { useContext, useState } from "react";
import ImportantlinkContext from "./importantlinkContext";
import { Client, Databases, ID, Storage } from "appwrite";
import loadingContext from "../loading/loadingContext";
import { Toaster, toast } from "react-hot-toast";

const ImportantlinkState = (props) => {

    const [importantlink, setImportantlink] = useState([])
    const LoadingContext = useContext(loadingContext);
    const { setLoading } = LoadingContext;
    const failure = (message) => toast.error(message, { duration: 3000 });

    const uploadImportantFile = async (file) => {
        try {
            setLoading(true);

            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
            const storage = new Storage(client);

            const result = await storage.createFile(
                process.env.NEXT_PUBLIC_LINKS_BUCKET_ID,
                ID.unique(),
                file
            );

            const fileId = result.$id;
            const uploadedFile = storage.getFileView(
                process.env.NEXT_PUBLIC_LINKS_BUCKET_ID,
                fileId
            );

            toast.promise(
                Promise.resolve(fileId), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'File successfully uploaded!',
                    error: () => 'Error uploading timetable.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

            setLoading(false);
            return uploadedFile.href;
        } catch (error) {
            failure(error.message);
            setLoading(false);
        }
    }

    const uploadImportantDocument = async (links) => {
        try {
            setLoading(true);
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const result = await databases.createDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_IMPORTANTLINKS_COLLECTION_ID,
                ID.unique(),
                {
                    topic: links.topic,
                    url: links.url,
                },
            );
            setLoading(false);

            toast.promise(
                Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Link successfully uploaded!',
                    error: () => 'Error uploading Link.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

        } catch (error) {
            failure(error.message);
            setLoading(false);
        }
    }

    const fetchImportantlink = async () => {
        try {
            setLoading(true);
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_IMPORTANTLINKS_COLLECTION_ID,);

            setImportantlink(result.documents.reverse());
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }


    const deleteImportantFile = async (fileId) => {
        try {
            const client = new Client();
            const storage = new Storage(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint   
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            await storage.deleteFile(process.env.NEXT_PUBLIC_LINKS_BUCKET_ID, fileId);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const deleteImportantlink = async (id, fileId) => {
        try {
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint   
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.deleteDocument(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_IMPORTANTLINKS_COLLECTION_ID, id);

            if (fileId !== null)
                await deleteImportantFile(fileId);
            fetchImportantlink();
            return result;
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            <Toaster />
            <ImportantlinkContext.Provider value={{ importantlink, setImportantlink, fetchImportantlink, deleteImportantlink, uploadImportantFile, uploadImportantDocument }}>
                {props.children}
            </ImportantlinkContext.Provider>
        </>
    )
}

export default ImportantlinkState