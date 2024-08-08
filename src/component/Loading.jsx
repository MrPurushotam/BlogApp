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

export default Loader
