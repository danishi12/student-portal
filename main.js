import SharedUtils from './utils.js';

// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const modal = document.getElementById('modal');
const addAssignmentBtn = document.getElementById('add-assignment');
const closeModal = document.querySelector('.close-modal');
const assignmentForm = document.getElementById('assignment-form');
const upcomingAssignments = document.getElementById('upcoming-assignments');
const submitWorkBtn = document.getElementById('submit-work');
const contactSupportBtn = document.getElementById('contact-support');

// Create submission modal
const submissionModal = document.createElement('div');
submissionModal.className = 'modal';
submissionModal.innerHTML = `
    <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Submit Work</h2>
        <form id="submission-form">
            <div class="form-group">
                <label for="assignment-select">Select Assignment</label>
                <select id="assignment-select" required></select>
            </div>
            <div class="form-group">
                <label for="submission-file">Upload File</label>
                <input type="file" id="submission-file" required>
            </div>
            <div class="form-group">
                <label for="submission-notes">Notes</label>
                <textarea id="submission-notes"></textarea>
            </div>
            <button type="submit" class="submit-btn">Submit Work</button>
        </form>
    </div>
`;
document.body.appendChild(submissionModal);

// Create support modal
const supportModal = document.createElement('div');
supportModal.className = 'modal';
supportModal.innerHTML = `
    <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Contact Support</h2>
        <form id="support-form">
            <div class="form-group">
                <label for="issue-type">Issue Type</label>
                <select id="issue-type" required>
                    <option value="technical">Technical Issue</option>
                    <option value="academic">Academic Support</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="issue-description">Description</label>
                <textarea id="issue-description" required></textarea>
            </div>
            <div class="form-group">
                <label for="support-email">Your Email</label>
                <input type="email" id="support-email" required>
            </div>
            <button type="submit" class="submit-btn">Send Request</button>
        </form>
    </div>
`;
document.body.appendChild(supportModal);

// Update upcoming assignments display
function updateUpcomingAssignments() {
    const assignments = SharedUtils.getAssignments();
    upcomingAssignments.innerHTML = '';

    // Sort by due date and filter for upcoming assignments
    const upcomingItems = assignments
        .filter(assignment => !assignment.completed && new Date(assignment.dueDate) >= new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3); // Show only next 3 assignments

    upcomingItems.forEach(assignment => {
        const assignmentItem = document.createElement('div');
        assignmentItem.className = 'assignment-item';
        
        // Calculate if assignment is urgent (due within 24 hours)
        const isUrgent = new Date(assignment.dueDate) - new Date() < 24 * 60 * 60 * 1000;
        
        assignmentItem.innerHTML = `
            <h3>${assignment.title}</h3>
            <p>Due: ${SharedUtils.formatDate(assignment.dueDate)}</p>
            <span class="badge ${isUrgent ? 'urgent' : ''}">${isUrgent ? 'Urgent' : 'Pending'}</span>
        `;
        upcomingAssignments.appendChild(assignmentItem);
    });

    if (upcomingItems.length === 0) {
        upcomingAssignments.innerHTML = '<p>No upcoming assignments!</p>';
    }
}

// Handle work submission
function handleWorkSubmission(e) {
    e.preventDefault();
    const assignmentId = document.getElementById('assignment-select').value;
    const file = document.getElementById('submission-file').files[0];
    const notes = document.getElementById('submission-notes').value;

    // In a real application, you would upload the file to a server here
    // For this demo, we'll just show a success message
    SharedUtils.showNotification('Work submitted successfully!');
    closeAllModals();
    
    // Update assignment status
    const assignments = SharedUtils.getAssignments();
    const updatedAssignments = assignments.map(assignment => {
        if (assignment.id === assignmentId) {
            return {
                ...assignment,
                completed: true,
                submissionDate: new Date().toISOString(),
                submissionNotes: notes,
                fileName: file.name
            };
        }
        return assignment;
    });
    
    SharedUtils.saveAssignments(updatedAssignments);
    updateUpcomingAssignments();
}

