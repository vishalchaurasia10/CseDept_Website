import Image from 'next/image';
import React from 'react';

const Industry = () => {
    return (
        <>
            <div className="industryPartners overflow-hidden px-4 lg:px-40 my-10">
                <h2 className='text-5xl lg:text-7xl font-jost font-extrabold'>Industry Partners</h2>
                <p className='text-xl mt-5 mb-8 lg:mb-14 lg:mt-8 font-jost'>The department has MoUs with leading IT companies who have partnered with us to provide state of the art laboratories and learning centres.</p>
                <div className="slider flex space-x-10 items-center justify-center animate-scrolling">
                    <Image
                        className='w-48'
                        src="/images/industry/sap.png"
                        alt="Industry"
                        width={1920}
                        height={1080}
                    />
                    <Image
                        className='w-36'
                        src="/images/industry/hp.png"
                        alt="Industry"
                        width={1920}
                        height={1080}
                    />
                    <Image
                        className='w-48'
                        src="/images/industry/apple.webp"
                        alt="Industry"
                        width={1920}
                        height={1080}
                    />
                    <Image
                        className='w-36'
                        src="/images/industry/ibm.svg"
                        alt="Industry"
                        width={1920}
                        height={1080}
                    />
                    <Image
                        className='w-48'
                        src="/images/industry/nvidia.jpg"
                        alt="Industry"
                        width={1920}
                        height={1080}
                    />
                    <Image
                        className='w-48'
                        src="/images/industry/samsung.webp"
                        alt="Industry"
                        width={1920}
                        height={1080}
                    />
                    <Image
                        className='w-48'
                        src="/images/industry/intel.png"
                        alt="Industry"
                        width={1920}
                        height={1080}
                    />
                </div>
            </div>
        </>
    );
};

export default Industry;
