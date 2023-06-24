import Footer from '@/components/Layout/Footer'
import Navbar from '@/components/Layout/Navbar'
import AnnouncementState from '@/context/announcement/AnnouncementState'
import FacultyState from '@/context/faculty/FacultyState'
import NoteState from '@/context/notes/NoteState'
import TimetableState from '@/context/timetable/TimetableState'
import LoadingState from '@/context/loading/LoadingState'
import '@/styles/globals.css'
import ImportantlinkState from '@/context/importantLinks/ImportantlinkState'
import AssignmentState from '@/context/assignments/AssignmentState'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <LoadingState>
        <AnnouncementState>
          <NoteState>
            <AssignmentState>
              <FacultyState>
                <TimetableState>
                  <ImportantlinkState>
                    <Component {...pageProps} />
                  </ImportantlinkState>
                </TimetableState>
              </FacultyState>
            </AssignmentState>
          </NoteState>
        </AnnouncementState>
      </LoadingState>
      <Footer />
    </>
  )
}
