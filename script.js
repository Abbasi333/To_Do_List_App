document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("todo-form");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const filterButtons = document.querySelectorAll(".filter button");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText) {
      const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
      };
      tasks.push(task);
      addTaskToDOM(task);
      saveTasks();
      taskInput.value = "";
    }
  });

  taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      const taskId = e.target.closest("li").dataset.id;
      tasks = tasks.filter((task) => task.id != taskId);
      saveTasks();
      e.target.closest("li").remove();
    } else if (e.target.classList.contains("edit")) {
      const taskId = e.target.closest("li").dataset.id;
      const task = tasks.find((task) => task.id == taskId);
      taskInput.value = task.text;
      tasks = tasks.filter((task) => task.id != taskId);
      saveTasks();
      e.target.closest("li").remove();
    } else if (e.target.classList.contains("complete")) {
      const taskId = e.target.closest("li").dataset.id;
      const task = tasks.find((task) => task.id == taskId);
      task.completed = !task.completed;
      saveTasks();
      e.target.closest("li").classList.toggle("completed");
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      filterTasks(button.id);
    });
  });

  function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-buttons">
                <button class="complete">${
                  task.completed ? "Undo" : "Complete"
                }</button>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;
    taskList.appendChild(li);
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function filterTasks(filter) {
    let filteredTasks = tasks;
    if (filter === "completed") {
      filteredTasks = tasks.filter((task) => task.completed);
    } else if (filter === "pending") {
      filteredTasks = tasks.filter((task) => !task.completed);
    }
    taskList.innerHTML = "";
    filteredTasks.forEach(addTaskToDOM);
  }

  // Initial load
  tasks.forEach(addTaskToDOM);
});
