import ForgotPassword from '@/components/authentication/ForgotPassword'
import Head from 'next/head'
import React from 'react'

const forgotpassword = () => {
    return (
        <>
            <Head>
                <title>Forgot Password | CSE</title>
            </Head>
            <ForgotPassword />
        </>
    )
}

export default forgotpassword