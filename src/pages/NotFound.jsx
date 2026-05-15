import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-sm max-md:px-4">
            <h1 className="text-8xl md:text-9xl font-bold text-indigo-500">404</h1>
            <div className="h-1 w-16 rounded bg-indigo-500 my-5 md:my-7"></div>
            <p className="text-2xl md:text-3xl font-bold text-black">Page Not Found</p>
            <p className="text-sm md:text-base mt-4 text-black/50 max-w-md text-center">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            <div className="flex items-center gap-4 mt-8">
                <Link to="/" className="bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-3 text-white font-semibold rounded-xl active:scale-95 transition-all no-underline shadow-lg shadow-violet-500/20">
                    Return Home
                </Link>
                <Link to="/contact" className="border border-black/10 px-8 py-3 text-black/60 hover:bg-white/5 rounded-xl active:scale-95 transition-all no-underline">
                    Contact support
                </Link>
            </div>
        </div>
    )
}

export default NotFound
