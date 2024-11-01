let model = document.querySelector(".model");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let title = document.querySelector('input[name="title"]');
let description = document.querySelector('textarea[name="title"]');
let status = document.querySelector('select[name="status"]');
let priority = document.querySelector('select[name="priority"]');
let endDate = document.querySelector('input[name="end_date"]');

let notification = document.querySelector(".notification");
let notificationMessage = document.querySelector(".notification p")


const openModel = () => {
  model.classList.remove("hidden");
  model.classList.add("flex");
};

const closeModel = () => {
  model.classList.add("hidden"), model.classList.remove("flex");
};

const resetForm = ()=>{
  title.value = "";
  description.value = "";
  status.value = "todo";
  priority.value = "P0";
  endDate.value = ""
}

const createTask = () => {
  // Collect values from the form
  

  // Validate input fields
  if (!title.value || !description.value || !status.value || !priority.value || !endDate.value) {
    alert("Please fill in all fields.");
    return;
  }

  // Create a task object
  const task = {
    id: Date.now(),
    title : title.value,
    description :description.value,
    status : status.value,
    priority : priority.value,
    endDate : endDate.value,
  };

  // log the task that has been created
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Reset the form
  resetForm();

  // Hide the modal
  document.querySelector(".model").classList.add("hidden");
  showTasks();
};

const appendTask = (task) => {
  // Define border color based on priority
  let borderColor = "";
  let textColor = ""
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

  // Return task HTML with dynamic left border color
  return `
    <div class="w-full rounded-md border-l-4 cursor-pointer ${borderColor} p-4 mb-4 shadow-md">
      <h2 class="font-bold text-neutral-700">${task.title}</h2>
      <div class="flex justify-between items-center">
      <p class="font-bold mt-2 ${textColor}"> ${task.priority}</p>
      <p class="text-sm text-neutral-400">${task.endDate}</p>
      </div>
      <div class="flex justify-end items-center gap-x-2"> 
        <button onclick="deleteTask(${task.id})" class="text-red-500 mt-2">Delete</button>
        <button onclick="updateTask(${task.id})" class="text-blue-500 mt-2">Edit</button>
      </div>
    </div>
  `;
};

const deleteTask = (id)=>{
  tasks = tasks.filter((task)=> task.id !== id)
  toast("Card Deleted !")
  localStorage.setItem("tasks",JSON.stringify(tasks))
  showTasks();
}

const toast = (message)=>{
  notificationMessage.textContent = message
  notification.classList.remove("translate-x-72")
  setTimeout(() => {
    notification.classList.add("translate-x-72")
  notificationMessage.textContent = ""
  }, 2000);
}

const updateTask = (id)=>{
  let submit_task = document.querySelector(".submit_task");
  openModel();

  submit_task.textContent = "Edit"
  if(id){
    const findedTask = tasks.find((task)=> task.id == id)
    title.value = findedTask.title
    description.value = findedTask.description
    status.value = findedTask.status
    priority.value = findedTask.priority
    endDate.value = findedTask.endDate
    submit_task.onclick = ()=>{
      findedTask.title = title.value
      findedTask.description = description.value
      findedTask.status = status.value
      findedTask.priority = priority.value
      findedTask.endDate = endDate.value
      localStorage.setItem("tasks",JSON.stringify(tasks))
      toast("Card updated successfully !");
      showTasks();
      closeModel();
    }
  }
}

const showTasks = () => {
  // Select columns and count elements
  const todoTasksDiv = document.querySelector(".todoTasks");
  const doingTasksDiv = document.querySelector(".doingTasks");
  const doneTasksDiv = document.querySelector(".doneTasks");

  const todoCountDiv = document.getElementById("todoCount");
  const doingCountDiv = document.getElementById("doingCount");
  const doneCountDiv = document.getElementById("doneCount");

  let todoTasks = [];
  let doingTasks = [];
  let doneTasks = [];

  for(let i = 0;i<tasks.length ;i++){
    if(tasks[i].status == "todo"){
      todoTasks.push(tasks[i])
    }else if (tasks[i].status == "doing"){
      doingTasks.push(tasks[i])
    }else if (tasks[i].status == "done"){
      doneTasks.push(tasks[i])
    }
  }




  // Reset counters
  let todoCounter = todoTasks.length;
  let doingCounter = doingTasks.length;
  let doneCounter = doneTasks.length;

  

  // Update counts
  todoCountDiv.textContent = `| ${todoCounter}`;
  doingCountDiv.textContent = `| ${doingCounter}`;
  doneCountDiv.textContent = `| ${doneCounter}`;

  todoTasksDiv.innerHTML = ""
  doingTasksDiv.innerHTML = ""
  doneTasksDiv.innerHTML = ""

  todoTasks.forEach((task)=> todoTasksDiv.innerHTML += appendTask(task))
  doingTasks.forEach((task)=> doingTasksDiv.innerHTML += appendTask(task))
  doneTasks.forEach((task)=> doneTasksDiv.innerHTML += appendTask(task))
};

// Call showTasks on page load to display stored tasks
showTasks();
