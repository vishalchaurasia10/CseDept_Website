import Image from 'next/image'
import React from 'react'

const Hod = () => {
    return (
        <>
            <div className="hodDetails">
                <div className="image">
                    <Image src="/images/hod.jpeg" alt="HOD" width={200} height={200} />
                </div>
            </div>
        </>
    )
}

export default Hod
