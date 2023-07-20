// supertimeout.js is released to the public domain
// supertimeout.js was created during the development of https://speakworldlanguages.app

// Array to hold all ticking SuperTimeouts and SuperIntervals
const listOfAllTickingSuperTimers = [];

// SuperTimeout class
class SuperTimeout {
  constructor(callback, delay) {
    this.callback = callback;
    this.delay = delay;
    this.timerId = null;
    this.startTime = null;
    this.remainingTime = delay;
    this.isAlreadyPaused = false;
    this.isCompleted = false;

    this.start();

    // Automatically add the new SuperTimeout instance to the listOfAllTickingSuperTimers array
    listOfAllTickingSuperTimers.push(this); // Enlist
  }

  start() {
    this.startTime = Date.now();
    this.timerId = setTimeout(() => {
      this.isCompleted = true;
      this.remainingTime = 0;
      this.callback();
      this.getLost(); // Get removed from the listOfAllTickingSuperTimers array
    }, this.remainingTime);
  }

  pause() {
    if (this.isAlreadyPaused || this.isCompleted) {
      return; // Do nothing if already paused or completed
    }

    clearTimeout(this.timerId);
    const elapsedTime = Date.now() - this.startTime;
    this.remainingTime -= elapsedTime;
    this.isAlreadyPaused = true;
  }

  resume() {
    if (!this.isAlreadyPaused || this.isCompleted) {
      return; // Do nothing if not paused or completed
    }

    this.startTime = Date.now();
    this.timerId = setTimeout(() => {
      this.isCompleted = true;
      this.remainingTime = 0;
      this.callback();
      this.getLost(); // Get removed from the listOfAllTickingSuperTimers array
    }, this.remainingTime);
    this.isAlreadyPaused = false;
  }

  reset() {
    clearTimeout(this.timerId);
    this.startTime = null;
    this.remainingTime = this.delay;
    this.isAlreadyPaused = false;
    this.isCompleted = false;
  }

  restart() {
    this.reset();
    this.start();
    const index = listOfAllTickingSuperTimers.indexOf(this);
    if (index == -1) {
      listOfAllTickingSuperTimers.push(this); // Reenter the list if restart happens after clearance
    }
  }

  getLost() { // Submit resignation, quit and leave
    const index = listOfAllTickingSuperTimers.indexOf(this);
    if (index !== -1) {
      listOfAllTickingSuperTimers.splice(index, 1); // Remove self from the list
    }
  }

  clear() {
  	this.reset();
    this.getLost();
  }
}

// SuperInterval class
class SuperInterval extends SuperTimeout {
  constructor(callback, delay) {
    super(callback, delay);
  }
  // Override start() method of SuperTimeout
  start() {
    this.startTime = Date.now();
    this.timerId = setTimeout(() => {
      this.isCompleted = true;
      this.remainingTime = 0;
      this.callback();
      this.restart(); // Call restart to restart the timer
    }, this.remainingTime);
  }
  // Override resume() method of SuperTimeout
  resume() {
    if (!this.isAlreadyPaused || this.isCompleted) {
      return; // Do nothing if not paused or completed
    }

    this.startTime = Date.now();
    this.timerId = setTimeout(() => {
      this.isCompleted = true;
      this.remainingTime = 0;
      this.callback();
      this.restart(); // Call restart to restart the timer
    }, this.remainingTime);
    this.isAlreadyPaused = false;
  }
}

// Call these functions to PAUSE-UNPAUSE ALL SuperTimeout and SuperInterval instances
function pauseAllSuperTimers() {
	// Iterate through listOfAllTickingSuperTimers to pause all active SuperTimers
    for (const timer of listOfAllTickingSuperTimers) {
      timer.pause();
    }
}
function unpauseAllSuperTimers() {
	// Iterate through listOfAllTickingSuperTimers to unpause all active SuperTimers
    for (const timer of listOfAllTickingSuperTimers) {
      timer.resume();
    }
}
