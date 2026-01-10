import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Check,
    Clock,
    AlertCircle,
    Trash2,
    ChevronRight,
    Circle,
    CheckCircle2,
    Loader2,
    Flag,
    Calendar,
    Folder,
    FolderPlus,
    Tag,
    Layers,
    MoreHorizontal
} from 'lucide-react';
import { taskService } from '../../../services/taskService';
import { useEcosystemPoints } from '../../../hooks/useEcosystemPoints';

const priorityColors = {
    low: 'text-muted-foreground bg-muted',
    medium: 'text-blue-600 bg-blue-500/10',
    high: 'text-orange-600 bg-orange-500/10',
    urgent: 'text-red-600 bg-red-500/10'
};

const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
};

const projectColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6', '#14B8A6'
];

const TaskItem = ({ task, onToggle, onDelete, projects }) => {
    const isDone = task.status === 'done';
    const project = projects.find(p => p.id === task.project_id);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`flex items-center gap-4 p-4 bg-card rounded-2xl border transition-all group ${isDone ? 'border-green-500/20 bg-green-500/5' : 'border-border hover:border-border/80 shadow-sm'
                }`}
        >
            <button
                onClick={() => onToggle(task)}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDone
                    ? 'bg-green-500 text-white'
                    : 'border-2 border-border hover:border-green-500 hover:bg-green-500/10'
                    }`}
            >
                {isDone && <Check className="w-4 h-4" />}
            </button>

            <div className="flex-grow">
                <p className={`font-bold ${isDone ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {task.title}
                </p>
                {task.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
                )}
                {project && (
                    <div className="flex items-center gap-1.5 mt-2">
                        <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: project.color }}
                        />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{project.title}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${priorityColors[task.priority]}`}>
                    {priorityLabels[task.priority]}
                </span>
                <button
                    onClick={() => onDelete(task.id)}
                    className="p-2 text-muted-foreground/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState('');
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState('all');
    const [targetProjectId, setTargetProjectId] = useState('none');
    const [priority, setPriority] = useState('medium');
    const [filter, setFilter] = useState('all');
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });

    const { awardPoints } = useEcosystemPoints();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        await Promise.all([loadTasks(), loadProjects(), loadStats()]);
        setLoading(false);
    };

    const loadTasks = async () => {
        try {
            const data = await taskService.getAll();
            setTasks(data);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    };

    const loadProjects = async () => {
        try {
            const data = await taskService.getAllProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    const loadStats = async () => {
        const data = await taskService.getStats();
        setStats(data);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const task = await taskService.create({
                title: newTask,
                priority: priority,
                projectId: targetProjectId === 'none' ? null : targetProjectId
            });
            setTasks([task, ...tasks]);
            setNewTask('');
            setPriority('medium');
            loadStats();
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!newProjectTitle.trim()) return;

        try {
            const project = await taskService.createProject({
                title: newProjectTitle,
                color: projectColors[projects.length % projectColors.length]
            });
            setProjects([project, ...projects]);
            setNewProjectTitle('');
            setShowProjectModal(false);
            setTargetProjectId(project.id);
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    };

    const handleToggleTask = async (task) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done';

        try {
            const updated = await taskService.updateStatus(task.id, newStatus);
            setTasks(tasks.map(t => t.id === task.id ? updated : t));
            loadStats();

            // Award points for completing a task
            if (newStatus === 'done') {
                await awardPoints({
                    points: 10,
                    reason: 'Completed a task',
                    metadata: { type: 'task_completed', title: task.title, category: 'work' }
                });
            }
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await taskService.delete(taskId);
            setTasks(tasks.filter(t => t.id !== taskId));
            loadStats();
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const handleDeleteProject = async (e, projectId) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this project? Tasks will be unassigned but not deleted.')) return;

        try {
            await taskService.deleteProject(projectId);
            setProjects(projects.filter(p => p.id !== projectId));
            if (selectedProjectId === projectId) setSelectedProjectId('all');
            if (targetProjectId === projectId) setTargetProjectId('none');
            // Reload tasks to reflect unassignment (or local update)
            setTasks(tasks.map(t => t.project_id === projectId ? { ...t, project_id: null } : t));
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    const filteredTasks = tasks.filter(task => {
        // Status filter
        let statusMatch = true;
        if (filter === 'all') statusMatch = task.status !== 'archived';
        else if (filter === 'active') statusMatch = task.status === 'todo' || task.status === 'in_progress';
        else if (filter === 'done') statusMatch = task.status === 'done';

        // Project filter
        let projectMatch = true;
        if (selectedProjectId !== 'all') {
            projectMatch = task.project_id === selectedProjectId;
        }

        return statusMatch && projectMatch;
    });

    return (
        <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-border">
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-6">Task Command Center</h3>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-muted rounded-xl border border-border">
                        <p className="text-2xl font-black text-foreground">{stats.total}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total</p>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <p className="text-2xl font-black text-blue-600">{stats.todo}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">To Do</p>
                    </div>
                    <div className="text-center p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                        <p className="text-2xl font-black text-orange-600">{stats.inProgress}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active</p>
                    </div>
                    <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                        <p className="text-2xl font-black text-green-600">{stats.done}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Done</p>
                    </div>
                </div>

                {/* Add Task Form */}
                <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add a new task..."
                            className="flex-grow px-4 py-3 bg-muted rounded-xl border border-border outline-none focus:ring-2 focus:ring-blue-500 font-medium text-foreground placeholder:text-muted-foreground"
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-black flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        >
                            <Plus className="w-5 h-5" /> ADD
                        </motion.button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-xl border border-border">
                            <Flag className="w-4 h-4 text-muted-foreground" />
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="bg-transparent border-none outline-none font-bold text-xs appearance-none cursor-pointer text-foreground"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-xl flex-grow max-w-[200px] border border-border">
                            <Folder className="w-4 h-4 text-muted-foreground" />
                            <select
                                value={targetProjectId}
                                onChange={(e) => {
                                    if (e.target.value === 'new') {
                                        setShowProjectModal(true);
                                    } else {
                                        setTargetProjectId(e.target.value);
                                    }
                                }}
                                className="bg-transparent border-none outline-none font-bold text-xs appearance-none flex-grow cursor-pointer text-foreground"
                            >
                                <option value="none">No Project</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                                <option value="new">+ New Project...</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            {/* Project Tabs / Filter */}
            <div className="px-6 py-4 border-b border-border bg-muted/30 overflow-x-auto">
                <div className="flex items-center gap-6 min-w-max">
                    <div className="flex gap-2 pr-4 border-r border-border">
                        {['all', 'active', 'done'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f
                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setSelectedProjectId('all')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedProjectId === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Layers className="w-3.5 h-3.5" /> All Projects
                        </button>
                        {projects.map(project => (
                            <button
                                key={project.id}
                                onClick={() => setSelectedProjectId(project.id)}
                                className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedProjectId === project.id
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                style={{
                                    backgroundColor: selectedProjectId === project.id ? project.color : 'transparent',
                                    border: `1px solid ${selectedProjectId === project.id ? project.color : 'transparent'}`
                                }}
                            >
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: selectedProjectId === project.id ? 'white' : project.color }}
                                />
                                {project.title}
                                <Trash2
                                    className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 hover:text-red-300 transition-opacity"
                                    onClick={(e) => handleDeleteProject(e, project.id)}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="p-6 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <CheckCircle2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest">
                            {filter === 'done' ? 'No completed tasks' : 'No tasks yet'}
                        </p>
                        <p className="text-gray-300 text-sm mt-2">
                            {filter === 'done' ? 'Complete some tasks to see them here' : 'Add your first task above'}
                        </p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredTasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                projects={projects}
                                onToggle={handleToggleTask}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Project Modal */}
            <AnimatePresence>
                {showProjectModal && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setShowProjectModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl p-8 border border-border"
                        >
                            <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-6">Initialize Project</h3>
                            <form onSubmit={handleCreateProject} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Project Title</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={newProjectTitle}
                                        onChange={(e) => setNewProjectTitle(e.target.value)}
                                        placeholder="e.g. Apollo Mission"
                                        className="w-full px-5 py-4 bg-muted border border-border rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-lg font-bold text-foreground placeholder:text-muted-foreground"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowProjectModal(false)}
                                        className="flex-grow px-6 py-4 bg-muted text-muted-foreground rounded-2xl font-black uppercase tracking-widest text-xs border border-border hover:bg-muted/80 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-grow px-6 py-4 bg-primary text-primary-foreground rounded-2xl font-black shadow-xl shadow-primary/20 uppercase tracking-widest text-xs hover:bg-primary/90 transition-all"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TaskManager;
