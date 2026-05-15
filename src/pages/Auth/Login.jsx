import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Tooltip } from 'antd'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../context/Auth'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const Login = () => {
    const navigate = useNavigate()
    const { dispatch } = useAuth()

    const [form, setForm] = useState({ email: '', password: '' })
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.email || !form.password) {
            toast.error('Please fill all fields')
            return
        }

        setLoading(true)
        try {
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]')

            // Find user
            const user = users.find(u => u.email === form.email && u.password === form.password)

            if (!user) {
                toast.error('Invalid email or password')
                setLoading(false)
                return
            }

            // Log the user in
            dispatch({ type: 'SET_LOGIN', payload: user })
            
            toast.success('Login successful!')
            navigate('/')
        } catch (err) {
            toast.error('Login failed')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4 relative overflow-hidden">

            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl" />
            </div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-md bg-white/4 border border-white/8 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-2xl text-violet-400" style={{ display: 'inline-block', animation: 'spin 6s linear infinite' }}>✦</span>
                    <span className="text-xl font-bold tracking-widest bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                        TODO APP
                    </span>
                </div>

                {/* Heading */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
                    <p className="text-white/45 text-sm">Sign in to your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email */}
                    <div>
                        <label className="block text-white/60 text-xs font-medium mb-1.5">Email Address</label>
                        <div className="relative flex items-center">
                            <EnvelopeIcon className="absolute left-3 w-4 h-4 text-white/30 pointer-events-none" />
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/6 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/8 focus:ring-2 focus:ring-violet-500/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-white/60 text-xs font-medium">Password</label>
                            <Link to="/auth/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors no-underline">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative flex items-center">
                            <LockClosedIcon className="absolute left-3 w-4 h-4 text-white/30 pointer-events-none" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/6 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/8 focus:ring-2 focus:ring-violet-500/20 transition-all"
                            />
                            <Tooltip title={showPass ? 'Hide password' : 'Show password'}>
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 text-white/30 hover:text-white/60 transition-colors cursor-pointer bg-transparent border-none p-0"
                                >
                                    {showPass ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 rounded border-white/20 bg-white/5 accent-violet-500 cursor-pointer"
                        />
                        <label htmlFor="remember" className="text-white/50 text-xs cursor-pointer">
                            Remember me for 30 days
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer border-none mt-2 shadow-lg shadow-violet-500/20"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In <ArrowRightIcon className="w-4 h-4" />
                            </>
                        )}
                    </button>

                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-white/8" />
                    <span className="text-white/30 text-xs">or</span>
                    <div className="flex-1 h-px bg-white/8" />
                </div>

                {/* Register link */}
                <p className="text-center text-white/40 text-sm">
                    Don't have an account?{' '}
                    <Link to="/auth/register" className="text-violet-400 font-medium hover:text-violet-300 transition-colors no-underline">
                        Create account
                    </Link>
                </p>

            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default Login