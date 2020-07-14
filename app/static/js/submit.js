 let item = document.querySelector("#submit-btn");

    let timerID;
    let counter = 0;

    let pressHoldEvent = new CustomEvent("pressHold");

    // Increase or decreae value to adjust how long
    // one should keep pressing down before the pressHold
    // event fires
    let pressHoldDuration = 50;

    // Listening for the mouse and touch events
//    item.addEventListener("mousedown", pressingDown, false);
  //  item.addEventListener("mouseup", notPressingDown, false);
//    item.addEventListener("mouseleave", notPressingDown, false);

    item.addEventListener("touchstart", pressingDown, false);
    item.addEventListener("touchend", notPressingDown, false);

    // Listening for our custom pressHold event
    item.addEventListener("pressHold", doSomething, false);

    function pressingDown(e) {
      // Start the timer
      requestAnimationFrame(timer);

      e.preventDefault();

      console.log("Pressing!");
    }

    function notPressingDown(e) {
      // Stop the timer
      cancelAnimationFrame(timerID);
      counter = 0;
         item.style.setProperty("background-color", "white");
         item.style.setProperty("color", "#4ac263");
      console.log("Not pressing!");
    }

    //
    // Runs at 60fps when you are pressing down
    //
    function timer() {
      console.log("Timer tick!");

      if (counter < pressHoldDuration) {
        timerID = requestAnimationFrame(timer);
        counter++;
     item.style.setProperty("background-color", "#4ac263");
         item.style.setProperty("color", "white");
      } else {
        console.log("Press threshold reached!");
        item.dispatchEvent(pressHoldEvent);
      }
    }

    function doSomething(e) {
      console.log("pressHold event fired!");
    }