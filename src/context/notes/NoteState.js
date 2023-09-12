import { useContext, useState } from "react";
import NoteContext from "./noteContext";
import { Client, Databases, ID, Query, Storage } from "appwrite";
import loadingContext from "../loading/loadingContext";
import { Toaster, toast } from "react-hot-toast";

const NoteState = (props) => {

    const [notes, setNotes] = useState([])
    const LoadingContext = useContext(loadingContext);
    const { setLoading } = LoadingContext;
    const failure = (message) => toast.error(message, { duration: 3000 });

    const uploadNoteFile = async (file, notesDetails, setNotesDetails, selectedCourse, setSelectedCourse, selectedSemester, setSelectedSemester) => {
        try {
            setLoading(true);

            setNotesDetails((prevDetails) => ({
                ...prevDetails,
                extension: '.' + file.name.split('.').pop()
            }));

            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
            const storage = new Storage(client);

            const result = await storage.createFile(
                process.env.NEXT_PUBLIC_NOTES_BUCKET_ID,
                ID.unique(),
                file
            );

            const fileId = result.$id;
            const uploadedFile = storage.getFileView(
                process.env.NEXT_PUBLIC_NOTES_BUCKET_ID,
                fileId
            );

            toast.promise(
                Promise.resolve(fileId), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Document successfully uploaded!',
                    error: () => 'Error uploading document.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

            setNotesDetails((prevDetails) => ({
                ...prevDetails,
                url: uploadedFile.href,
            }));

            uploadNoteDocument(uploadedFile.href, '.' + file.name.split('.').pop(), notesDetails, setNotesDetails, selectedCourse, setSelectedCourse, selectedSemester, setSelectedSemester);
            setLoading(false);
        } catch (error) {
            failure(error.message);
            setLoading(false);
        }
    }

    const uploadNoteDocument = async (url, extension, notesDetails, setNotesDetails, selectedCourse, setSelectedCourse, selectedSemester, setSelectedSemester) => {
        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

            const databases = new Databases(client);

            const result = await databases.createDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID,
                ID.unique(),
                {
                    name: notesDetails.name,
                    subject: notesDetails.subject,
                    subjectCode: notesDetails.subjectCode,
                    unit: notesDetails.unit,
                    semester: selectedSemester,
                    url: url,
                    extension: extension,
                    course: selectedCourse
                },
            );

            toast.promise(
                Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Notes successfully uploaded!',
                    error: () => 'Error uploading notes.',
                    duration: 3000,
                    position: 'top-center',
                }
            );

        } catch (error) {
            failure('Something went wrong');
        }

        setSelectedCourse('');
        setSelectedSemester('');
        setNotesDetails({
            name: '',
            subject: '',
            subjectCode: '',
            unit: '',
            url: null,
            extension: ''
        });
    }

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

    const deleteFile = async (fileId) => {
        try {
            const client = new Client();
            const storage = new Storage(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            await storage.deleteFile(process.env.NEXT_PUBLIC_NOTES_BUCKET_ID, fileId);

        } catch (error) {
            console.log(error);
        }
    }

    const deleteNote = async (id, fileId) => {
        try {
            const client = new Client();
            const databases = new Databases(client);
            client
                .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
                .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID

            const result = await databases.deleteDocument(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_NOTES_COLLECTION_ID, id);

            await deleteFile(fileId);
            toast.promise(
                Promise.resolve(result), // Use `Promise.resolve` to create a resolved promise with the fileId
                {
                    success: () => 'Note successfully deleted!',
                    error: () => 'Error deleting note.',
                    duration: 3000,
                    position: 'top-center',
                }
            );
            fetchNotes();
            return result;
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <Toaster />
            <NoteContext.Provider value={{ notes, setNotes, fetchNotes, fetchSemestersNotes, deleteNote, uploadNoteFile }}>
                {props.children}
            </NoteContext.Provider>
        </>
    )
}

export default NoteState