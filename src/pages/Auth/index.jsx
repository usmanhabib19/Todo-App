import React from 'react'
import NotFound from '../NotFound'
import { Routes, Route } from 'react-router-dom'
const Auth = () => {
    return (
        <>
            <Routes>
                <Route path='login' element={<></>} />
                <Route path='register' element={<></>} />
                <Route path='forgot-password' element={<></>} />
                <Route path='reset-password' element={<></>} />
                <Route path='*' element={< NotFound />} />
            </Routes>
        </>
    )
}

export default Auth