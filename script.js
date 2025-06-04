// DOM Elements
const taskInput = document.getElementById('task-input');
const prioritySelector = document.getElementById('priority-selector');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const tasksCounter = document.getElementById('tasks-counter');
const filterOptions = document.querySelectorAll('.filter');
const clearCompletedBtn = document.getElementById('clear-completed');

// App State
let tasks = [];
let currentFilter = 'all';

// Load tasks from local storage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        priority: prioritySelector.value
    };
    
    tasks.push(newTask);
    taskInput.value = '';
    saveTasks();
    renderTasks();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Toggle task completion status
function toggleTaskStatus(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Clear all completed tasks
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Filter tasks based on current filter
function getFilteredTasks() {
    switch (currentFilter) {
        case 'pending':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

// Update task counter
function updateTaskCounter() {
    const pendingCount = tasks.filter(task => !task.completed).length;
    tasksCounter.textContent = `${pendingCount} task${pendingCount !== 1 ? 's' : ''} left`;
}

// Create a task element
function createTaskElement(task) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    if (task.completed) {
        taskItem.classList.add('completed');
    }
    
    // Priority indicator
    const priorityIndicator = document.createElement('span');
    priorityIndicator.classList.add('priority-indicator', `priority-${task.priority}`);
    
    // Checkbox
    const checkbox = document.createElement('span');
    checkbox.classList.add('checkbox');
    checkbox.innerHTML = '<i class="fas fa-check"></i>';
    checkbox.addEventListener('click', () => toggleTaskStatus(task.id));
    
    // Task text
    const taskText = document.createElement('span');
    taskText.classList.add('task-text');
    taskText.textContent = task.text;
    
    // Delete button
    const deleteBtn = document.createElement('span');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    // Append elements to task item
    taskItem.appendChild(priorityIndicator);
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteBtn);
    
    return taskItem;
}

// Render tasks to the DOM
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    // Sort tasks by priority (high to low) and completion status
    filteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1; // Incomplete tasks first
        }
        
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // Clear the task list
    taskList.innerHTML = '';
    
    // Add tasks to the list
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
    
    updateTaskCounter();
}

// Set active filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active filter UI
    filterOptions.forEach(option => {
        if (option.dataset.filter === filter) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    renderTasks();
}

// Event Listeners
addButton.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

filterOptions.forEach(option => {
    option.addEventListener('click', () => {
        setFilter(option.dataset.filter);
    });
});

// Initialize the app
loadTasks();