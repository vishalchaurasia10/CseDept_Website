import Announcement from '@/components/Content/Announcement/Announcement'
import Head from 'next/head'
import React from 'react'

const announcements = () => {
  return (
    <>
      <Head>
        <title>Announcements | CSE</title>
      </Head>
      <Announcement />
    </>
  )
}

export default announcements
