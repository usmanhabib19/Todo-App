import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Tooltip } from 'antd'
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../context/Auth'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const getStrength = (pass) => {
    if (!pass) return null
    if (pass.length < 6) return { label: 'Weak', bars: 1, color: 'bg-red-500', text: 'text-red-400' }
    if (pass.length < 10) return { label: 'Medium', bars: 2, color: 'bg-yellow-500', text: 'text-yellow-400' }
    if (pass.length < 14) return { label: 'Strong', bars: 3, color: 'bg-green-500', text: 'text-green-400' }
    return { label: 'Very Strong', bars: 4, color: 'bg-violet-500', text: 'text-violet-400' }
}

const REQUIREMENTS = [
    { label: 'At least 6 characters', test: (p) => p.length >= 6 },
    { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { label: 'One number', test: (p) => /[0-9]/.test(p) },
]

const Register = () => {
    const navigate = useNavigate()
    const { dispatch } = useAuth()

    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [agreed, setAgreed] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const strength = getStrength(form.password)
    const passwordMatch = form.confirmPassword && form.password === form.confirmPassword

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            toast.error('Please fill all fields')
            return
        }
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }
        if (!agreed) {
            toast.error('Please agree to terms & conditions')
            return
        }

        setLoading(true)
        try {
            // Get existing users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]')

            // Check if email already exists
            if (users.find(u => u.email === form.email)) {
                toast.error('Email already registered')
                setLoading(false)
                return
            }

            // Create new user object
            const newUser = {
                id: Date.now(), // Generate a simple ID
                name: form.name,
                email: form.email,
                password: form.password // In a real app, never store plain text passwords!
            }

            // Save to users list
            users.push(newUser)
            localStorage.setItem('users', JSON.stringify(users))

            // Log the user in
            dispatch({ type: 'SET_LOGIN', payload: newUser })
            
            toast.success('Account created successfully!')
            navigate('/')
        } catch (err) {
            toast.error('Registration failed')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4 py-8 relative overflow-hidden">

            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl" />
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
                    <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
                    <p className="text-white/45 text-sm">Join us today, it's free!</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Full Name */}
                    <div>
                        <label className="block text-white/60 text-xs font-medium mb-1.5">Full Name</label>
                        <div className="relative flex items-center">
                            <UserIcon className="absolute left-3 w-4 h-4 text-white/30 pointer-events-none" />
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/6 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/8 focus:ring-2 focus:ring-violet-500/20 transition-all"
                            />
                        </div>
                    </div>

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
                        <label className="block text-white/60 text-xs font-medium mb-1.5">Password</label>
                        <div className="relative flex items-center">
                            <LockClosedIcon className="absolute left-3 w-4 h-4 text-white/30 pointer-events-none" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                name="password"
                                placeholder="Create a strong password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/6 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/8 focus:ring-2 focus:ring-violet-500/20 transition-all"
                            />
                            <Tooltip title={showPass ? 'Hide' : 'Show'}>
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 text-white/30 hover:text-white/60 transition-colors cursor-pointer bg-transparent border-none p-0">
                                    {showPass ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                            </Tooltip>
                        </div>

                        {/* Strength bar */}
                        {strength && (
                            <div className="mt-2 space-y-1.5">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map(b => (
                                        <div key={b} className={`h-1 flex-1 rounded-full transition-all duration-300 ${b <= strength.bars ? strength.color : 'bg-white/10'}`} />
                                    ))}
                                </div>
                                <p className={`text-xs ${strength.text}`}>{strength.label}</p>
                            </div>
                        )}

                        {/* Requirements */}
                        {form.password && (
                            <div className="mt-2 space-y-1">
                                {REQUIREMENTS.map(req => (
                                    <div key={req.label} className="flex items-center gap-1.5">
                                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${req.test(form.password) ? 'bg-green-500' : 'bg-white/10'}`}>
                                            {req.test(form.password) && <CheckIcon className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        <span className={`text-xs ${req.test(form.password) ? 'text-green-400' : 'text-white/30'}`}>{req.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-white/60 text-xs font-medium mb-1.5">Confirm Password</label>
                        <div className="relative flex items-center">
                            <LockClosedIcon className="absolute left-3 w-4 h-4 text-white/30 pointer-events-none" />
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Repeat your password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                className={`w-full bg-white/6 border rounded-xl py-3 pl-10 pr-10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 transition-all ${form.confirmPassword
                                    ? passwordMatch
                                        ? 'border-green-500/50 focus:border-green-500/60 focus:ring-green-500/20'
                                        : 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20'
                                    : 'border-white/10 focus:border-violet-500/60 focus:ring-violet-500/20'
                                    }`}
                            />
                            <Tooltip title={showConfirm ? 'Hide' : 'Show'}>
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 text-white/30 hover:text-white/60 transition-colors cursor-pointer bg-transparent border-none p-0">
                                    {showConfirm ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                            </Tooltip>
                        </div>
                        {form.confirmPassword && (
                            <p className={`text-xs mt-1 ${passwordMatch ? 'text-green-400' : 'text-red-400'}`}>
                                {passwordMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                            </p>
                        )}
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreed}
                            onChange={e => setAgreed(e.target.checked)}
                            className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 accent-violet-500 cursor-pointer flex-shrink-0"
                        />
                        <label htmlFor="terms" className="text-white/45 text-xs cursor-pointer leading-relaxed">
                            I agree to the{' '}
                            <Link to="/terms" className="text-violet-400 hover:text-violet-300 no-underline">Terms of Service</Link>
                            {' '}and{' '}
                            <Link to="/privacy" className="text-violet-400 hover:text-violet-300 no-underline">Privacy Policy</Link>
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
                                Creating account...
                            </>
                        ) : (
                            <>
                                Create Account <ArrowRightIcon className="w-4 h-4" />
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

                {/* Login link */}
                <p className="text-center text-white/40 text-sm">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="text-violet-400 font-medium hover:text-violet-300 transition-colors no-underline">
                        Sign in
                    </Link>
                </p>

            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default Register