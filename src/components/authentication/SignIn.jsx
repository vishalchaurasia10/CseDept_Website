import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import { Client, Account, Databases, Query } from "appwrite";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import roleContext from '@/context/role/roleContext';

const SignIn = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const router = useRouter()
  const RoleContext = useContext(roleContext)
  const { role, setRole } = RoleContext

  const onChangeHandler = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
      const account = new Account(client);

      await account.createEmailSession(credentials.email, credentials.password);

      const response = await account.get();

      if (response.emailVerification === false) {
        toast.error('Please verify your email first')
      } else {
        setRole({ name: response.name, email: response.email, status: response.emailVerification, })
        decideRole(response.$id)

        router.push('/adminPanel')
        toast.success('Logged in successfully')
      }

      setCredentials({ email: '', password: '' })

    } catch (error) {
      toast.error(error.message)
    }
  }

  const decideRole = async (id) => {
    try {
      const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);
      const databases = new Databases(client);

      const response = await databases.listDocuments(process.env.NEXT_PUBLIC_DATABASE_ID, process.env.NEXT_PUBLIC_USERS_COLLECTION_ID, [Query.search('id', id)]
      );


      if (response.documents[0].role === 'admin') {
        setRole((prevRole) => ({ ...prevRole, role: 'admin' }));
      } else if (response.documents[0].role === 'faculty') {
        setRole((prevRole) => ({ ...prevRole, role: 'faculty' }));
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkValidity = (e) => {
    e.preventDefault()
    if (credentials.email === '' || credentials.password === '') {
      toast.error('Please fill all the fields')
    } else if (credentials.email.indexOf('@') === -1) {
      toast.error('Please enter a valid email')
    } else if (credentials.password.length < 8) {
      toast.error('Password must be atleast 8 characters long')
    }
    else {
      handleSubmit(e)
    }
  }

  useEffect(() => {
    if (role.role === 'admin' || role.role === 'faculty') {
      router.push('/adminPanel')
    }
  }, [])

  return (
    <>
      <Toaster />
      <div className={`wrapper transition-all px-5 lg:px-0 duration-300 h-screen font-jost bg-gray-200 flex justify-center items-center`}>
        {/* <div className="content px-4 lg:px-0 lg:order-1 w-full lg:w-1/2 py-3 flex justify-center items-center"> */}
        <div className="content w-full md:w-1/2 lg:w-[27%] border bg-pureWhite border-gray-300 p-6 rounded-2xl shadow-2xl shadow-black">
          <div className="heading py-4">
            <h1 className='bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 text-2xl font-jost'>Sign in</h1>
            <h3>to continue as admin/faculty</h3>
          </div>
          <form className='form flex w-full flex-col'>
            <div className="email flex items-center mb-2 px-2 py-1 border-2 border-gray-300 rounded-xl">
              <FaEnvelope className='text-gray-500 pl-1' />
              <input onChange={onChangeHandler} className='text-base w-full pl-4 p-2 outline-none text-gray-500 bg-pureWhite ' placeholder='Enter your email' value={credentials.email} type="email" name="email" id="email" />
            </div>
            <div className="password flex items-center mb-2 px-2 py-1 border-2 border-gray-300 rounded-xl">
              <FaLock className='text-gray-500 pl-1' />
              <input onChange={onChangeHandler} className='text-base w-full pl-4 p-2 outline-none text-gray-500 bg-pureWhite ' placeholder='Enter the password' value={credentials.password} type="password" name="password" id="password" />
            </div>
            <div className="forgotPassword flex items-center space-x-1 justify-center text-sm">
              <Link href='/forgotPassword' className='text-[#FE538D]'>Forgot Password?</Link>
            </div>
            <button onClick={checkValidity} className='py-2 my-5 w-1/2 mx-auto hover:-translate-y-[0.1rem] text-white  bg-[#FE538D] duration-150 font-jost font-semibold border rounded-md px-3 hover:shadow-2xl shadow-black border-[rgba(255,255,255,0.1)]'>Sign In</button>
          </form>
          <div className='horizontalRule mx-auto h-[0.1rem] relative mb-4 w-[30%] bg-[#FE538D]'></div>
          <div className="login flex items-center space-x-1 justify-center text-sm">
            <span>No account?</span> <Link href='/sign-up' className='text-[#FE538D]'>Sign Up</Link>
          </div>
        </div>


      </div>
    </>
  )
}

export default SignIn
