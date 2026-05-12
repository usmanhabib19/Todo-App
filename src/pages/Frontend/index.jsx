import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import NotFound from '../NotFound'
import Todos from './Todos'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const Frontend = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="" element={<Home />} />
                <Route path="/todos" element={<Todos />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </>
    )
}

export default Frontend