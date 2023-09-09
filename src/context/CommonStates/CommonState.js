import { Client, Databases, Query } from "appwrite";
import CommonContext from "./commonContex";
import { Toaster, toast } from "react-hot-toast";
import { useState } from "react";

const CommonState = (props) => {

    const [subjects, setSubjects] = useState([{ subjectCode: '', subjectName: '' }]);

    const fetchSubjects = async (selectedSemester, selectedCourse) => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const result = await databases.listDocuments(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_SUBJECTS_COLLECTION_ID,
                [Query.equal('semester', selectedSemester), Query.equal('course', selectedCourse)]
            );

            if (result.total === 0) {
                setSubjects([{ subjectCode: '', subjectName: '' }]);
                toast.error('Ask Admin to upload the subjects first');
                return;
            } else {
                setSubjects(JSON.parse(result.documents[0].subjects));
            }
        } catch (error) {
            console.log(error);
            toast.error('Ask Admin to upload the subjects first');
        }
    }

    return (
        <>
            <Toaster />
            <CommonContext.Provider value={{ fetchSubjects, subjects }}>
                {props.children}
            </CommonContext.Provider>
        </>
    )
}

export default CommonState