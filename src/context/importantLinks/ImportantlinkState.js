import { useContext, useState } from "react";
import ImportantlinkContext from "./importantlinkContext";
import { Client, Databases } from "appwrite";
import loadingContext from "../loading/loadingContext";

const ImportantlinkState = (props) => {

    const [importantlink, setImportantlink] = useState([])
    const LoadingContext = useContext(loadingContext);
    const { setLoading } = LoadingContext;

    const fetchImportantlink = async () => {
        try {
            setLoading(true);
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_IMPORTANTLINKS_COLLECTION_ID,);

            setImportantlink(result.documents);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <ImportantlinkContext.Provider value={{ importantlink, setImportantlink, fetchImportantlink }}>
            {props.children}
        </ImportantlinkContext.Provider>
    )
}

export default ImportantlinkState