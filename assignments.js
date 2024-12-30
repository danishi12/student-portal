import SharedUtils from './utils.js';
// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const modal = document.getElementById('assignment-modal');
const addAssignmentBtn = document.getElementById('add-assignment');
const closeModal = document.querySelector('.close-modal');
const assignmentForm = document.getElementById('assignment-form');
const assignmentsList = document.getElementById('assignments-list');
const subjectFilter = document.getElementById('subject-filter');
const statusFilter = document.getElementById('status-filter');

// State management
let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

// Initialize assignments display
function initializeAssignments() {
    assignments = SharedUtils.getAssignments();
    updateAssignmentsList();
    updateStats();
}

// Create assignment card
function createAssignmentCard(assignment) {
    const card = document.createElement('div');
    card.className = 'assignment-card';
    
    const dueDate = new Date(assignment.dueDate);
    const isOverdue = dueDate < new Date() && !assignment.completed;
    
    card.innerHTML = `
        <div class="assignment-header">
            <h3>${assignment.title}</h3>
            <span class="priority ${assignment.priority}">${assignment.priority}</span>
        </div>
        <div class="assignment-meta">
            <span>${assignment.subject}</span>
            <span>Due: ${dueDate.toLocaleDateString()}</span>
        </div>
        <p>${assignment.description}</p>
        <div class="assignment-actions">
            <button class="action-btn ${assignment.completed ? 'completed' : ''}" 
                    onclick="toggleAssignmentStatus('${assignment.id}')">
                ${assignment.completed ? 'Completed' : 'Mark Complete'}
            </button>
            <button class="action-btn" onclick="editAssignment('${assignment.id}')">
                Edit
            </button>
            <button class="action-btn" onclick="deleteAssignment('${assignment.id}')">
                Delete
            </button>
        </div>
        ${isOverdue ? '<span class="badge overdue">Overdue</span>' : ''}
    `;
    
    return card;
}

// Update assignments list
function updateAssignmentsList() {
    assignmentsList.innerHTML = '';
    
    let filteredAssignments = assignments;
    
    // Apply filters
    const subjectValue = subjectFilter.value;
    const statusValue = statusFilter.value;
    
    if (subjectValue !== 'all') {
        filteredAssignments = filteredAssignments.filter(a => a.subject === subjectValue);
    }
    
    if (statusValue !== 'all') {
        filteredAssignments = filteredAssignments.filter(a => {
            if (statusValue === 'completed') return a.completed;
            if (statusValue === 'pending') return !a.completed && new Date(a.dueDate) >= new Date();
            if (statusValue === 'overdue') return !a.completed && new Date(a.dueDate) < new Date();
        });
    }
    
    // Sort by due date
    filteredAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    filteredAssignments.forEach(assignment => {
        assignmentsList.appendChild(createAssignmentCard(assignment));
    });
}

// Update statistics
function updateStats() {
    const now = new Date();
    const stats = assignments.reduce((acc, assignment) => {
        if (assignment.completed) {
            acc.completed++;
        } else if (new Date(assignment.dueDate) < now) {
            acc.overdue++;
        } else {
            acc.pending++;
        }
        return acc;
    }, { pending: 0, completed: 0, overdue: 0 });
    
    document.getElementById('pending-count').textContent = stats.pending;
    document.getElementById('completed-count').textContent = stats.completed;
    document.getElementById('overdue-count').textContent = stats.overdue;
}

// Toggle assignment status
function toggleAssignmentStatus(id) {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
        assignment.completed = !assignment.completed;
        saveAssignments();
        updateAssignmentsList();
        updateStats();
        showNotification(`Assignment marked as ${assignment.completed ? 'completed' : 'pending'}`);
    }
}

// Edit assignment
function editAssignment(id) {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
        document.getElementById('subject').value = assignment.subject;
        document.getElementById('title').value = assignment.title;
        document.getElementById('due-date').value = assignment.dueDate;
        document.getElementById('description').value = assignment.description;
        document.getElementById('priority').value = assignment.priority;
        
        // Store editing id
        assignmentForm.dataset.editingId = id;
        
        openModal();
    }
}

// Delete assignment
function deleteAssignment(id) {
    if (confirm('Are you sure you want to delete this assignment?')) {
        assignments = assignments.filter(a => a.id !== id);
        saveAssignments();
        updateAssignmentsList();
        updateStats();
        showNotification('Assignment deleted successfully');
    }
}

// Save assignments to localStorage
function saveAssignments() {
    SharedUtils.saveAssignments(assignments);
}

// Modal functionality
function openModal() {
    modal.style.display = 'block';
}

function closeModalHandler() {
    modal.style.display = 'none';
    assignmentForm.reset();
    delete assignmentForm.dataset.editingId;
}

// Form submission
assignmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const assignmentData = {
        id: assignmentForm.dataset.editingId || Date.now().toString(),
        subject: document.getElementById('subject').value,
        title: document.getElementById('title').value,
        dueDate: document.getElementById('due-date').value,
        description: document.getElementById('description').value,
        priority: document.getElementById('priority').value,
        completed: false
    };
    
    if (assignmentForm.dataset.editingId) {
        // Update existing assignment
        const index = assignments.findIndex(a => a.id === assignmentForm.dataset.editingId);
        if (index !== -1) {
            assignmentData.completed = assignments[index].completed;
            assignments[index] = assignmentData;
        }
    } else {
        // Add new assignment
        assignments.push(assignmentData);
    }
    
    saveAssignments();
    updateAssignmentsList();
    updateStats();
    closeModalHandler();
    showNotification('Assignment saved successfully!');
});

// Filter change handlers
subjectFilter.addEventListener('change', updateAssignmentsList);
statusFilter.addEventListener('change', updateAssignmentsList);

// Utility functions
// function showNotification(message) {
//     const notification = document.createElement('div');
//     notification.className = 'notification';
//     notification.textContent = message;
//     document.body.appendChild(notification);

//     setTimeout(() => {
//         notification.remove();
//     }, 3000);
// }

function showNotification(message) {
    SharedUtils.showNotification(message);
}

// Mobile navigation
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Event listeners for modal
addAssignmentBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalHandler);
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalHandler();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeAssignments);