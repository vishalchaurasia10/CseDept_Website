import { useState } from "react";
import FacultyContext from "./facultyContext";
import { Client, Databases } from "appwrite";

const FacultyState = (props) => {

    const [faculty, setFaculty] = useState([])

    const fetchFaculty = async () => {
        try {
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_FACULTY_COLLECTION_ID,);

            setFaculty(result.documents);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <FacultyContext.Provider value={{ faculty, setFaculty, fetchFaculty }}>
            {props.children}
        </FacultyContext.Provider>
    )
}

export default FacultyState