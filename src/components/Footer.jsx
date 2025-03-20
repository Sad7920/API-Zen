import React from 'react'

const Footer = () => {
    return (
        <div className="w-full flex">
            <footer className='w-fit border border-neutral-400 border-dashed hover:border-violet-400  rounded-full mx-auto py-2 px-6 flex items-center '>
                <h1 className=' text-sm antialiased font-bold font-mono'>Made with ❤️ by <a href='https://sad.codes' className=' hover:underline'>sad.codes</a></h1>
            </footer>
        </div>
    )
}

export default Footer