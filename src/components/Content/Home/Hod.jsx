import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Hod = () => {

    const [ref2, inView2] = useInView({
        triggerOnce: true, // Only trigger the animation once
        threshold: 0.5, // Customize the threshold for triggering the animation
    });

    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <>
            <motion.div
                className="hodDetails px-5 lg:px-40 pt-6 pb-16 flex flex-col lg:flex-row items-center justify-center"
                ref={ref2}
                initial="hidden"
                animate={inView2 ? 'visible' : 'hidden'}
                variants={variants}
                transition={{ duration: 0.5 }}
            >
                <div className="image lg:w-1/4 mb-6 lg:mb-0 lg:mr-16">
                    <Image className='w-full rounded-full shadow-2xl shadow-black' src="/images/hod.jpeg" alt="HOD" width={200} height={200} />
                </div>
                <div className="details lg:w-3/4">
                    <h2 className='text-5xl lg:text-7xl font-jost font-extrabold'>Dr. Annapurna Patil</h2>
                    <h3 className='text-xl text-justify lg:text-2xl mt-4 font-jost font-extrabold'>Head of the Department, Computer Science & Engineering</h3>
                    <p className='text-xl mt-5 text-justify lg:mt-8 font-jost'>Dr. Annapurna P. Patil received her Ph.D. in Computer Science and Engineering from VTU in 2014. She has published many research papers in International Conferences and Journals. She is a member of Indian Society of Technical Education (ISTE), IEEE (Computer Society) and CCICI-NIST. She has guided many M.Tech students and is guiding PhD scholars. She is serving the institution from past 20+ years. She is also a IEEE Student Branch Counsellor. Dr. Annapurna P Patil has a wide experience in teaching engineering students both in UG and in PG. She has guided many projects in UG and PG. Her areas of interest include Wireless Networks, Artificial Intelligence, Protocol Engineering, Cloud Computing and IOT, Data Structures and Analysis of Algorithms.</p>
                </div>
            </motion.div>
            {/* <span className='h-[0.1rem] ml-4 w-full mx-auto lg:w-[60%] mt-3 bg-black block'></span> */}
        </>
    )
}

export default Hod
