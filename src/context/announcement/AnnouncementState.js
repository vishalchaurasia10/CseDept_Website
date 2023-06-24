import { useState } from "react";
import AnnouncementContext from "./announcementContext";
import { Client, Databases } from "appwrite";

const AnnouncementState = (props) => {

    const [announcements, setAnnouncement] = useState([])

    const fetchAnnouncements = async () => {
        try {
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_ANNOUNCEMENTS_COLLECTION_ID,);

            setAnnouncement(result.documents);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <AnnouncementContext.Provider value={{ announcements, setAnnouncement , fetchAnnouncements }}>
            {props.children}
        </AnnouncementContext.Provider>
    )
}

export default AnnouncementState