// Handle support request
function handleSupportRequest(e) {
    e.preventDefault();
    const issueType = document.getElementById('issue-type').value;
    const description = document.getElementById('issue-description').value;
    const email = document.getElementById('support-email').value;

    // In a real application, you would send this to a server
    // For this demo, we'll just show a success message
    SharedUtils.showNotification('Support request sent! We\'ll respond to your email soon.');
    closeAllModals();
}

// Close all modals
function closeAllModals() {
    modal.style.display = 'none';
    submissionModal.style.display = 'none';
    supportModal.style.display = 'none';
}

// Function to save schedule to local storage
function saveSchedule(schedule) {
    localStorage.setItem('schedule', JSON.stringify(schedule));
}

// Function to get schedule from local storage
function getSchedule() {
    const schedule = localStorage.getItem('schedule');
    return schedule ? JSON.parse(schedule) : [];
}

// Function to render today's schedule
function renderTodaySchedule() {
    const todaySchedule = document.getElementById('today-schedule');
    const schedule = getSchedule();
    todaySchedule.innerHTML = '';

    schedule.forEach(item => {
        const scheduleItem = document.createElement('div');
        scheduleItem.classList.add('schedule-item');
        scheduleItem.innerHTML = `<span class="time">${item.time}</span><span class="subject">${item.subject}</span>`;
        todaySchedule.appendChild(scheduleItem);
    });
}

// Event listener for schedule form submission
document.getElementById('schedule-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const time = document.getElementById('time').value;
    const subject = document.getElementById('subject').value;
    const schedule = getSchedule();
    schedule.push({ time, subject });
    saveSchedule(schedule);
    renderTodaySchedule();
});

// Event listeners
submitWorkBtn.addEventListener('click', () => {
    // Populate assignment select
    const assignmentSelect = document.getElementById('assignment-select');
    assignmentSelect.innerHTML = '';
    
    const assignments = SharedUtils.getAssignments()
        .filter(assignment => !assignment.completed);
    
    assignments.forEach(assignment => {
        const option = document.createElement('option');
        option.value = assignment.id;
        option.textContent = assignment.title;
        assignmentSelect.appendChild(option);
    });

    submissionModal.style.display = 'block';
});

contactSupportBtn.addEventListener('click', () => {
    supportModal.style.display = 'block';
});

document.getElementById('submission-form').addEventListener('submit', handleWorkSubmission);
document.getElementById('support-form').addEventListener('submit', handleSupportRequest);

// Listen for assignment updates from other pages
window.addEventListener('assignmentsUpdated', updateUpcomingAssignments);

// Close modal buttons
document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', closeAllModals);
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    updateUpcomingAssignments();
    renderTodaySchedule();

    // Event listeners for quick actions
    document.getElementById('add-assignment')?.addEventListener('click', () => {
        window.location.href = 'assignments.html';
    });

    document.getElementById('view-schedule')?.addEventListener('click', () => {
        window.location.href = 'schedule.html';
    });

    // Modal functionality
    const modal = document.getElementById('class-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.querySelector('.close-modal');

    openModalBtn?.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModalBtn?.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Event listener for class form submission
    document.getElementById('class-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const className = document.getElementById('class-name').value;
        const classDay = document.getElementById('class-day').value;
        const classTime = document.getElementById('class-time').value;
        const schedule = getSchedule();
        schedule.push({ time: classTime, subject: className, day: classDay });
        saveSchedule(schedule);
        modal.style.display = 'none';
        renderTodaySchedule();
    });

    // Event listener for view calendar button
    document.getElementById('view-calendar')?.addEventListener('click', () => {
        alert('Calendar view is not implemented yet.');
    });
});

// Mobile navigation
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Window click for modals
window.addEventListener('click', (e) => {
    if (e.target === modal || e.target === submissionModal || e.target === supportModal) {
        closeAllModals();
    }
});

// Event listeners for quick actions
document.getElementById('add-assignment').addEventListener('click', () => {
    window.location.href = 'assignments.html';
});

document.getElementById('view-schedule').addEventListener('click', () => {
    window.location.href = 'schedule.html';
});