import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Objectives = () => {
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
                        <h2 className='text-5xl lg:text-7xl mb-4 pt-14 font-jost font-extrabold'>Programme Objectives</h2>
                    </div>
                    <VerticalTimeline>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            contentStyle={{ background: '#EC4899', color: '#fff' }}
                            contentArrowStyle={{ borderRight: '7px solid  #EC4899' }}
                            iconStyle={{ background: '#EC4899', color: '#fff' }}
                            position='left'>
                            <p className='font-jost text-justify'>
                                Pursue a successful career in the field of Computer Science & Engineering or a related field utilizing his/her education and contribute to the profession as an excellent employee, or as an entrepreneur
                            </p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            contentStyle={{ background: '#EC4899', color: '#fff' }}
                            contentArrowStyle={{ borderRight: '7px solid  #EC4899' }}
                            iconStyle={{ background: '#EC4899', color: '#fff' }}
                            position='right'>
                            <p className='font-jost text-justify'>
                                Be aware of the developments in the field of Computer Science & Engineering, continuously enhance their knowledge informally or by pursuing graduate studies
                            </p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            contentStyle={{ background: '#EC4899', color: '#fff' }}
                            contentArrowStyle={{ borderRight: '7px solid  #EC4899' }}
                            iconStyle={{ background: '#EC4899', color: '#fff' }}
                            position='left'>
                            <p className='font-jost text-justify'>
                                Be able to work effectively in multidisciplinary environments and be responsible members/leaders of their communities.
                            </p>
                        </VerticalTimelineElement>
                    </VerticalTimeline>
                </div>
            </motion.div>
        </>
    );
};

export default Objectives;

