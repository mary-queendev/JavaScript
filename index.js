// Select DOM elements
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const clearAllBtn = document.getElementById("clear-all");
const filter = document.getElementById("filter");

// Function to add a task
function addTask(
	text,
	completed = false,
	timestamp = new Date().toLocaleString()
) {
	const li = document.createElement("li");
	li.classList.add("task-item");
	li.textContent = `${text} (added on ${timestamp})`;

	if (completed) {
		li.classList.add("completed");
	}

	// Toggle completed status on click
	li.addEventListener("click", () => {
		li.classList.toggle("completed");
		saveTasks();
	});

	// Add delete button
	const deleteBtn = document.createElement("button");
	deleteBtn.textContent = "Delete";
	deleteBtn.classList.add("delete-btn");
	deleteBtn.addEventListener("click", () => {
		li.remove();
		saveTasks();
	});

	li.appendChild(deleteBtn);
	list.appendChild(li);

	saveTasks();
}

// Function to save tasks to local storage
function saveTasks() {
	const tasks = Array.from(list.children).map((task) => {
		const [text, timestampPart] =
			task.firstChild.textContent.split(" (added on ");
		const timestamp = timestampPart.slice(0, -1); // Remove trailing `)`
		return {
			text,
			completed: task.classList.contains("completed"),
			timestamp,
		};
	});
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
	const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
	savedTasks.forEach(({ text, completed, timestamp }) => {
		addTask(text, completed, timestamp);
	});
}

// Clear all tasks
clearAllBtn.addEventListener("click", () => {
	list.innerHTML = ""; // Remove all tasks from the list
	saveTasks(); // Clear tasks in local storage
});

// Filter tasks based on completion status
filter.addEventListener("change", () => {
	const filterValue = filter.value;
	const tasks = Array.from(list.children);

	tasks.forEach((task) => {
		const isCompleted = task.classList.contains("completed");
		if (
			(filterValue === "completed" && !isCompleted) ||
			(filterValue === "incomplete" && isCompleted)
		) {
			task.style.display = "none";
		} else {
			task.style.display = "list-item";
		}
	});
});

// Handle form submission
form.addEventListener("submit", (e) => {
	e.preventDefault();
	const taskText = input.value.trim();
	if (taskText) {
		addTask(taskText);
		input.value = ""; // Clear input field
	}
});

// Load tasks on page load
window.addEventListener("load", loadTasks);
