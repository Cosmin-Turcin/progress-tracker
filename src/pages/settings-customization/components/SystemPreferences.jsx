import React from 'react';
import { Sun, Moon, Globe, Download, Shield, User, Trash2, LogOut } from 'lucide-react';
import Button from '../../../components/ui/Button';

const SystemPreferences = ({ settings, onChange }) => {
    const handleToggle = (key) => {
        onChange(key, !settings?.[key]);
    };

    const handleSelectChange = (key, value) => {
        onChange(key, value);
    };

    const themes = [
        { value: 'light', label: 'Light Mode', icon: <Sun className="h-5 w-5" /> },
        { value: 'dark', label: 'Dark Mode', icon: <Moon className="h-5 w-5" /> },
        { value: 'auto', label: 'Auto (System)', icon: <Globe className="h-5 w-5" /> },
    ];

    const languages = [
        { value: 'en', label: 'English', flag: '🇺🇸' },
        { value: 'es', label: 'Español', flag: '🇪🇸' },
        { value: 'fr', label: 'Français', flag: '🇫🇷' },
        { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
        { value: 'ja', label: '日本語', flag: '🇯🇵' },
    ];

    const handleExportData = () => {
        alert('Exporting your data... This may take a moment.');
        // Export logic here
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Account deletion requested. You will receive a confirmation email.');
            // Delete account logic here
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    System Preferences
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage theme, privacy settings, data export, and account options
                </p>
            </div>
            {/* Theme Selection */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Theme Appearance
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {themes?.map((theme) => {
                        const isSelected = settings?.theme === theme?.value;

                        return (
                            <button
                                key={theme?.value}
                                onClick={() => handleSelectChange('theme', theme?.value)}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    isSelected
                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30' :'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                                }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div
                                        className={`p-3 rounded-lg ${
                                            isSelected
                                                ? 'bg-blue-600 text-white' :'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }`}
                                    >
                                        {theme?.icon}
                                    </div>
                                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                                        {theme?.label}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
            {/* Language Selection */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Language
                </label>
                <select
                    value={settings?.language}
                    onChange={(e) => handleSelectChange('language', e?.target?.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                >
                    {languages?.map((lang) => (
                        <option key={lang?.value} value={lang?.value}>
                            {lang?.flag} {lang?.label}
                        </option>
                    ))}
                </select>
            </div>
            {/* Privacy & Data Settings */}
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg p-5 border border-gray-200 dark:border-gray-600 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Privacy & Data
                </h3>

                <div className="space-y-4">
                    {/* Auto Export Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                Automatic Data Export
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Export your data weekly to your email
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle('autoExport')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                settings?.autoExport ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    settings?.autoExport ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    {/* Privacy Mode Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                Privacy Mode
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Hide your activity from public leaderboards
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle('privacyMode')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                settings?.privacyMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    settings?.privacyMode ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    {/* Manual Export Button */}
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={handleExportData}
                        iconName="Download"
                        className="justify-center"
                    >
                        Export All Data
                    </Button>
                </div>
            </div>
            {/* Account Management */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-5 border border-red-200 dark:border-red-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-red-600 dark:text-red-400" />
                    Account Management
                </h3>

                <div className="space-y-3">
                    <Button
                        variant="outline"
                        fullWidth
                        iconName="LogOut"
                        className="justify-center border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30"
                    >
                        Sign Out
                    </Button>

                    <Button
                        variant="destructive"
                        fullWidth
                        onClick={handleDeleteAccount}
                        iconName="Trash2"
                        className="justify-center"
                    >
                        Delete Account
                    </Button>

                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2">
                        ⚠️ Account deletion is permanent and cannot be undone. All your data will be lost.
                    </p>
                </div>
            </div>
            {/* App Version Info */}
            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    App Version 1.0.0 | Last Updated: December 2025
                </p>
            </div>
        </div>
    );
};

export default SystemPreferences;