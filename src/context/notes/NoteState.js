import { useContext, useState } from "react";
import NoteContext from "./noteContext";
import { Client, Databases, Query } from "appwrite";
import loadingContext from "../loading/loadingContext";

const NoteState = (props) => {

    const [notes, setNotes] = useState([])
    const LoadingContext = useContext(loadingContext);
    const { setLoading } = LoadingContext;

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID,);

            setNotes(result.documents);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchSemestersNotes = async (semester, subjectCode, unit) => {
        try {
            setLoading(true);
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            let query1, result;

            if (semester === -1 && subjectCode === -1 && unit === -1) {

                result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID,);

            } else if (subjectCode === -1 && unit === -1) {

                query1 = Query.equal('semester', `${semester}`)
                result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID, [query1]);

            } else if (subjectCode !== -1 && unit === -1) {

                result = await databases.listDocuments(
                    process.env.NEXT_PUBLIC_DATABASE_ID,
                    process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID,
                    [
                        Query.equal('subjectCode', [`${subjectCode}`])
                    ]);

            }

            setNotes(result.documents);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <NoteContext.Provider value={{ notes, setNotes, fetchNotes, fetchSemestersNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState