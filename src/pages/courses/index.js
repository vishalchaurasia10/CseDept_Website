import Semester from '@/components/Content/Courses/Semester'
import Head from 'next/head'
import React from 'react'

const courses = () => {
  return (
    <>
      <Head>
        <title>Courses | CSE</title>
      </Head>
      <Semester />
    </>
  )
}

export default courses
