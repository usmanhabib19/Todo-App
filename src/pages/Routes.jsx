import React from 'react'
import { Router, Routes, Route } from 'react-router-dom'

import Frontend from './Frontend'
import Auth from './Auth'
import Dashboard from './Dashboard'
import NotFound from './NotFound'

const AppRoutes = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/*" element={<Frontend />} />
                    <Route path="/auth/*" element={<Auth />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </>
    )
}

export default AppRoutes