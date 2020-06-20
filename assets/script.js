var ticker;
var time;
var testTime = 12;
var tasks;

function getBgColor(hour) {
  if (testTime > hour) return "--timepassed";
  if (testTime === hour) return "--timecurrent";
  if (testTime < hour) return "--timefuture";
}

function setBgColors() {
  for (var row of $(".hour-row--text")) {
    row.style.background = `var(${getBgColor(
      parseInt(row.parentElement.dataset.time)
    )})`;
  }
}

function trackime() {
  ticker = setInterval(() => {
    var currentTime = moment().hour();
    if (currentTime > time) {
      time = currentTime;
      setBgColors();
    }
  }, 60000);
}

function init() {
  $("#currentDay").text(moment().format("dddd, MMMM Do"));
  time = moment().hour();
  trackime();
  setBgColors();
  retrieveTasks();
  displayTasks();
}

function retrieveTasks() {
  var localTasks = localStorage.getItem("tasks");
  tasks = localTasks ? JSON.parse(localTasks) : {};
}

function displayTasks() {
  for (var row of $(".hour-row")) {
    var rowId = row.dataset.time;
    var [, text, lock] = row.children;
    if (tasks[rowId]) {
      text.textContent = tasks[rowId].text;
      lock.children[0].classList.remove("fa-unlock-alt");
      lock.children[0].classList.add("fa-lock");
    } else {
      text.textContent = "";
      lock.children[0].classList.add("fa-unlock-alt");
      lock.children[0].classList.remove("fa-lock");
    }
  }
}

$(document).ready(function () {
  init();

  $(".hour-row--text").on("keyup", function () {
    var lock = this.nextElementSibling.children[0];
    var taskId = this.parentElement.dataset.time;
    if (tasks[taskId] !== this.value) {
      lock.classList.remove("fa-lock");
      lock.classList.add("fa-unlock-alt");
    } else {
      lock.classList.remove("fa-unlock-alt");
      lock.classList.add("fa-lock");
    }
  });

  $(".hour-row--lock").click(function () {
    var text = $(this).siblings()[1].value;
    var time = $(this).parent()[0].dataset.time;
    this.children[0].classList.remove("fa-unlock-alt");
    this.children[0].classList.add("fa-lock");
    tasks[time] = text;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
});
