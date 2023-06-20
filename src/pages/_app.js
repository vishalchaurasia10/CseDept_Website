import Footer from '@/components/Layout/Footer'
import Navbar from '@/components/Layout/Navbar'
import NoteState from '@/context/notes/NoteState'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <NoteState>
        <Component {...pageProps} />
      </NoteState>
      <Footer />
    </>
  )
}
