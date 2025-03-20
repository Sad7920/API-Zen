const Navbar = () => {
    return (
        <div className="w-full h-full justify-end flex">
            <nav className='w-fit border border-neutral-400 border-dashed hover:border-violet-400 rounded-full mx-auto py-2 px-6 flex items-center '>
                <h1 className=' text-xl antialiased  font-bold font-mono'>API<span className='italic text-sm'>Zen</span></h1>
            </nav>
        </div>
    )
}

export default Navbar