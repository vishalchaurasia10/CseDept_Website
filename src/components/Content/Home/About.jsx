import React from 'react'
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {

    const [ref, inView] = useInView({
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
                className="about px-5 text-justify lg:px-40 py-10 lg:py-16"
                ref={ref}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={variants}
                transition={{ duration: 0.5 }}>
                <h1 className='text-7xl font-jost font-extrabold'>About</h1>
                <p className='text-xl mt-5 lg:mt-8 font-jost'>The Department of Computer science and Engineering (CSE) has fifteen faculty with the doctorate degree and 14 perusing the doctoral studies. The faculty have been publishing in referred journals and in conference proceedings. The department also conducts vocational courses and proficiency courses on fundamental and new programming languages and computer science concepts. These courses are conducted beyond college hours/summer semester by the faculty of the department. Some of the faculty are involved in institutional level activities and actively involved in interdisciplinary research activities. The department has state of the art laboratories like SAP, IBM Centre of Excellence and Cuda learning center. Technical seminars, workshops and hackathons are conducted regularly for UG & PG students. The department encourages the students to conduct and participate in extra-curricular/sports activities. The alumni network is very active and regular meeting are conducted by the department. The department is accredited by Nation Board of Accreditation (NBA) for the period of 3 years. The department has MoUs with leading IT Industries like NVIDIA, SAP, IBM and HP. The department conducts subjects with more of hands-on sessions and encourages students to take up MOOC based online courses in NPTEL, IITBombayX, Coursera, Udacity and edX.</p>
                <div className="buttons flex flex-wrap mt-2 lg:mt-6">
                    {
                        ['Outcomes', 'Objectives', 'Department History'].map((item, index) => (
                            <button key={index} className='bg-pink-500 font-jost hover:shadow-2xl shadow-black transition-all duration-300 hover:scale-105 text-white font-bold py-2 px-4 rounded-lg mt-2 mr-2 lg:mt-0 lg:my-5 '>{item}</button>
                        ))
                    }
                </div>
            </motion.div>
        </>
    )
}

export default About
