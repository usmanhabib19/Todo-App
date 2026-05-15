import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Frontend from './Frontend'
import Auth from './Auth'
import DashboardIndex from './Dashboard'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth/*" element={<Auth />} />
            <Route path="/dashboard/*" element={<DashboardIndex />} />
            <Route path="/*" element={<Frontend />} />
        </Routes>

    )
}

export default AppRoutes