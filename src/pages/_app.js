import Footer from '@/components/Layout/Footer'
import Navbar from '@/components/Layout/Navbar'
import AnnouncementState from '@/context/announcement/AnnouncementState'
import FacultyState from '@/context/faculty/FacultyState'
import NoteState from '@/context/notes/NoteState'
import TimetableState from '@/context/timetable/TimetableState'
import LoadingState from '@/context/loading/LoadingState'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <LoadingState>
        <AnnouncementState>
          <NoteState>
            <FacultyState>
              <TimetableState>
                <Component {...pageProps} />
              </TimetableState>
            </FacultyState>
          </NoteState>
        </AnnouncementState>
      </LoadingState>
      <Footer />
    </>
  )
}
