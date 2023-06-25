import TimeTable from '@/components/Content/Timetable/TimeTable'
import Head from 'next/head'
import React from 'react'

const timetable = () => {
    return (
        <>
            <Head>
                <title>Time Table | CSE</title>
            </Head>
            <TimeTable />
        </>
    )
}

export default timetable
