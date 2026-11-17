const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");
const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// Add Task

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}


// Display Tasks

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(task => !task.completed);

    } else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(task => task.completed);

    }


    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <li class="empty">
                No tasks found.
            </li>
        `;

    }


    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }


        li.innerHTML = `

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <span class="task-text">
                ${escapeHTML(task.text)}
            </span>

            <button
                class="edit-btn"
                onclick="editTask(${task.id})"
            >
                Edit
            </button>

            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
            >
                Delete
            </button>

        `;

        taskList.appendChild(li);

    });


    updateTaskCount();
}


// Complete / Uncomplete Task

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });

    saveTasks();

    renderTasks();
}


// Delete Task

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}


// Edit Task

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) {
        return;
    }

    const updatedText = newText.trim();

    if (updatedText === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.text = updatedText;

    saveTasks();

    renderTasks();
}


// Clear Completed

clearCompleted.addEventListener("click", function () {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();

    renderTasks();

});


// Filter Tasks

filters.forEach(filter => {

    filter.addEventListener("click", function () {

        filters.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderTasks();

    });

});


// Update Task Counter

function updateTaskCount() {

    const activeTasks = tasks.filter(task => !task.completed).length;

    if (activeTasks === 1) {

        taskCount.textContent = "1 task left";

    } else {

        taskCount.textContent = `${activeTasks} tasks left`;

    }
}


// Save Tasks

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// Prevent HTML injection

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// Add task using Enter key

taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


addBtn.addEventListener("click", addTask);


// Initial display

renderTasks();