import { useState, useEffect, Fragment } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Menu, Transition } from '@headlessui/react'
import { animate, stagger } from 'animejs'
import { Bars3Icon, XMarkIcon, ChevronDownIcon, UserCircleIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon, ClipboardDocumentListIcon, HomeIcon, InformationCircleIcon, PhoneIcon, CodeBracketIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../context/Auth'

// ─── Nav Links ───────────────────────────────────────────────
// public = everyone, private = only logged in
const NAV_LINKS = [
    { label: 'Home', to: '/', icon: <HomeIcon className="w-4 h-4" />, private: false },
    // { label: 'About', to: '/about', icon: <InformationCircleIcon className="w-4 h-4" />, private: false },
    { label: 'Todos', to: '/todos', icon: <CheckCircleIcon className="w-4 h-4" />, private: true },
    // { label: 'Contact', to: '/contact', icon: <PhoneIcon className="w-4 h-4" />, private: false },
]

const HOOK_LINKS = [
    // { label: 'useState', to: '/hooks/useState' },
    // { label: 'useEffect', to: '/hooks/useEffect' },
    // { label: 'useContext', to: '/hooks/useContext' },
    // { label: 'useRef', to: '/hooks/useRef' },
    // { label: 'useReducer', to: '/hooks/useReducer' },
]

export default function Navbar() {
    const { isAuth, user, dispatch } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    // Close mobile menu on route change
    useEffect(() => { setMobileOpen(false) }, [location.pathname])

    // Scroll glass effect
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Entrance animation
    useEffect(() => {
        animate('.nav-ani', {
            opacity: [0, 1], y: [-10, 0],
            delay: stagger(60, { start: 150 }),
            duration: 500, ease: 'outExpo',
        })
    }, [])

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' })
        localStorage.removeItem('user')
        toast.success('Logout successful')
        navigate('/')
    }

    // If private link clicked while not logged in → redirect to login
    const handlePrivateClick = (e, link) => {
        if (link.private && !isAuth) {
            e.preventDefault()
            toast.error('Please login to access this page')
            navigate('/auth/login', { state: { from: link.to } })
        }
    }

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#ffff]/85 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/20' : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">

                        {/* ── Logo ── */}
                        <Link to="/" className="flex items-center gap-2 no-underline group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-violet-500/25 group-hover:scale-105 transition-transform">
                                <CodeBracketIcon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-Purple font-bold text-lg">TODO APP<span className="text-violet-400">.</span></span>
                        </Link>

                        {/* ── Desktop Links ── */}
                        <div className="hidden md:flex items-center gap-1">
                            {NAV_LINKS.map(link => (
                                <NavLink
                                    key={link.to}
                                    to={link.private && !isAuth ? '#' : link.to}
                                    onClick={(e) => handlePrivateClick(e, link)}
                                    className={({ isActive }) =>
                                        `nav-ani flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all no-underline relative ${link.private && !isAuth
                                            ? 'text-black/30 cursor-pointer'
                                            : isActive
                                                ? 'bg-violet-500/15 text-violet-400'
                                                : 'text-black/60 hover:text-blue hover:bg-white/8'
                                        }`
                                    }
                                >
                                    {link.icon}
                                    {link.label}
                                    {/* Lock icon for private links when not logged in */}
                                    {link.private && !isAuth && (
                                        <LockClosedIcon className="w-3 h-3 text-black/25" />
                                    )}
                                </NavLink>
                            ))}

                            {/* Hooks Dropdown */}
                            <Menu as="div" className="relative nav-ani">
                                {/* <Menu.Button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-black/60 hover:text-blue hover:bg-white/8 transition-all cursor-pointer border-none bg-transparent">
                                    <ClipboardDocumentListIcon className="w-4 h-4" />
                                    Hooks <ChevronDownIcon className="w-3.5 h-3.5" />
                                </Menu.Button> */}
                                <Transition as={Fragment}
                                    enter="transition ease-out duration-150" enterFrom="opacity-0 scale-95 -translate-y-1" enterTo="opacity-100 scale-100 translate-y-0"
                                    leave="transition ease-in duration-100" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                    <Menu.Items className="absolute top-full left-0 mt-2 w-44 bg-[#12121f]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl outline-none">
                                        {/* {HOOK_LINKS.map(h => (
                                            <Menu.Item key={h.to}>
                                                {({ active }) => (
                                                    <Link to={h.to} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm no-underline transition-colors ${active ? 'bg-violet-500/15 text-violet-400' : 'text-white/60'}`}>
                                                        <CodeBracketIcon className="w-3.5 h-3.5" /> {h.label}
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        ))} */}
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>

                        {/* ── Right Side ── */}
                        <div className="hidden md:flex items-center gap-2">
                            {isAuth && user ? (
                                /* ── User Dropdown ── */
                                <Menu as="div" className="relative">
                                    <Menu.Button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-black/80 text-sm font-medium max-w-24 truncate">{user.name}</span>
                                        <ChevronDownIcon className="w-3.5 h-3.5 text-black/40" />
                                    </Menu.Button>

                                    <Transition as={Fragment}
                                        enter="transition ease-out duration-150" enterFrom="opacity-0 scale-95 -translate-y-1" enterTo="opacity-100 scale-100 translate-y-0"
                                        leave="transition ease-in duration-100" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                        <Menu.Items className="absolute top-full right-0 mt-2 w-56 bg-[#12121f]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl outline-none">

                                            {/* User Info */}
                                            <div className="px-3 py-3 border-b border-white/8 mb-1">
                                                <div className="flex items-center gap-2.5 mb-1">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                                                        <p className="text-white/40 text-xs truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                                <span className="inline-flex items-center gap-1 text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full">
                                                    ✦ Logged in
                                                </span>
                                            </div>

                                            {/* Menu Items */}
                                            {[
                                                { label: 'My Profile', to: '/dashboard/profile', icon: <UserCircleIcon className="w-4 h-4" /> },
                                                { label: 'My Todos', to: '/todos', icon: <CheckCircleIcon className="w-4 h-4" /> },
                                                { label: 'Dashboard', to: '/dashboard', icon: <ClipboardDocumentListIcon className="w-4 h-4" /> },
                                                { label: 'Settings', to: '/settings', icon: <Cog6ToothIcon className="w-4 h-4" /> },
                                            ].map(item => (
                                                <Menu.Item key={item.to}>
                                                    {({ active }) => (
                                                        <Link to={item.to} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm no-underline transition-colors ${active ? 'bg-violet-500/15 text-violet-400' : 'text-white/60'}`}>
                                                            {item.icon} {item.label}
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            ))}

                                            {/* Logout */}
                                            <div className="border-t border-white/8 mt-1 pt-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button onClick={handleLogout} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm cursor-pointer border-none text-left transition-colors ${active ? 'bg-red-500/15 text-red-400' : 'text-white/60 bg-transparent'}`}>
                                                            <ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            ) : (
                                /* ── Auth Buttons ── */
                                <div className="flex items-center gap-2 nav-ani">
                                    <Link to="/auth/login" className="px-4 py-2 rounded-xl text-sm font-medium text-black/70 hover:text-blue hover:bg-white/8 transition-all no-underline">
                                        Login
                                    </Link>
                                    <Link to="/auth/register" className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 hover:-translate-y-0.5 transition-all no-underline shadow-lg shadow-violet-500/20">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* ── Mobile Toggle ── */}
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white/70 hover:text-white cursor-pointer bg-transparent border-none p-1">
                            {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* ── Mobile Menu ── */}
                <Transition show={mobileOpen}
                    enter="transition ease-out duration-200" enterFrom="opacity-0 -translate-y-2" enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 -translate-y-2">
                    <div className="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/8 px-4 pb-5 pt-2">

                        {/* Nav links */}
                        <div className="space-y-1 mb-4">
                            {NAV_LINKS.map(link => (
                                <NavLink
                                    key={link.to}
                                    to={link.private && !isAuth ? '#' : link.to}
                                    onClick={(e) => {
                                        if (link.private && !isAuth) {
                                            e.preventDefault()
                                            setMobileOpen(false)
                                            window.toastify('Please login to access this page', 'error')
                                            navigate('/auth/login', { state: { from: link.to } })
                                        }
                                    }}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium no-underline transition-colors ${link.private && !isAuth
                                            ? 'text-black/30'
                                            : isActive
                                                ? 'bg-violet-500/15 text-violet-400'
                                                : 'text-white/60 hover:text-white hover:bg-white/8'
                                        }`
                                    }
                                >
                                    {link.icon} {link.label}
                                    {link.private && !isAuth && <LockClosedIcon className="w-3 h-3 ml-auto" />}
                                </NavLink>
                            ))}

                            {/* Hooks */}
                            <div className="px-3 pt-3 pb-1">
                                <p className="text-black/30 text-xs font-semibold uppercase tracking-wider mb-2">Hooks</p>
                                <div className="grid grid-cols-2 gap-1">
                                    {HOOK_LINKS.map(h => (
                                        <Link key={h.to} to={h.to} className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs text-white/55 hover:text-white hover:bg-white/8 no-underline transition-colors">
                                            <CodeBracketIcon className="w-3.5 h-3.5" /> {h.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Auth section */}
                        <div className="border-t border-white/8 pt-4">
                            {isAuth && user ? (
                                <div className="space-y-1">
                                    {/* User card */}
                                    <div className="flex items-center gap-3 px-3 py-2.5 bg-white/3 rounded-xl mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                                            <p className="text-white/40 text-xs truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    {[
                                        { label: 'My Profile', to: '/dashboard/profile', icon: <UserCircleIcon className="w-4 h-4" /> },
                                        { label: 'My Todos', to: '/todos', icon: <CheckCircleIcon className="w-4 h-4" /> },
                                        { label: 'Dashboard', to: '/dashboard', icon: <ClipboardDocumentListIcon className="w-4 h-4" /> },
                                        { label: 'Settings', to: '/settings', icon: <Cog6ToothIcon className="w-4 h-4" /> },
                                    ].map(item => (
                                        <Link key={item.to} to={item.to}
                                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/8 no-underline transition-colors">
                                            {item.icon} {item.label}
                                        </Link>
                                    ))}

                                    <button onClick={handleLogout}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 cursor-pointer border-none bg-transparent transition-colors">
                                        <ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {/* Restriction notice */}
                                    <div className="flex items-center gap-2 px-3 py-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-1">
                                        <LockClosedIcon className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                        <p className="text-yellow-400 text-xs">Login to access Todos & Profile</p>
                                    </div>
                                    <Link to="/auth/login" className="text-center py-2.5 rounded-xl text-sm font-medium text-white/70 border border-white/10 hover:bg-white/8 no-underline transition-all">
                                        Login
                                    </Link>
                                    <Link to="/auth/register" className="text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 no-underline transition-all">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </Transition>
            </nav>

            {/* Spacer */}
            <div className="h-16" />
        </>
    )
}