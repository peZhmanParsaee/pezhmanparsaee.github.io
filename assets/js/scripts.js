var animated = document.querySelector("h1");
animated.addEventListener("animationstart", listener, false);
animated.addEventListener("animationend", listener, false);
animated.addEventListener("animationiteration", listener, false);

function listener(event) {
  var output;

  switch (event.type) {
    case "animationstart":
      output = "Started, elapsed time is: " + event.elapsedTime;
      break;
    case "animationend":
      output = "Ended, elapsed time is: " + event.elapsedTime;
      break;
    case "animationiteration":
      output = "New loop started at time: " + event.elapsedTime;
      break;
  }

  console.log(output);
}
