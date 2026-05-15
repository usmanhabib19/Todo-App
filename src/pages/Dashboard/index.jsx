import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import Profile from './Profile'

import Header from '../../components/Header'

const DashboardIndex = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </>
    )
}


export default DashboardIndex

