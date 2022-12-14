const buttonColours = ["red", "blue", "green", "yellow"];
let userClickedPattern = [];
var gamePattern = [];

let leaderBoard = JSON.parse(localStorage.getItem("leaderBoard")) || [];
var added = false;
var started = false;
let level = 0;
var leaderName = "";
var leaderValue = 0;

let username;

showName();

function addLeaderBoard() {
  console.log(username);

  const user = {
    name: username,
    value: level,
  };

  leaderBoard = leaderBoard.map((lead) => {
    if (lead.name === username) {
      added = true;
      if (lead.value < level) return { ...lead, value: level };
    }

    return lead;
  });

  if (!added) {
    leaderBoard.push(user);
    added = false;
  }

  localStorage.setItem("leaderBoard", JSON.stringify(leaderBoard));
}

function showName() {
  leaderBoard.map((lead) => {
    if (lead.value > leaderValue) {
      leaderValue = lead.value;
      leaderName = lead.name;
    }
  });

  $(".btnT p").text(leaderName + ": " + leaderValue);
}

$(document).keypress(function () {
  if (!started) {
    $("#level-title").text(`Level ${level}`);
    nextSequence();

    started = true;
  }
});

$(".btn").click(function () {
  var userChosenColour = this.id;
  userClickedPattern.push(userChosenColour);

  playSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (gamePattern.length === userClickedPattern.length) {
      setTimeout(() => {
        nextSequence();
        userClickedPattern = [];
      }, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(() => {
      $("body").removeClass("game-over");
    }, 200);
    $("#level-title").text("Game Over, Press Any Key to Restart");
    startOver();
  }
}

function nextSequence() {
  level++;
  userClickedPattern = [];

  $("#level-title").text(`Level ${level}`);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  $(`#${randomChosenColour}`).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColour);
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColour) {
  var self = $(`#${currentColour}`);

  self.addClass("pressed");

  setTimeout(function () {
    self.removeClass("pressed");
  }, 100);
}

function startOver() {
  addLeaderBoard();
  showName();
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  started = false;
}

$(".begin").on("click", function () {
  username = $("#usern").val();
  $(".slide").slideToggle(); // it slideIn and slideOut
});
