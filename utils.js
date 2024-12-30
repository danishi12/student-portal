// Shared state management
const SharedUtils = {
    // Get assignments from localStorage
    getAssignments() {
        return JSON.parse(localStorage.getItem('assignments')) || [];
    },

    // Save assignments to localStorage
    saveAssignments(assignments) {
        localStorage.setItem('assignments', JSON.stringify(assignments));
        // Dispatch custom event for cross-page updates
        window.dispatchEvent(new CustomEvent('assignmentsUpdated'));
    },

    // Format date for display
    formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};

export default SharedUtils;