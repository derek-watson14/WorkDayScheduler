var ticker;
var time;
var tasks;

// Lock Icon Toggle Functions
function lockEl(el) {
  el.classList.remove("fa-unlock-alt");
  el.classList.add("fa-lock");
}
function unlockEl(el) {
  el.classList.remove("fa-lock");
  el.classList.add("fa-unlock-alt");
}

// Determine Background color of rows based on time
function getBgColor(hour) {
  if (time > hour) return "--timepassed";
  if (time === hour) return "--timecurrent";
  if (time < hour) return "--timefuture";
}

function setBgColors() {
  for (var row of $(".hour-row--text")) {
    row.style.background = `var(${getBgColor(
      parseInt(row.parentElement.dataset.time)
    )})`;
  }
}

// Check for new hour every minute and update backgrounds on change
function trackime() {
  ticker = setInterval(() => {
    var currentTime = moment().hour();
    if (currentTime > time) {
      time = currentTime;
      setBgColors();
    }
  }, 60000);
}

// Retrieve from LS if tasks exists or make new object
function retrieveTasks() {
  var localTasks = localStorage.getItem("tasks");
  tasks = localTasks ? JSON.parse(localTasks) : {};
}

// Display each task and set each lock to the right position
function displayTasks() {
  for (var row of $(".hour-row")) {
    var rowId = row.dataset.time;
    var [, text, lock] = row.children;
    if (tasks[rowId]) {
      text.textContent = tasks[rowId];
      lockEl(lock.children[0]);
    } else {
      text.textContent = "";
      unlockEl(lock.children[0]);
    }
  }
}

// Set initial program data
function init() {
  $("#currentDay").text(moment().format("dddd, MMMM Do"));
  time = moment().hour();
  trackime();
  setBgColors();
  retrieveTasks();
  displayTasks();
}

$(document).ready(function () {
  // Initialize program
  init();

  // When user types in text field, unlock lock to indicate unsaved changes
  $(".hour-row--text").keyup(function () {
    var lock = this.nextElementSibling.children[0];
    var taskId = this.parentElement.dataset.time;
    if (tasks[taskId] !== this.value) unlockEl(lock);
    else lockEl(lock);
  });

  // When user clicks lock icon save changes
  $(".hour-row--lock").click(function () {
    var text = $(this).siblings()[1].value;
    var time = $(this).parent()[0].dataset.time;
    lockEl(this.children[0]);
    tasks[time] = text;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
});
