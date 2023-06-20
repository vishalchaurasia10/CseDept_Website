import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const Vision = () => {
    return (
        <>
            <div className="wrapper flex flex-col items-center justify-center lg:px-40 p-6 lg:p-10 bg-[#262626] text-white">
                <div className="vision my-2 flex flex-col items-center justify-center">
                    <h2 className='text-5xl lg:text-7xl mb-4 font-jost font-extrabold'>Vision</h2>
                    <p className='text-xl text-center lg:text-4xl mt-4 font-jost'>To build a strong learning and research environment in the field of Computer Science and Engineering that promotes innovation towards the betterment of society.</p>
                </div>
                <div className='w-[80%] h-1 my-10 bg-pink-500 mx-auto'></div>
                <div className="mission overflow-hidden">
                    <div className="vision my-2 flex flex-col items-center justify-center">
                        <h2 className='text-5xl lg:text-7xl mb-4 font-jost font-extrabold'>Mission</h2>
                    </div>
                    <VerticalTimeline>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            contentStyle={{ background: '#EC4899', color: '#fff' }}
                            contentArrowStyle={{ borderRight: '7px solid  #EC4899' }}
                            iconStyle={{ background: '#EC4899', color: '#fff' }}
                            position='left'>
                            <p className='font-jost text-justify'>
                                To produce Computer Science graduates who, trained in design and implementation of computational systems through competitive curriculum and research in collaboration with industry and research organizations.
                            </p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            contentStyle={{ background: '#EC4899', color: '#fff' }}
                            contentArrowStyle={{ borderRight: '7px solid  #EC4899' }}
                            iconStyle={{ background: '#EC4899', color: '#fff' }}
                            position='right'>
                            <p className='font-jost text-justify'>
                                To educate students in technology competencies by providing professionally committed faculty and staff with leading infrastructure and tools.
                            </p>
                        </VerticalTimelineElement>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            contentStyle={{ background: '#EC4899', color: '#fff' }}
                            contentArrowStyle={{ borderRight: '7px solid  #EC4899' }}
                            iconStyle={{ background: '#EC4899', color: '#fff' }}
                            position='left'>
                            <p className='font-jost text-justify'>
                                To inculcate strong ethical values, leadership abilities and research capabilities in the minds of students so as to work towards the progress of the society.
                            </p>
                        </VerticalTimelineElement>
                    </VerticalTimeline>
                </div>
            </div>
        </>
    );
};

export default Vision;

