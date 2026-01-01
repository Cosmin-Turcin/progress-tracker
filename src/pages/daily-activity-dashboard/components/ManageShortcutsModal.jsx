import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Edit2, Check, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import AppIcon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import { settingsService } from '../../../services/settingsService';

const CATEGORIES = [
    { id: 'fitness', label: 'Fitness', color: 'var(--color-primary)' },
    { id: 'mindset', label: 'Mindset', color: 'var(--color-secondary)' },
    { id: 'nutrition', label: 'Nutrition', color: 'var(--color-success)' },
    { id: 'work', label: 'Work', color: 'var(--color-primary)' },
    { id: 'social', label: 'Social', color: 'var(--color-accent)' },
    { id: 'others', label: 'Others', color: 'var(--color-muted-foreground)' }
];

const AVAILABLE_ICONS = [
    'Dumbbell', 'Brain', 'Heart', 'Zap', 'Apple', 'Target', 'Book', 'Coffee',
    'Moon', 'Droplets', 'Wind', 'Smile', 'Trophy', 'Activity', 'CheckCircle',
    'MessageCircle', 'Users', 'Bell', 'Settings', 'Flame', 'Sun', 'Cloud',
    'Bike', 'ShoppingBag', 'Music', 'MapPin', 'Camera', 'Code', 'PenTool'
];

const ManageShortcutsModal = ({ shortcuts, onClose, onUpdate }) => {
    const { user } = useAuth();
    const [localShortcuts, setLocalShortcuts] = useState([...shortcuts]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ label: '', category: 'others', icon: 'Activity', iconColor: 'var(--color-primary)' });
    const [loading, setLoading] = useState(false);

    const handleSave = async (updatedShortcuts) => {
        try {
            setLoading(true);
            await settingsService.update(user.id, { quickShortcuts: updatedShortcuts });
            onUpdate(updatedShortcuts);
        } catch (error) {
            console.error('Error saving shortcuts:', error);
        } finally {
            setLoading(false);
        }
    };

    const addShortcut = () => {
        if (!newItem.label.trim()) return;
        const categoryColor = CATEGORIES.find(c => c.id === newItem.category)?.color || 'var(--color-primary)';
        const updated = [...localShortcuts, { ...newItem, iconColor: categoryColor }];
        setLocalShortcuts(updated);
        setIsAdding(false);
        setNewItem({ label: '', category: 'others', icon: 'Activity', iconColor: 'var(--color-primary)' });
        handleSave(updated);
    };

    const removeShortcut = (index) => {
        const updated = localShortcuts.filter((_, i) => i !== index);
        setLocalShortcuts(updated);
        handleSave(updated);
    };

    const startEdit = (index) => {
        setEditingIndex(index);
        setNewItem(localShortcuts[index]);
    };

    const saveEdit = () => {
        const categoryColor = CATEGORIES.find(c => c.id === newItem.category)?.color || 'var(--color-primary)';
        const updated = localShortcuts.map((item, i) => i === editingIndex ? { ...newItem, iconColor: categoryColor } : item);
        setLocalShortcuts(updated);
        setEditingIndex(null);
        setNewItem({ label: '', category: 'others', icon: 'Activity', iconColor: 'var(--color-primary)' });
        handleSave(updated);
    };

    const moveShortcut = (index, direction) => {
        const updated = [...localShortcuts];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= updated.length) return;

        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setLocalShortcuts(updated);
        handleSave(updated);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-card w-full max-w-2xl rounded-2xl border border-border overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Manage Quick Shortcuts</h2>
                        <p className="text-sm text-muted-foreground">Customize your dashboard shortcuts</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Current Shortcuts List */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            Current Shortcuts
                            <span className="px-1.5 py-0.5 rounded-full bg-muted text-[10px]">{localShortcuts.length}</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {localShortcuts.map((shortcut, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card/50 hover:bg-muted/30 transition-all group">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: `${shortcut.iconColor}15` }}
                                    >
                                        <AppIcon name={shortcut.icon} size={20} color={shortcut.iconColor} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-foreground truncate">{shortcut.label}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-medium">{shortcut.category}</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex flex-col">
                                            <button
                                                onClick={() => moveShortcut(index, 'up')}
                                                disabled={index === 0}
                                                className="p-1 rounded-md hover:bg-primary/10 text-primary transition-colors disabled:opacity-30"
                                                title="Move Up"
                                            >
                                                <ChevronUp size={12} />
                                            </button>
                                            <button
                                                onClick={() => moveShortcut(index, 'down')}
                                                disabled={index === localShortcuts.length - 1}
                                                className="p-1 rounded-md hover:bg-primary/10 text-primary transition-colors disabled:opacity-30"
                                                title="Move Down"
                                            >
                                                <ChevronDown size={12} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => startEdit(index)}
                                            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => removeShortcut(index)}
                                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {!isAdding && editingIndex === null && (
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm font-bold text-muted-foreground hover:text-primary h-[66px]"
                                >
                                    <Plus size={18} /> Add Shortcut
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Add/Edit Form */}
                    <AnimatePresence>
                        {(isAdding || editingIndex !== null) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-primary uppercase">
                                        {editingIndex !== null ? 'Edit Shortcut' : 'Add New Shortcut'}
                                    </h3>
                                    <button
                                        onClick={() => { setIsAdding(false); setEditingIndex(null); }}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Label</label>
                                            <input
                                                type="text"
                                                value={newItem.label}
                                                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                                                placeholder="e.g. Morning Yoga"
                                                className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Category</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {CATEGORIES.map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => setNewItem({ ...newItem, category: cat.id })}
                                                        className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all border ${newItem.category === cat.id
                                                            ? 'bg-primary text-primary-foreground border-primary'
                                                            : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                                                            }`}
                                                    >
                                                        {cat.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Select Icon</label>
                                            <div className="grid grid-cols-7 gap-2 max-h-40 overflow-y-auto p-2 bg-card rounded-xl border border-border">
                                                {AVAILABLE_ICONS.map(icon => (
                                                    <button
                                                        key={icon}
                                                        onClick={() => setNewItem({ ...newItem, icon })}
                                                        className={`p-2 rounded-lg flex items-center justify-center transition-all ${newItem.icon === icon ? 'bg-primary/20 text-primary ring-2 ring-primary/50' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                            }`}
                                                    >
                                                        <AppIcon name={icon} size={18} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                    <button
                                        onClick={() => { setIsAdding(false); setEditingIndex(null); }}
                                        className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={editingIndex !== null ? saveEdit : addShortcut}
                                        disabled={!newItem.label.trim() || loading}
                                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : (editingIndex !== null ? 'Save Changes' : 'Add Shortcut')}
                                        {!loading && <Check size={18} />}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-6 border-t border-border bg-muted/30 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground italic">You can have up to 12 shortcuts on your dashboard.</p>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-all group"
                    >
                        Finished <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ManageShortcutsModal;
