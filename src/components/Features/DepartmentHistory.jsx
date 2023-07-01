import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const DepartmentHistory = () => {
    const [ref, inView] = useInView({
        triggerOnce: true, // Only trigger the animation once
        threshold: 0.3, // Customize the threshold for triggering the animation
    });

    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };
    return (
        <>
            <motion.div
                className="wrapper flex flex-col items-center justify-center lg:px-40 p-6 lg:p-10 bg-[#262626] text-white"
                ref={ref}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={variants}
                transition={{ duration: 0.5 }}>
                <div className="mission overflow-hidden">
                    <div className="vision my-2 flex flex-col items-center justify-center">
                        <h2 className='text-5xl lg:text-7xl mb-4 pt-14 font-jost font-extrabold'>Department History</h2>
                    </div>
                    <VerticalTimeline>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            contentStyle={{ background: '#EC4899', color: '#fff' }}
                            contentArrowStyle={{ borderRight: '7px solid  #EC4899' }}
                            iconStyle={{ background: '#EC4899', color: '#fff' }}
                            date='1984'
                            position='left'>
                            <p className='font-jost text-justify'>
                                The Department of Computer science and Engineering (CSE) was established in the year 1984 to meet the needs of the emerging IT industry and research.
                            </p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            contentStyle={{ background: '#EC4899', color: '#fff' }}
                            contentArrowStyle={{ borderRight: '7px solid  #EC4899' }}
                            iconStyle={{ background: '#EC4899', color: '#fff' }}
                            date='1994'
                            position='right'>
                            <p className='font-jost text-justify'>
                                The department started with an initial intake of 60 students in the UG program in CSE and enhanced its intake to 120 in the year 1994.
                            </p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            contentStyle={{ background: '#EC4899', color: '#fff' }}
                            contentArrowStyle={{ borderRight: '7px solid  #EC4899' }}
                            iconStyle={{ background: '#EC4899', color: '#fff' }}
                            date='1998'
                            position='left'>
                            <p className='font-jost text-justify'>
                                In 1998, the department started a PG program in “Computer Science and Engineering (CSE)” with an intake of 18 students.
                            </p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            contentStyle={{ background: '#EC4899', color: '#fff' }}
                            contentArrowStyle={{ borderRight: '7px solid  #EC4899' }}
                            iconStyle={{ background: '#EC4899', color: '#fff' }}
                            date='Present'
                            position='right'>
                            <p className='font-jost text-justify'>
                                Presently the department has two PG programs in the branch of Computer Science and Engineering and Computer Network Engineering with an in-take of 30 and 18 students respectively.
                            </p>
                        </VerticalTimelineElement>
                    </VerticalTimeline>
                </div>
            </motion.div>
        </>
    );
};

export default DepartmentHistory;

