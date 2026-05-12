import React from 'react'
import { Button } from 'antd'
const Hero = () => {
    return (
        <>
            <header>
                <div className="flex flex-wrap w-full justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-semibold text-indigo-500">Todos</h1>
                        <p className="text-gray-500">List of your todos</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="primary">Add Todo</Button>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Hero