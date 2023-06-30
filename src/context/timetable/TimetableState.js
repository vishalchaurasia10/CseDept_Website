import { useContext, useState } from "react";
import TimetableContext from "./timetableContext";
import { Client, Databases } from "appwrite";
import loadingContext from "../loading/loadingContext";

const TimetableState = (props) => {

    const [timetable, setTimetable] = useState([])
    const LoadingContext = useContext(loadingContext);
    const { setLoading } = LoadingContext;

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
        <TimetableContext.Provider value={{ timetable, setTimetable, fetchTimeTable, deleteTimetable }}>
            {props.children}
        </TimetableContext.Provider>
    )
}

export default TimetableState