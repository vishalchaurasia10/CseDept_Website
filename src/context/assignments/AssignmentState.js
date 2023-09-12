import { useContext, useState } from "react";
import AssignmentContext from "./assignmentContext";
import { Client, Databases, ID, Query, Storage } from "appwrite";
import loadingContext from "../loading/loadingContext";
import { Toaster, toast } from "react-hot-toast";

const AssignmentState = (props) => {

    const [assignment, setAssignment] = useState([])
    const LoadingContext = useContext(loadingContext);
    const { setLoading } = LoadingContext;
    const failure = (message) => toast.error(message, { duration: 3000 });

    const uploadAssignmentFile = async (file, assignmentDetails, setAssignmentDetails, selectedCourse, setSelectedCourse, selectedSemester, setSelectedSemester) => {
        try {
            setLoading(true);

            setAssignmentDetails((prevDetails) => ({
                ...prevDetails,
                extension: '.' + file.name.split('.').pop()
            }));

            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
            const storage = new Storage(client);

            const result = await storage.createFile(
                process.env.NEXT_PUBLIC_ASSIGNMENTS_BUCKET_ID,
                ID.unique(),
                file
            );

            const fileId = result.$id;
            const uploadedFile = storage.getFileView(
                process.env.NEXT_PUBLIC_ASSIGNMENTS_BUCKET_ID,
                fileId
            );
            setAssignmentDetails((prevDetails) => ({
                ...prevDetails,
                url: uploadedFile.href,
            }));

            toast.promise(
                Promise.resolve(fileId), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Document successfully uploaded!',
                    error: () => 'Error uploading document.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

            uploadAssignmentDocument(uploadedFile.href, '.' + file.name.split('.').pop(), assignmentDetails, setAssignmentDetails, selectedCourse, setSelectedCourse, selectedSemester, setSelectedSemester);
            setLoading(false);
        } catch (error) {
            failure('Something went wrong');
            setLoading(false);
        }
    };

    const uploadAssignmentDocument = async (url, extension, assignmentDetails, setAssignmentDetails, selectedCourse, setSelectedCourse, selectedSemester, setSelectedSemester) => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const result = await databases.createDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_ASSIGNMENTS_COLLECTION_ID,
                ID.unique(),
                {
                    name: assignmentDetails.name,
                    subject: assignmentDetails.subject,
                    subjectCode: assignmentDetails.subjectCode,
                    semester: selectedSemester,
                    url: url,
                    extension: extension,
                    course: selectedCourse,
                },
            );

            toast.promise(
                Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Assignment successfully uploaded!',
                    error: () => 'Error uploading assignment.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

        } catch (error) {
            failure('Something went wrong');
        }

        setSelectedCourse('');
        setSelectedSemester('');
        setAssignmentDetails({
            name: '',
            subject: '',
            subjectCode: '',
            url: null,
            extension: '',
        });
    };

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
            toast.promise(
                Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Assignment successfully deleted!',
                    error: () => 'Error deleting assignment.',
                    duration: 3000,
                    position: 'top-center',
                }
            );
            fetchAssignment();
            return result;
        } catch (error) {
            toast.error(error.message)
        }
    }


    return (
        <>
            <Toaster />
            <AssignmentContext.Provider value={{ assignment, setAssignment, fetchAssignment, fetchSemestersAssignments, deleteAssignment, uploadAssignmentFile }}>
                {props.children}
            </AssignmentContext.Provider>
        </>
    )
}

export default AssignmentState