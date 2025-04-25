// components/Toast.jsx
import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        let timer;
        if (isVisible && duration) {
            timer = setTimeout(() => {
                onClose();
            }, duration);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    // Define color schemes for different toast types
    const colorSchemes = {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        warning: 'bg-amber-500 text-white',
        info: 'bg-blue-600 text-white',
        default: 'bg-gray-800 text-white'
    };

    // Icon based on toast type
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle',
        default: 'fa-bell'
    };

    const colorClasses = colorSchemes[type] || colorSchemes.default;
    const icon = iconMap[type] || iconMap.default;

    return (
        <div className={`fixed top-5 right-5 ${colorClasses} py-3 px-4 rounded-md shadow-lg z-50 flex items-center gap-2 animate-fade-in transition-all duration-300 mt-30`}>
            <i className={`fas ${icon}`}></i>
            <span>{message}</span>
            <button
                onClick={onClose}
                className="ml-3 text-white hover:text-gray-200"
            >
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
};

export default Toast;
