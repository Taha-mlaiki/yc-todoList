let model = document.querySelector(".model");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let notification = document.querySelector(".notification");
let notificationMessage = document.querySelector(".notification p");
let submit_task = document.querySelector(".submit_task");
let updateTsk = document.querySelector(".update_task");

const openModel = () => {
  model.classList.remove("hidden");
  model.classList.add("flex");
};

const closeModel = () => {
  model.classList.add("hidden");
  model.classList.remove("flex");
};

const resetForm = () => {
  let title = document.querySelector('input[name="title"]');
  let description = document.querySelector('textarea[name="description"]');
  let status = document.querySelector('select[name="status"]');
  let priority = document.querySelector('select[name="priority"]');
  let endDate = document.querySelector('input[name="end_date"]');

  title.value = "";
  description.value = "";
  status.value = "todo";
  priority.value = "P0";
  endDate.value = "";
};

const createTask = () => {
  updateTsk.classList.replace("block", "hidden");
  submit_task.classList.replace("hidden", "block");

  let title = document.querySelector('input[name="title"]');
  let description = document.querySelector('textarea[name="description"]');
  let status = document.querySelector('select[name="status"]');
  let priority = document.querySelector('select[name="priority"]');
  let endDate = document.querySelector('input[name="end_date"]');

  openModel();
  submit_task.onclick = () => {
    if (
      !title.value ||
      !description.value ||
      !status.value ||
      !priority.value ||
      !endDate.value
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const task = {
      id: Date.now(),
      title: title.value,
      description: description.value,
      status: status.value,
      priority: priority.value,
      endDate: endDate.value,
    };
    console.log(task);
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    toast("Card created successfully");
    closeModel();
    showTasks();
    resetForm();
  };
};

const createUpdateTask = (mode, id) => {
  if (mode == "create") {
    console.log("create");
    createTask();
  } else if (mode == "update") {
    if (id) {
      updateTask(id);
    }
  }
};

const updateTask = (id) => {
  const findedTask = tasks.find((task) => task.id === id);

  let title = document.querySelector('input[name="title"]');
  let description = document.querySelector('textarea[name="description"]');
  let status = document.querySelector('select[name="status"]');
  let priority = document.querySelector('select[name="priority"]');
  let endDate = document.querySelector('input[name="end_date"]');

  if (!findedTask) return;

  submit_task.classList.replace("block", "hidden");
  updateTsk.classList.replace("hidden", "block");
  openModel();

  title.value = findedTask.title;
  description.value = findedTask.description;
  status.value = findedTask.status;
  priority.value = findedTask.priority;
  endDate.value = findedTask.endDate;

  updateTsk.onclick = () => {
    findedTask.title = title.value;
    findedTask.description = description.value;
    findedTask.status = status.value;
    findedTask.priority = priority.value;
    findedTask.endDate = endDate.value;
    console.log(findedTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    resetForm();
    closeModel();
    showTasks();
    toast("Card updated successfully!");
  };
};

const showTasks = () => {
  const todoTasksDiv = document.querySelector(".todoTasks");
  const doingTasksDiv = document.querySelector(".doingTasks");
  const doneTasksDiv = document.querySelector(".doneTasks");

  const todoCountDiv = document.getElementById("todoCount");
  const doingCountDiv = document.getElementById("doingCount");
  const doneCountDiv = document.getElementById("doneCount");

  let todoTasks = [];
  let doingTasks = [];
  let doneTasks = [];

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].status === "todo") {
      todoTasks.push(tasks[i]);
    } else if (tasks[i].status === "doing") {
      doingTasks.push(tasks[i]);
    } else if (tasks[i].status === "done") {
      doneTasks.push(tasks[i]);
    }
  }

  let todoCounter = todoTasks.length;
  let doingCounter = doingTasks.length;
  let doneCounter = doneTasks.length;

  todoCountDiv.textContent = `| ${todoCounter == 0 ? "Empty" : todoCounter}`;
  doingCountDiv.textContent = `| ${doingCounter == 0 ? "Empty" : doingCounter}`;
  doneCountDiv.textContent = `| ${doneCounter == 0 ? "Empty" : doneCounter}`;

  todoTasksDiv.innerHTML = "";
  doingTasksDiv.innerHTML = "";
  doneTasksDiv.innerHTML = "";

  todoTasks.forEach((task) => (todoTasksDiv.innerHTML += appendTask(task)));
  doingTasks.forEach((task) => (doingTasksDiv.innerHTML += appendTask(task)));
  doneTasks.forEach((task) => (doneTasksDiv.innerHTML += appendTask(task)));
};

const appendTask = (task) => {
  let borderColor = "";
  let textColor = "";

  switch (task.priority) {
    case "P0":
      borderColor = "border-l-red-700";
      textColor = "text-red-700";
      break;
    case "P1":
      borderColor = "border-l-red-400";
      textColor = "text-red-400";
      break;
    case "P2":
      borderColor = "border-l-yellow-500";
      textColor = "text-yellow-500";
      break;
    default:
      borderColor = "border-l-red-700";
      textColor = "text-red-700";
  }

  return `
    <div class="w-full rounded-md border-l-4 cursor-pointer ${borderColor} p-4 mb-4 shadow-md">
      <h2 class="font-bold text-neutral-700">${task.title}</h2>
      <div class="flex justify-between items-center">
      <p class="font-bold mt-2 ${textColor}"> ${task.priority}</p>
      <p class="text-sm text-neutral-400">${task.endDate}</p>
      </div>
      <div class="flex justify-end items-center gap-x-2"> 
        <button onclick="deleteTask(${task.id})" class="text-red-500 mt-2">Delete</button>
        <button onclick="createUpdateTask('update',${task.id})" class="text-blue-500 mt-2">Edit</button>
      </div>
    </div>
  `;
};

const deleteTask = (id) => {
  tasks = tasks.filter((task) => task.id !== id);
  toast("Card Deleted !");
  localStorage.setItem("tasks", JSON.stringify(tasks));
  showTasks();
};

const toast = (message) => {
  notificationMessage.textContent = message;
  notification.classList.remove("translate-x-72");
  setTimeout(() => {
    notification.classList.add("translate-x-72");
    notificationMessage.textContent = "";
  }, 2000);
};

const clearFilter = () => {
  tasks =
    localStorage.getItem("tasks") && JSON.parse(localStorage.getItem("tasks"));
  showTasks();
};

const filterP = (value) => {
  console.log(value);
  const oldTasks = localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : tasks;
  let newTasks = [];
  for (let i = 0; i < oldTasks.length; i++) {
    if (oldTasks[i].priority === value) {
      newTasks.push(oldTasks[i]);
    }
  }
  tasks = newTasks;
  showTasks();
};

// Call showTasks on page load to display stored tasks
showTasks();
