import { Link } from 'react-router-dom'
import {
    CodeBracketIcon,
    EnvelopeIcon,
    MapPinIcon,
    PhoneIcon,
    ArrowUpIcon,
} from '@heroicons/react/24/outline'

const FOOTER_LINKS = {
    Product: [
        { label: 'Home', to: '/' },
        { label: 'About', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'Dashboard', to: '/dashboard' },
    ],
    Hooks: [
        { label: 'useState', to: '/hooks/useState' },
        { label: 'useEffect', to: '/hooks/useEffect' },
        { label: 'useContext', to: '/hooks/useContext' },
        { label: 'useRef', to: '/hooks/useRef' },
        { label: 'useReducer', to: '/hooks/useReducer' },
    ],
    Auth: [
        { label: 'Login', to: '/auth/login' },
        { label: 'Register', to: '/auth/register' },
        { label: 'Forgot Password', to: '/auth/forgot-password' },
        { label: 'Reset Password', to: '/auth/reset-password' },
    ],
}

const SOCIAL_LINKS = [
    {
        label: 'GitHub',
        href: 'https://github.com',
        icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        label: 'Twitter',
        href: 'https://twitter.com',
        icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
        ),
    },
    {
        label: 'LinkedIn',
        href: 'https://linkedin.com',
        icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
]

export default function Footer() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <footer className="bg-[#0a0a0f] border-t border-white/8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

                {/* Top Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 no-underline mb-4 w-fit">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                                <CodeBracketIcon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-bold text-lg">TODO APP<span className="text-violet-400">.</span></span>
                        </Link>
                        <p className="text-white/45 text-sm leading-relaxed mb-6 max-w-xs">
                            A modern Todo App project built with Tailwind CSS, Ant Design, and the best open-source tools. Manage your tasks with ease.
                        </p>

                        {/* Contact info */}
                        <div className="space-y-2.5">
                            {[
                                { icon: <EnvelopeIcon className="w-4 h-4" />, text: 'hello@todoapp.com' },
                                { icon: <PhoneIcon className="w-4 h-4" />, text: '+92 300 1234567' },
                                { icon: <MapPinIcon className="w-4 h-4" />, text: 'Faisalabad, Pakistan' },
                            ].map(item => (
                                <div key={item.text} className="flex items-center gap-2.5 text-white/45 text-sm">
                                    <span className="text-violet-400">{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(FOOTER_LINKS).map(([group, links]) => (
                        <div key={group}>
                            <h4 className="text-white font-semibold text-sm mb-4">{group}</h4>
                            <ul className="space-y-2.5">
                                {links.map(link => (
                                    <li key={link.to}>
                                        <Link to={link.to}
                                            className="text-white/45 text-sm hover:text-violet-400 no-underline transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h4 className="text-white font-semibold text-sm mb-1">Stay updated</h4>
                            <p className="text-white/45 text-xs">Get the latest updates straight to your inbox.</p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="flex-1 sm:w-56 bg-white/6 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                            />
                            <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold hover:opacity-90 transition-all cursor-pointer border-none whitespace-nowrap shadow-lg shadow-violet-500/20">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/8">

                    {/* Copyright */}
                    <p className="text-white/35 text-sm text-center sm:text-left">
                        © {new Date().getFullYear()} <span className="text-violet-400">TODO APP.</span> All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-2">
                        {SOCIAL_LINKS.map(s => (
                            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                                title={s.label}
                                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/45 hover:text-violet-400 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all no-underline">
                                {s.icon}
                            </a>
                        ))}

                        {/* Scroll to top */}
                        <button onClick={scrollToTop}
                            className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 hover:bg-violet-500/25 transition-all cursor-pointer ml-1">
                            <ArrowUpIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Legal */}
                    <div className="flex items-center gap-4">
                        {[
                            { label: 'Privacy', to: '/privacy' },
                            { label: 'Terms', to: '/terms' },
                        ].map(l => (
                            <Link key={l.to} to={l.to} className="text-white/35 text-xs hover:text-white/60 no-underline transition-colors">
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}