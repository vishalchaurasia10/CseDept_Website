import { useContext, useState } from "react";
import AssignmentContext from "./assignmentContext";
import { Client, Databases, Query, Storage } from "appwrite";
import loadingContext from "../loading/loadingContext";

const AssignmentState = (props) => {

    const [assignment, setAssignment] = useState([])
    const LoadingContext = useContext(loadingContext);
    const { setLoading } = LoadingContext;

    const fetchAssignment = async () => {
        try {
            setLoading(true);
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_ASSIGNMENTS_COLLECTION_ID,);

            setAssignment(result.documents);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchSemestersAssignments = async (semester, subjectCode) => {
        try {
            setLoading(true);
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            let query1, query2, result;

            if (subjectCode === -1) {

                query1 = Query.equal('semester', `${semester}`)
                result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_ASSIGNMENTS_COLLECTION_ID, [query1]);

            } else if (subjectCode !== -1) {

                query2 = Query.equal('subjectCode', `${subjectCode}`)
                result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_ASSIGNMENTS_COLLECTION_ID, [query2]);

            }

            // const result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_ASSIGNMENTS_COLLECTION_ID, [query]);

            setAssignment(result.documents);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteFile = async (fielId) => {
        try {
            const client = new Client();
            const storage = new Storage(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            await storage.deleteFile(process.env.NEXT_PUBLIC_ASSIGNMENTS_BUCKET_ID, fielId);

            return result;
        } catch (error) {
            console.log(error);
        }
    }

    const deleteAssignment = async (id, fileId) => {
        try {
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.deleteDocument(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_ASSIGNMENTS_COLLECTION_ID, id);

            await deleteFile(fileId);
            fetchAssignment();
            return result;
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <AssignmentContext.Provider value={{ assignment, setAssignment, fetchAssignment, fetchSemestersAssignments, deleteAssignment }}>
            {props.children}
        </AssignmentContext.Provider>
    )
}

export default AssignmentState