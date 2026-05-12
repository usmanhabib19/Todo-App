import React from 'react'
import { Routes, Route } from 'react-router-dom'


import NotFound from '../NotFound'
import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'


const Auth = () => {
    return (
        <>
            <Routes>
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
                <Route path='forgot-password' element={<ForgotPassword />} />
                <Route path='reset-password' element={<ResetPassword />} />
                <Route path='*' element={< NotFound />} />
            </Routes>
        </>
    )
}

export default Auth