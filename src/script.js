// Selectors
const addTaskModal = document.getElementById("addTaskModal");
const taskForm = document.getElementById("taskForm");
const tasksContainer = document.getElementById("tasks");

// Functions to open and close the modal
function openModal() {
  addTaskModal.classList.remove("hidden");
}
function closeModal() {
  addTaskModal.classList.add("hidden");
}

// Task array to store tasks
let tasks = [];

// Add Task Function
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const dueDate = document.getElementById("taskDueDate").value;
  const priority = document.getElementById("taskPriority").value;

  // Create task object
  const task = {
    id: Date.now(),
    title,
    description,
    dueDate,
    priority,
    status: "To Do"
  };

  // Add task to tasks array
  tasks.push(task);

  // Reset form and close modal
  taskForm.reset();
  closeModal();

  // Render tasks
  renderTasks();
});

// Render Tasks Function
function renderTasks() {
  tasksContainer.innerHTML = "";

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.className = `flex justify-between items-center p-4 rounded shadow ${getPriorityColor(
      task.priority
    )}`;
    
    taskItem.innerHTML = `
      <div>
        <h3 class="font-semibold">${task.title}</h3>
        <p class="text-sm">${task.dueDate}</p>
        <p class="text-sm">${task.description}</p>
      </div>
      <div class="space-x-2">
        <button onclick="changeStatus(${task.id})" class="bg-blue-500 text-white px-2 py-1 rounded">${task.status}</button>
        <button onclick="deleteTask(${task.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
      </div>
    `;
    tasksContainer.appendChild(taskItem);
  });
}

// Get Priority Color
function getPriorityColor(priority) {
  switch (priority) {
    case "P1":
      return "bg-red-100 text-red-700";
    case "P2":
      return "bg-orange-100 text-orange-700";
    case "P3":
      return "bg-green-100 text-green-700";
    default:
      return "";
  }
}

// Change Task Status
function changeStatus(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      task.status = task.status === "To Do" ? "Done" : "To Do";
    }
    return task;
  });
  renderTasks();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
}
