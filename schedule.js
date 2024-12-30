// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const modal = document.getElementById('class-modal');
const addClassBtn = document.getElementById('add-class');
const closeModal = document.querySelector('.close-modal');
const classForm = document.getElementById('class-form');
const scheduleGrid = document.getElementById('schedule-grid');
const currentWeekElement = document.getElementById('current-week');
const prevWeekBtn = document.getElementById('prev-week');
const nextWeekBtn = document.getElementById('next-week');
const viewCalendarBtn = document.getElementById('view-calendar');

// State management
let currentDate = new Date();
let scheduleData = JSON.parse(localStorage.getItem('scheduleData')) || {};
let isCalendarView = false;

// Initialize schedule
function initializeSchedule() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    scheduleGrid.innerHTML = '';

    if (isCalendarView) {
        displayCalendarView();
    } else {
        days.forEach(day => {
            const dayColumn = document.createElement('div');
            dayColumn.className = 'schedule-day';
            dayColumn.id = `${day}-column`;
            
            const dayHeader = document.createElement('h3');
            dayHeader.textContent = day.charAt(0).toUpperCase() + day.slice(1);
            dayColumn.appendChild(dayHeader);

            scheduleGrid.appendChild(dayColumn);
        });

        displayClasses();
    }
}

// Display classes in schedule
function displayClasses() {
    // Clear existing class blocks
    document.querySelectorAll('.class-block').forEach(block => block.remove());

    // Display saved classes
    Object.values(scheduleData).forEach(classInfo => {
        const column = document.getElementById(`${classInfo.day}-column`);
        if (column) {
            const classBlock = createClassBlock(classInfo);
            column.appendChild(classBlock);
        }
    });
}

// Create class block element
function createClassBlock(classInfo) {
    const block = document.createElement('div');
    block.className = 'class-block';
    block.innerHTML = `
        <strong>${classInfo.className}</strong>
        <div>${formatTime(classInfo.startTime)} - ${formatTime(classInfo.endTime)}</div>
        <div>Room: ${classInfo.room}</div>
    `;

    // Add click event for editing
    block.addEventListener('click', () => editClass(classInfo));

    return block;
}

// Display calendar view
function displayCalendarView() {
    scheduleGrid.innerHTML = '';
    const calendarContainer = document.createElement('div');
    calendarContainer.className = 'calendar-container';

    // Create calendar header
    const calendarHeader = document.createElement('div');
    calendarHeader.className = 'calendar-header';
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarHeader.appendChild(dayHeader);
    });
    calendarContainer.appendChild(calendarHeader);

    // Create time slots
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
    timeSlots.forEach(time => {
        const row = document.createElement('div');
        row.className = 'calendar-row';
        
        // Add time label
        const timeLabel = document.createElement('div');
        timeLabel.className = 'calendar-time';
        timeLabel.textContent = formatTime(time);
        row.appendChild(timeLabel);

        // Add cells for each day
        daysOfWeek.forEach(day => {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            const classesAtTime = findClassesAtTime(day.toLowerCase(), time);
            if (classesAtTime.length > 0) {
                classesAtTime.forEach(classInfo => {
                    const classBlock = createCalendarClassBlock(classInfo);
                    cell.appendChild(classBlock);
                });
            }
            row.appendChild(cell);
        });

        calendarContainer.appendChild(row);
    });

    scheduleGrid.appendChild(calendarContainer);
}

// Helper function to create calendar class block
function createCalendarClassBlock(classInfo) {
    const block = document.createElement('div');
    block.className = 'calendar-class-block';
    block.innerHTML = `
        <strong>${classInfo.className}</strong>
        <div>Room: ${classInfo.room}</div>
    `;
    block.addEventListener('click', () => editClass(classInfo));
    return block;
}

// Helper function to find classes at specific time
function findClassesAtTime(day, time) {
    return Object.values(scheduleData).filter(classInfo => {
        const classStart = classInfo.startTime;
        const classEnd = classInfo.endTime;
        return classInfo.day === day && 
               time >= classStart.slice(0, 5) && 
               time < classEnd.slice(0, 5);
    });
}

// Format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Update week display
function updateWeekDisplay() {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4);

    currentWeekElement.textContent = `Week of ${startOfWeek.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    })}`;
}

// Navigate weeks
prevWeekBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 7);
    updateWeekDisplay();
});

nextWeekBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 7);
    updateWeekDisplay();
});

// Modal functionality
function openModal() {
    modal.style.display = 'block';
}

function closeModalHandler() {
    modal.style.display = 'none';
    classForm.reset();
}

// Edit class
function editClass(classInfo) {
    document.getElementById('class-name').value = classInfo.className;
    document.getElementById('class-day').value = classInfo.day;
    document.getElementById('start-time').value = classInfo.startTime;
    document.getElementById('end-time').value = classInfo.endTime;
    document.getElementById('room').value = classInfo.room;

    openModal();
}

// Form submission
classForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const classInfo = {
        id: Date.now().toString(),
        className: document.getElementById('class-name').value,
        day: document.getElementById('class-day').value,
        startTime: document.getElementById('start-time').value,
        endTime: document.getElementById('end-time').value,
        room: document.getElementById('room').value
    };

    // Save to schedule data
    scheduleData[classInfo.id] = classInfo;
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));

    // Update display
    displayClasses();
    closeModalHandler();
    showNotification('Class schedule updated successfully!');
});

// Export schedule
document.getElementById('export-schedule').addEventListener('click', () => {
    const scheduleText = Object.values(scheduleData)
        .map(classInfo => `${classInfo.className} - ${classInfo.day} ${classInfo.startTime}-${classInfo.endTime} (Room ${classInfo.room})`)
        .join('\n');

    const blob = new Blob([scheduleText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Set reminder
document.getElementById('set-reminder').addEventListener('click', () => {
    // Check if browser supports notifications
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification('Reminders enabled for your schedule!');
            }
        });
    }
});

// View Calendar toggle
viewCalendarBtn.addEventListener('click', () => {
    isCalendarView = !isCalendarView;
    viewCalendarBtn.textContent = isCalendarView ? 'View Schedule' : 'View Calendar';
    initializeSchedule();
});

// Utility functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Mobile navigation
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeSchedule();
    updateWeekDisplay();
});

// Event listeners for modal
addClassBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalHandler);
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalHandler();
    }
});