import { useContext, useState } from "react";
import TimetableContext from "./timetableContext";
import { Client, Databases, ID, Storage } from "appwrite";
import loadingContext from "../loading/loadingContext";
import { Toaster, toast } from "react-hot-toast";

const TimetableState = (props) => {

    const [timetable, setTimetable] = useState([])
    const LoadingContext = useContext(loadingContext);
    const { setLoading } = LoadingContext;
    const failure = (message) => toast.error(message, { duration: 3000 });

    const uploadTimeTableFile = async (file, timeTableDetails, setTimeTableDetails) => {
        try {
            setLoading(true);

            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
            const storage = new Storage(client);

            const result = await storage.createFile(
                process.env.NEXT_PUBLIC_TIMETABLE_BUCKET_ID,
                ID.unique(),
                file
            );

            const fileId = result.$id;
            const uploadedFile = storage.getFileView(
                process.env.NEXT_PUBLIC_TIMETABLE_BUCKET_ID,
                fileId
            );
            setTimeTableDetails((prevDetails) => ({
                ...prevDetails,
                url: uploadedFile.href,
            }));

            toast.promise(
                Promise.resolve(fileId), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'File successfully uploaded!',
                    error: () => 'Error uploading timetable.',
                    duration: 3000,
                    position: 'top-center',
                }
            );
            uploadTimeTableDocument(uploadedFile.href, timeTableDetails, setTimeTableDetails);
            setLoading(false);
        } catch (error) {
            failure(error.message);
            setLoading(false);
        }
    }

    const uploadTimeTableDocument = async (url, timeTableDetails, setTimeTableDetails) => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const result = await databases.createDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_TIMETABLE_COLLECTION_ID,
                ID.unique(),
                {
                    semester: timeTableDetails.semester,
                    section: timeTableDetails.section,
                    url: url,
                },
            );

            toast.promise(
                Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'TimeTable successfully uploaded!',
                    error: () => 'Error uploading TimeTable.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

        } catch (error) {
            failure('Something went wrong');
        }

        setTimeTableDetails({
            semester: '',
            section: '',
            url: null,
        });
    }

    const fetchTimeTable = async () => {
        try {
            setLoading(true);
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_TIMETABLE_COLLECTION_ID,);

            setTimetable(result.documents);
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

            await storage.deleteFile(process.env.NEXT_PUBLIC_TIMETABLE_BUCKET_ID, fileId);

        } catch (error) {
            console.log(error);
        }
    }

    const deleteTimetable = async (id, fileId) => {
        try {
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.deleteDocument(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_TIMETABLE_COLLECTION_ID, id);

            await deleteFile(fileId);
            fetchTimeTable();
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Toaster />
            <TimetableContext.Provider value={{ timetable, setTimetable, fetchTimeTable, deleteTimetable, uploadTimeTableFile }}>
                {props.children}
            </TimetableContext.Provider>
        </>
    )
}

export default TimetableState