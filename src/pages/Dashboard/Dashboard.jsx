import { useState, useEffect, useRef, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Tooltip } from 'antd'
import { animate, stagger } from 'animejs'
import { UserCircleIcon, MapPinIcon, CalendarDaysIcon, LockClosedIcon, GlobeAltIcon, PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon, FunnelIcon, ChevronUpDownIcon, XMarkIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, EyeIcon, ShieldCheckIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid'

// ─── Constants ───────────────────────────────────────────────
const STORAGE_KEY = 'profile_tasks_v1'

const STATUS_OPTIONS = ['All', 'Completed', 'Incomplete']
const PRIVACY_OPTIONS = ['Public', 'Private', 'Only Me']

const STATUS_STYLES = {
    Completed: 'bg-green-500/15 text-green-400 border border-green-500/30',
    Incomplete: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
}
const STATUS_ICONS = {
    Completed: <CheckSolid className="w-3.5 h-3.5" />,
    Incomplete: <ClockIcon className="w-3.5 h-3.5" />,
}
const PRIVACY_STYLES = {
    Public: 'bg-blue-500/15 text-blue-400',
    Private: 'bg-red-500/15 text-red-400',
    'Only Me': 'bg-gray-500/15 text-gray-400',
}
const PRIVACY_ICONS = {
    Public: <GlobeAltIcon className="w-3.5 h-3.5" />,
    Private: <LockClosedIcon className="w-3.5 h-3.5" />,
    'Only Me': <ShieldCheckIcon className="w-3.5 h-3.5" />,
}

const EMPTY_FORM = {
    title: '', description: '', location: '',
    dueDate: '', status: 'Incomplete', privacy: 'Public',
}

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2)
const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
const fmtDT = (iso) => iso ? new Date(iso).toLocaleString('en-PK', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
const isOverdue = (t) => t.dueDate && t.status !== 'Completed' && new Date(t.dueDate) < new Date()

// ─── Fake logged-in user ──────────────────────────────────────
const CURRENT_USER = { name: 'Usman Habib', avatar: 'UH', role: 'Admin' }

// ─── Component ───────────────────────────────────────────────
export default function ProfileDashboard() {
    const [tasks, setTasks] = useState([])
    const [filter, setFilter] = useState('All')
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('createdAt')
    const [showModal, setShowModal] = useState(false)
    const [editId, setEditId] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [viewTask, setViewTask] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const statsRef = useRef(null)
    const rowsRef = useRef(null)

    // Load
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        setTasks(stored)
    }, [])

    // Animate stats
    useEffect(() => {
        if (statsRef.current) {
            animate([...statsRef.current.children], {
                opacity: [0, 1], y: [24, 0],
                delay: stagger(70), duration: 500, ease: 'outExpo',
            })
        }
    }, [])

    // Animate rows
    useEffect(() => {
        if (rowsRef.current) {
            animate([...rowsRef.current.children], {
                opacity: [0, 1], x: [-12, 0],
                delay: stagger(35), duration: 350, ease: 'outExpo',
            })
        }
    }, [filter, search, sortBy, tasks.length])

    const save = (updated) => {
        setTasks(updated)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }

    // Stats
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        incomplete: tasks.filter(t => t.status === 'Incomplete').length,
        overdue: tasks.filter(t => isOverdue(t)).length,
    }
    const pct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0

    // Filtered
    const filtered = tasks
        .filter(t => filter === 'All' || t.status === filter)
        .filter(t =>
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            (t.description || '').toLowerCase().includes(search.toLowerCase()) ||
            (t.location || '').toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt)
            if (sortBy === 'dueDate') return new Date(a.dueDate || 0) - new Date(b.dueDate || 0)
            if (sortBy === 'title') return a.title.localeCompare(b.title)
            if (sortBy === 'status') return a.status.localeCompare(b.status)
            return 0
        })

    // Modal helpers
    const openAdd = () => { setEditId(null); setForm(EMPTY_FORM); setShowModal(true) }
    const openEdit = (task) => {
        setEditId(task.id)
        setForm({ title: task.title, description: task.description || '', location: task.location || '', dueDate: task.dueDate || '', status: task.status, privacy: task.privacy || 'Public' })
        setShowModal(true)
    }

    const handleSave = () => {
        if (!form.title.trim()) return
        const now = new Date().toISOString()
        if (editId) {
            save(tasks.map(t => t.id === editId ? { ...t, ...form, updatedAt: now } : t))
        } else {
            save([{ id: genId(), ...form, createdAt: now, updatedAt: now, createdBy: CURRENT_USER.name }, ...tasks])
        }
        setShowModal(false)
    }

    const handleDelete = () => { save(tasks.filter(t => t.id !== deleteId)); setDeleteId(null) }

    const toggleStatus = (id) => {
        save(tasks.map(t => t.id !== id ? t : {
            ...t, status: t.status === 'Completed' ? 'Incomplete' : 'Completed',
            updatedAt: new Date().toISOString(),
        }))
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-8">
            <div className="max-w-7xl mx-auto">

                {/* ── Profile Header ── */}
                <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-500/20 flex-shrink-0">
                        {CURRENT_USER.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-xl font-bold text-white">{CURRENT_USER.name}</h1>
                        <span className="inline-flex items-center gap-1 text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2.5 py-0.5 rounded-full mt-1">
                            <ShieldCheckIcon className="w-3 h-3" /> {CURRENT_USER.role}
                        </span>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3">
                            {[
                                { label: 'Total Tasks', value: stats.total },
                                { label: 'Completed', value: stats.completed },
                                { label: 'Incomplete', value: stats.incomplete },
                                { label: 'Overdue', value: stats.overdue },
                            ].map(s => (
                                <div key={s.label} className="text-center">
                                    <div className="text-lg font-bold text-white">{s.value}</div>
                                    <div className="text-xs text-white/40">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add button */}
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 text-white font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer border-none text-sm shadow-lg shadow-violet-500/20 flex-shrink-0"
                    >
                        <PlusIcon className="w-4 h-4" /> Add Task
                    </button>
                </div>

                {/* ── Stats Cards ── */}
                <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total', value: stats.total, icon: <ClipboardDocumentListIcon className="w-5 h-5" />, grad: 'from-violet-500/20 to-indigo-500/20', border: 'border-violet-500/20', text: 'text-violet-400' },
                        { label: 'Completed', value: stats.completed, icon: <CheckCircleIcon className="w-5 h-5" />, grad: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/20', text: 'text-green-400' },
                        { label: 'Incomplete', value: stats.incomplete, icon: <ClockIcon className="w-5 h-5" />, grad: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/20', text: 'text-yellow-400' },
                        { label: 'Overdue', value: stats.overdue, icon: <ExclamationTriangleIcon className="w-5 h-5" />, grad: 'from-red-500/20 to-rose-500/20', border: 'border-red-500/20', text: 'text-red-400' },
                    ].map(s => (
                        <div key={s.label} className={`bg-gradient-to-br ${s.grad} border ${s.border} rounded-2xl p-4`}>
                            <div className={`${s.text} mb-2`}>{s.icon}</div>
                            <div className="text-2xl font-bold text-white">{s.value}</div>
                            <div className="text-white/45 text-xs mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Progress ── */}
                {stats.total > 0 && (
                    <div className="bg-white/3 border border-white/8 rounded-2xl p-4 mb-6">
                        <div className="flex justify-between text-xs text-white/50 mb-2">
                            <span>Task Completion</span>
                            <span className="text-violet-400 font-semibold">{pct}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-700"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* ── Filters ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Search by title, description, location..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                        />
                    </div>

                    {/* Sort */}
                    <div className="relative">
                        <ChevronUpDownIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white/70 text-sm focus:outline-none focus:border-violet-500/50 cursor-pointer appearance-none"
                        >
                            <option value="createdAt" className="bg-[#0a0a0f]">Sort: Created At</option>
                            <option value="dueDate" className="bg-[#0a0a0f]">Sort: Due Date</option>
                            <option value="title" className="bg-[#0a0a0f]">Sort: Title</option>
                            <option value="status" className="bg-[#0a0a0f]">Sort: Status</option>
                        </select>
                    </div>

                    {/* Status filter */}
                    <div className="flex gap-1.5 flex-wrap">
                        {STATUS_OPTIONS.map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border-none ${filter === s ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20' : 'bg-white/5 text-white/50 hover:bg-white/10'
                                    }`}
                            >
                                <FunnelIcon className="w-3 h-3" /> {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Table ── */}
                {filtered.length === 0 ? (
                    <div className="text-center py-24 text-white/25">
                        <ClipboardDocumentListIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p className="text-base font-medium">No tasks found</p>
                        <p className="text-sm mt-1">Add a new task to get started</p>
                    </div>
                ) : (
                    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-x-auto">
                        {/* Head */}
                        <div className="grid gap-3 px-5 py-3 bg-white/5 border-b border-white/8 text-white/40 text-xs font-semibold uppercase tracking-wider min-w-[900px]"
                            style={{ gridTemplateColumns: '2rem 1fr 1fr 6rem 6rem 7rem 9rem 7rem 6rem' }}>
                            <div>#</div>
                            <div>Title</div>
                            <div>Description</div>
                            <div>Location</div>
                            <div>Status</div>
                            <div>Privacy</div>
                            <div>Due Date</div>
                            <div>Created At</div>
                            <div>Actions</div>
                        </div>

                        {/* Rows */}
                        <div ref={rowsRef}>
                            {filtered.map((task, i) => (
                                <div
                                    key={task.id}
                                    className={`grid gap-3 px-5 py-4 border-b border-white/5 hover:bg-white/3 transition-colors items-center min-w-[900px] ${isOverdue(task) ? 'border-l-2 border-l-red-500' : ''}`}
                                    style={{ gridTemplateColumns: '2rem 1fr 1fr 6rem 6rem 7rem 9rem 7rem 6rem' }}
                                >
                                    {/* # */}
                                    <div className="text-white/25 text-xs">{i + 1}</div>

                                    {/* Title */}
                                    <div>
                                        <p className={`text-sm font-medium truncate ${task.status === 'Completed' ? 'line-through text-white/30' : 'text-white'}`}>
                                            {task.title}
                                        </p>
                                        <p className="text-xs text-white/35 mt-0.5">
                                            By <span className="text-violet-400">{task.createdBy || CURRENT_USER.name}</span>
                                        </p>
                                        {isOverdue(task) && (
                                            <span className="flex items-center gap-1 text-xs text-red-400 mt-0.5">
                                                <ExclamationTriangleIcon className="w-3 h-3" /> Overdue
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        {task.description ? (
                                            <Tooltip title={task.description}>
                                                <p className="text-xs text-white/40 truncate cursor-default">{task.description}</p>
                                            </Tooltip>
                                        ) : <span className="text-white/20 text-xs">—</span>}
                                    </div>

                                    {/* Location */}
                                    <div>
                                        {task.location ? (
                                            <span className="flex items-center gap-1 text-xs text-white/50 truncate">
                                                <MapPinIcon className="w-3 h-3 flex-shrink-0 text-violet-400" /> {task.location}
                                            </span>
                                        ) : <span className="text-white/20 text-xs">—</span>}
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <Tooltip title="Click to toggle">
                                            <button
                                                onClick={() => toggleStatus(task.id)}
                                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium cursor-pointer border-none hover:opacity-75 transition-all ${STATUS_STYLES[task.status]}`}
                                            >
                                                {STATUS_ICONS[task.status]} {task.status}
                                            </button>
                                        </Tooltip>
                                    </div>

                                    {/* Privacy */}
                                    <div>
                                        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium w-fit ${PRIVACY_STYLES[task.privacy || 'Public']}`}>
                                            {PRIVACY_ICONS[task.privacy || 'Public']} {task.privacy || 'Public'}
                                        </span>
                                    </div>

                                    {/* Due Date */}
                                    <div className="text-xs text-white/45 flex items-center gap-1">
                                        <CalendarDaysIcon className="w-3.5 h-3.5 text-white/25" />
                                        {fmtDate(task.dueDate)}
                                    </div>

                                    {/* Created At */}
                                    <div className="text-xs text-white/35">{fmtDT(task.createdAt)}</div>

                                    {/* Actions */}
                                    <div className="flex gap-1.5">
                                        <Tooltip title="View">
                                            <button onClick={() => setViewTask(task)}
                                                className="text-violet-400 hover:text-violet-300 cursor-pointer bg-transparent border-none p-1.5 hover:bg-violet-500/10 rounded-lg transition-all">
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="Edit">
                                            <button onClick={() => openEdit(task)}
                                                className="text-blue-400 hover:text-blue-300 cursor-pointer bg-transparent border-none p-1.5 hover:bg-blue-500/10 rounded-lg transition-all">
                                                <PencilSquareIcon className="w-4 h-4" />
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <button onClick={() => setDeleteId(task.id)}
                                                className="text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none p-1.5 hover:bg-red-500/10 rounded-lg transition-all">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Add / Edit Modal ── */}
            <Transition appear show={showModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setShowModal(false)}>
                    <Transition.Child as={Fragment}
                        enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child as={Fragment}
                                enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                                leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-lg bg-[#12121f] border border-white/10 rounded-2xl p-6 shadow-2xl">

                                    <div className="flex items-center justify-between mb-6">
                                        <Dialog.Title className="text-lg font-semibold text-white">
                                            {editId ? '✏️ Edit Task' : '➕ Add Task'}
                                        </Dialog.Title>
                                        <button onClick={() => setShowModal(false)}
                                            className="text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-none">
                                            <XMarkIcon className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Title */}
                                        <div>
                                            <label className="block text-white/60 text-xs font-medium mb-1.5">Title *</label>
                                            <input type="text" placeholder="Enter title..." value={form.title}
                                                onChange={e => setForm({ ...form, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-white/60 text-xs font-medium mb-1.5">Description</label>
                                            <textarea placeholder="Enter description..." value={form.description}
                                                onChange={e => setForm({ ...form, description: e.target.value })}
                                                rows={3}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none" />
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <label className="block text-white/60 text-xs font-medium mb-1.5">Location</label>
                                            <div className="relative flex items-center">
                                                <MapPinIcon className="absolute left-3 w-4 h-4 text-white/30 pointer-events-none" />
                                                <input type="text" placeholder="e.g. Lahore, Pakistan" value={form.location}
                                                    onChange={e => setForm({ ...form, location: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                                            </div>
                                        </div>

                                        {/* Due Date */}
                                        <div>
                                            <label className="block text-white/60 text-xs font-medium mb-1.5">Due Date</label>
                                            <div className="relative flex items-center">
                                                <CalendarDaysIcon className="absolute left-3 w-4 h-4 text-white/30 pointer-events-none" />
                                                <input type="date" value={form.dueDate}
                                                    onChange={e => setForm({ ...form, dueDate: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                                            </div>
                                        </div>

                                        {/* Status + Privacy */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-white/60 text-xs font-medium mb-1.5">Status</label>
                                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 cursor-pointer">
                                                    <option className="bg-[#12121f]">Incomplete</option>
                                                    <option className="bg-[#12121f]">Completed</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-white/60 text-xs font-medium mb-1.5">Privacy</label>
                                                <select value={form.privacy} onChange={e => setForm({ ...form, privacy: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 cursor-pointer">
                                                    {PRIVACY_OPTIONS.map(p => <option key={p} className="bg-[#12121f]">{p}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button onClick={() => setShowModal(false)}
                                            className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all cursor-pointer">
                                            Cancel
                                        </button>
                                        <button onClick={handleSave} disabled={!form.title.trim()}
                                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-sm hover:opacity-90 transition-all cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed">
                                            {editId ? 'Update Task' : 'Add Task'}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* ── View Modal ── */}
            <Transition appear show={!!viewTask} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setViewTask(null)}>
                    <Transition.Child as={Fragment}
                        enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child as={Fragment}
                            enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-md bg-[#12121f] border border-white/10 rounded-2xl p-6 shadow-2xl">
                                {viewTask && (
                                    <>
                                        <div className="flex items-start justify-between mb-5">
                                            <Dialog.Title className="text-lg font-bold text-white pr-4">{viewTask.title}</Dialog.Title>
                                            <button onClick={() => setViewTask(null)}
                                                className="text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-none flex-shrink-0">
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Badges */}
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[viewTask.status]}`}>
                                                    {STATUS_ICONS[viewTask.status]} {viewTask.status}
                                                </span>
                                                <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${PRIVACY_STYLES[viewTask.privacy || 'Public']}`}>
                                                    {PRIVACY_ICONS[viewTask.privacy || 'Public']} {viewTask.privacy || 'Public'}
                                                </span>
                                                {isOverdue(viewTask) && (
                                                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-red-500/15 text-red-400 border border-red-500/30">
                                                        <ExclamationTriangleIcon className="w-3.5 h-3.5" /> Overdue
                                                    </span>
                                                )}
                                            </div>

                                            {/* Fields */}
                                            {[
                                                { label: 'Description', value: viewTask.description, icon: <ClipboardDocumentListIcon className="w-4 h-4" /> },
                                                { label: 'Location', value: viewTask.location, icon: <MapPinIcon className="w-4 h-4" /> },
                                            ].map(f => f.value && (
                                                <div key={f.label} className="flex gap-3">
                                                    <div className="text-violet-400 mt-0.5 flex-shrink-0">{f.icon}</div>
                                                    <div>
                                                        <p className="text-xs text-white/40 mb-0.5">{f.label}</p>
                                                        <p className="text-sm text-white/80">{f.value}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/8">
                                                {[
                                                    { label: 'Due Date', value: fmtDate(viewTask.dueDate) },
                                                    { label: 'Created By', value: viewTask.createdBy || CURRENT_USER.name },
                                                    { label: 'Created At', value: fmtDT(viewTask.createdAt) },
                                                    { label: 'Updated At', value: fmtDT(viewTask.updatedAt) },
                                                ].map(f => (
                                                    <div key={f.label}>
                                                        <p className="text-xs text-white/35 mb-0.5">{f.label}</p>
                                                        <p className="text-sm text-white/70">{f.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mt-6">
                                            <button onClick={() => { setViewTask(null); openEdit(viewTask) }}
                                                className="flex-1 py-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 text-sm hover:bg-blue-500/25 transition-all cursor-pointer flex items-center justify-center gap-2">
                                                <PencilSquareIcon className="w-4 h-4" /> Edit
                                            </button>
                                            <button onClick={() => setViewTask(null)}
                                                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all cursor-pointer">
                                                Close
                                            </button>
                                        </div>
                                    </>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>

            {/* ── Delete Modal ── */}
            <Transition appear show={!!deleteId} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setDeleteId(null)}>
                    <Transition.Child as={Fragment}
                        enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child as={Fragment}
                            enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-sm bg-[#12121f] border border-white/10 rounded-2xl p-6 shadow-2xl text-center">
                                <div className="w-12 h-12 bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrashIcon className="w-6 h-6 text-red-400" />
                                </div>
                                <Dialog.Title className="text-white font-semibold text-lg mb-2">Delete Task?</Dialog.Title>
                                <p className="text-white/40 text-sm mb-6">This action cannot be undone.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setDeleteId(null)}
                                        className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-all cursor-pointer">
                                        Cancel
                                    </button>
                                    <button onClick={handleDelete}
                                        className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all cursor-pointer border-none">
                                        Delete
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}