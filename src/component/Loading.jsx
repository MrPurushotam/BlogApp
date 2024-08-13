import React from 'react'

const Loader = () => {
    return (

        <div className=' w-full h-full select-none flex justify-center items-center absolute bg-opacity-30 bg-purple-200 backdrop-blur-xs'>
            <div className="spinner z-10 opacity-100">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export const SimpleLoader = () => {
    return (
        <>
        <div className="flex items-center justify-center">
            <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
                <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span
                >
            </div>
        </div>
        </>
    )
}

export default Loader
