import { useContext, useState } from "react";
import NoteContext from "./noteContext";
import { Client, Databases } from "appwrite";
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

    return (
        <NoteContext.Provider value={{ notes, setNotes, fetchNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState