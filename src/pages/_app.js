import Footer from '@/components/Layout/Footer'
import Navbar from '@/components/Layout/Navbar'
import FacultyState from '@/context/faculty/FacultyState'
import NoteState from '@/context/notes/NoteState'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <NoteState>
        <FacultyState>
          <Component {...pageProps} />
        </FacultyState>
      </NoteState>
      <Footer />
    </>
  )
}
