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
    Calendar
} from 'lucide-react';
import { taskService } from '../../../services/taskService';
import { useEcosystemPoints } from '../../../hooks/useEcosystemPoints';

const priorityColors = {
    low: 'text-gray-400 bg-gray-50',
    medium: 'text-blue-600 bg-blue-50',
    high: 'text-orange-600 bg-orange-50',
    urgent: 'text-red-600 bg-red-50'
};

const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
};

const TaskItem = ({ task, onToggle, onDelete }) => {
    const isDone = task.status === 'done';

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`flex items-center gap-4 p-4 bg-white rounded-2xl border transition-all group ${isDone ? 'border-green-100 bg-green-50/50' : 'border-gray-100 hover:border-gray-200'
                }`}
        >
            <button
                onClick={() => onToggle(task)}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDone
                        ? 'bg-green-500 text-white'
                        : 'border-2 border-gray-200 hover:border-green-500 hover:bg-green-50'
                    }`}
            >
                {isDone && <Check className="w-4 h-4" />}
            </button>

            <div className="flex-grow">
                <p className={`font-bold ${isDone ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {task.title}
                </p>
                {task.description && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                )}
            </div>

            <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${priorityColors[task.priority]}`}>
                    {priorityLabels[task.priority]}
                </span>
                <button
                    onClick={() => onDelete(task.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState('');
    const [priority, setPriority] = useState('medium');
    const [filter, setFilter] = useState('all');
    const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });

    const { awardPoints } = useEcosystemPoints();

    useEffect(() => {
        loadTasks();
        loadStats();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getAll();
            setTasks(data);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setLoading(false);
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
                priority: priority
            });
            setTasks([task, ...tasks]);
            setNewTask('');
            setPriority('medium');
            loadStats();
        } catch (error) {
            console.error('Failed to create task:', error);
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

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return task.status !== 'archived';
        if (filter === 'active') return task.status === 'todo' || task.status === 'in_progress';
        if (filter === 'done') return task.status === 'done';
        return true;
    });

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-6">Task Command Center</h3>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-2xl font-black text-gray-900">{stats.total}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                        <p className="text-2xl font-black text-blue-600">{stats.todo}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">To Do</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-xl">
                        <p className="text-2xl font-black text-orange-600">{stats.inProgress}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                        <p className="text-2xl font-black text-green-600">{stats.done}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Done</p>
                    </div>
                </div>

                {/* Add Task Form */}
                <form onSubmit={handleAddTask} className="flex gap-3">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a new task..."
                        className="flex-grow px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="px-4 py-3 bg-gray-50 rounded-xl border-none outline-none font-bold text-sm appearance-none"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-black flex items-center gap-2 hover:bg-gray-800 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> ADD
                    </motion.button>
                </form>
            </div>

            {/* Filter Tabs */}
            <div className="px-6 py-4 border-b border-gray-100 flex gap-4">
                {['all', 'active', 'done'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors ${filter === f
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {f}
                    </button>
                ))}
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
                                onToggle={handleToggleTask}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default TaskManager;
