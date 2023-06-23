import { useState } from "react";
import TimetableContext from "./timetableContext";
import { Client, Databases } from "appwrite";

const TimetableState = (props) => {

    const [timetable, setTimetable] = useState([])

    const fetchTimeTable = async () => {
        try {
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_TIMETABLE_COLLECTION_ID,);

            setTimetable(result.documents);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <TimetableContext.Provider value={{ timetable, setTimetable , fetchTimeTable }}>
            {props.children}
        </TimetableContext.Provider>
    )
}

export default TimetableState