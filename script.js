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
}

function retrieveTasks() {
  var localTasks = localStorage.getItem("tasks");
  tasks = localTasks ? localTasks : {};
}

function displayTasks() {
  retrieveTasks();
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
  displayTasks();

  $(".hour-row--text").on("keyup", function () {
    console.log(this.nextElementSibling);
    this.nextElementSibling.classList.toggle("fa-lock");
    this.nextElementSibling.classList.toggle("fa-unlock-alt");
  });

  $(".hour-row").click(function () {
    var [, text, lock] = this.children;
    tasks[this.dataset.time] = {
      text: text.value,
    };
    displayTasks();
  });
});
