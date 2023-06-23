import Footer from '@/components/Layout/Footer'
import Navbar from '@/components/Layout/Navbar'
import FacultyState from '@/context/faculty/FacultyState'
import NoteState from '@/context/notes/NoteState'
import TimetableState from '@/context/timetable/TimetableState'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <NoteState>
        <FacultyState>
          <TimetableState>
            <Component {...pageProps} />
          </TimetableState>
        </FacultyState>
      </NoteState>
      <Footer />
    </>
  )
}
