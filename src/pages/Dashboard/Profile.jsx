import { useState } from 'react'
import { useAuth } from '../../context/Auth'
import { toast } from 'react-toastify'
import { UserCircleIcon, EnvelopeIcon, ShieldCheckIcon, PencilSquareIcon, CameraIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const Profile = () => {
    const { user, dispatch } = useAuth()
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleUpdateProfile = (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Get all users
            const users = JSON.parse(localStorage.getItem('users') || '[]')
            
            // Find current user in the list
            const userIndex = users.findIndex(u => u.email === user.email)
            
            if (userIndex === -1) {
                toast.error('User not found')
                setLoading(false)
                return
            }

            // Update user info
            const updatedUser = { ...users[userIndex], name: form.name }
            users[userIndex] = updatedUser

            // Save back to localStorage
            localStorage.setItem('users', JSON.stringify(users))
            
            // Update context
            dispatch({ type: 'SET_PROFILE', payload: updatedUser })
            
            toast.success('Profile updated successfully!')
            setIsEditing(false)
        } catch (err) {
            toast.error('Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassword = (e) => {
        e.preventDefault()
        if (form.newPassword !== form.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]')
            const userIndex = users.findIndex(u => u.email === user.email)

            if (users[userIndex].password !== form.currentPassword) {
                toast.error('Incorrect current password')
                setLoading(false)
                return
            }

            users[userIndex].password = form.newPassword
            localStorage.setItem('users', JSON.stringify(users))
            
            toast.success('Password changed successfully!')
            setForm({ ...form, currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (err) {
            toast.error('Failed to change password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-8 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Account Settings</h1>
                    <p className="text-white/45 text-sm mt-1">Manage your profile and account security</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Left Column: Avatar & Quick Info */}
                    <div className="space-y-6">
                        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 backdrop-blur-xl text-center">
                            <div className="relative inline-block mb-4">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-violet-500/20">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-2 bg-violet-500 rounded-xl border border-white/20 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                                    <CameraIcon className="w-4 h-4 text-white" />
                                </button>
                            </div>
                            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
                            <p className="text-white/40 text-xs mb-4">{user?.email}</p>
                            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30 px-3 py-1 rounded-full">
                                <ShieldCheckIcon className="w-3 h-3" /> Verified Account
                            </span>
                        </div>

                        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 backdrop-blur-xl">
                            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Account Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/50 text-sm">Member Since</span>
                                    <span className="text-white/80 text-sm">May 2024</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/50 text-sm">Last Active</span>
                                    <span className="text-white/80 text-sm">Today</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="md:col-span-2 space-y-8">
                        
                        {/* Profile Info Form */}
                        <div className="bg-white/4 border border-white/8 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <UserCircleIcon className="w-5 h-5 text-violet-400" /> Basic Information
                                </h3>
                                {!isEditing && (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors cursor-pointer bg-transparent border-none"
                                    >
                                        <PencilSquareIcon className="w-4 h-4" /> Edit Profile
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-white/60 text-xs font-medium mb-1.5">Full Name</label>
                                        <div className="relative">
                                            <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                            <input 
                                                type="text" 
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full bg-white/6 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-xs font-medium mb-1.5">Email Address</label>
                                        <div className="relative">
                                            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                            <input 
                                                type="email" 
                                                value={form.email}
                                                disabled
                                                className="w-full bg-white/6 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm opacity-50 cursor-not-allowed" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex gap-3 pt-2">
                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 text-white font-semibold px-6 py-2 rounded-xl transition-all cursor-pointer border-none text-sm shadow-lg shadow-violet-500/20"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => { setIsEditing(false); setForm({ ...form, name: user.name }) }}
                                            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 font-semibold px-6 py-2 rounded-xl transition-all cursor-pointer text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Security Form */}
                        <div className="bg-white/4 border border-white/8 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                                <LockClosedIcon className="w-5 h-5 text-red-400" /> Password & Security
                            </h3>

                            <form onSubmit={handleChangePassword} className="space-y-5">
                                <div>
                                    <label className="block text-white/60 text-xs font-medium mb-1.5">Current Password</label>
                                    <input 
                                        type="password" 
                                        name="currentPassword"
                                        value={form.currentPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-white/6 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-white/20" 
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-white/60 text-xs font-medium mb-1.5">New Password</label>
                                        <input 
                                            type="password" 
                                            name="newPassword"
                                            value={form.newPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            required
                                            className="w-full bg-white/6 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-white/20" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/60 text-xs font-medium mb-1.5">Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            name="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            required
                                            className="w-full bg-white/6 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-white/20" 
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold px-6 py-2.5 rounded-xl transition-all cursor-pointer text-sm"
                                >
                                    {loading ? 'Changing...' : 'Update Password'}
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
