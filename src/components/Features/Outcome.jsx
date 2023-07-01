import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Outcomes = () => {
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
                        <h2 className='text-5xl lg:text-7xl mb-4 pt-14 font-jost font-extrabold'>Programme Outcome</h2>
                    </div>
                    <VerticalTimeline>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            contentStyle={{ background: '#EC4899', color: '#fff' }}
                            contentArrowStyle={{ borderRight: '7px solid  #EC4899' }}
                            iconStyle={{ background: '#EC4899', color: '#fff' }}
                            position='left'>
                            <p className='font-jost text-justify'>
                                Understand the principles, architecture and organization of computers, embedded systems and computer networks
                            </p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            contentStyle={{ background: '#EC4899', color: '#fff' }}
                            contentArrowStyle={{ borderRight: '7px solid  #EC4899' }}
                            iconStyle={{ background: '#EC4899', color: '#fff' }}
                            position='right'>
                            <p className='font-jost text-justify'>
                                Apply mathematical foundations, algorithmic principles, and computer science theory in the modelling and design of computer-based systems that include both hardware and software
                            </p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            contentStyle={{ background: '#EC4899', color: '#fff' }}
                            contentArrowStyle={{ borderRight: '7px solid  #EC4899' }}
                            iconStyle={{ background: '#EC4899', color: '#fff' }}
                            position='left'>
                            <p className='font-jost text-justify'>
                                Apply software design and development practices to develop software applications in emerging areas such as IoT, Data Analytics, Social Networks, Cloud and High Performance Computing
                            </p>
                        </VerticalTimelineElement>
                    </VerticalTimeline>
                </div>
            </motion.div>
        </>
    );
};

export default Outcomes;

