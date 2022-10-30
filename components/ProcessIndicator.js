import React from 'react'

export default function ProcessIndicator() {
    return (
        <div className='h-screen top-0 left-0 fixed bg-opacity-10 bg-white flex flex-col justify-center items-center w-full'>
            <div className="spinner">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p className='font-thin'>Please wait while we upload data. This may take some time. Thanks</p>
        </div>
    )
}
