// supertimeout.js is released to the public domain as a courtesy of Manheart Earthman
// supertimeout.js was created during the development of https://speakworldlanguages.app

// Array to hold all ticking SuperTimeouts and SuperIntervals
var listOfAllTickingSuperTimers = [];

// SuperTimeout class
class SuperTimeout {
  constructor(callback, delay) {
    if (delay <= 0) {
      throw new Error("SuperTimer delay time must be greater than 0");
    }
    if (typeof callback !== 'function') {
      throw new Error("SuperTimer needs a valid callback function");
    }

    this.callback = callback; // Callback function to execute when timeout completes
    this.delay = delay; // Delay duration for the timeout
    this.timeoutID = null; // So that we can refer to the timeout. NOTE THAT this will immediately be overwritten by start()
    this.startTime = null; // So that we will take note when the timeout started. NOTE THAT this will immediately be overwritten by start()
    this.remainingTime = delay; // Remaining time for the timeout to complete
    this.isPaused = false; // Flag to track if timeout is already paused

    this._start(); // Start the timeout
    // Add the new SuperTimeout instance to the listOfAllTickingSuperTimers array
    listOfAllTickingSuperTimers.push(this); // Enlist

  } // END OF constructor

  // Method to create a setTimeout
  _set() { // This method better be private
    this.timeoutID = setTimeout(() => {
      this.timeoutID = null; // Indicates that the timer has completed or is reset and cleans up its reference
      this.remainingTime = 0;
      this.callback(); // Execute the callback function
      this._getLost(); // Remove the timeout from the list
    }, this.remainingTime);
    this.startTime = Date.now(); // Take note when the timeout started to be able to calculate the remaining time when pause() fires
    this.isPaused = false;
  }

  // Check if it is OK to start and call set() if it is
  _start() { // This method better be private
    if (this.timeoutID || this.startTime || this.remainingTime === 0) { // Prevent creation of redundant timeouts
      throw new Error("SuperTimeout is either already ticking or has completed"); // As long as the start() method stays private this should never show unless there is a bug in this js file
      // We don't need "return;" because we have "throw"
    }

    this._set();
  }

  // Pause if it is OK to pause
  pause() { top.console.log("pause() method of SuperTimeout fired while this.timeoutID = " + this.timeoutID);
    if (this.isPaused || !this.timeoutID) { top.console.log("Cannot pause the SuperTimeout because \n this.isPaused = " + this.isPaused + " OR !this.timeoutID = " + (!this.timeoutID));
      return; // Do nothing if is already paused or if has completed or is reset
    }

    clearTimeout(this.timeoutID);
    const elapsedTime = Date.now() - this.startTime; // Calculate how much time has passed to get ready for unpausing with the new remaining time value
    this.remainingTime -= elapsedTime;
    this.isPaused = true;
  }

  // Unpause if was paused
  resume() {
    if (!this.isPaused || !this.timeoutID) {
      return; // Do nothing if is not paused or if has completed or is reset
    }

    this._set(); // Note that here it is OK to omit this.isPaused = false; because _set() is called immediately
  }

  // Reset the timeout
  _reset() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      this.timeoutID = null; // Indicates that the timer has completed or is reset
    }

    this.startTime = null; // Will be set to Date.now() by start() // NOTE THAT we could use this as an alternative way to prevent pause() from firing on a reset timer instead of using this.timeoutID = null
    this.remainingTime = this.delay;
    this.isPaused = false;
    // SUPERTIMERS START TICKING AS SOON AS THEY ARE CREATED! » Therefore it is impossible to fire reset() before timer's first activation
    // -
    // What happens when a running timer is reset: It is stopped using clearTimeout and returned to its initial state, in this case
    // resume() will have no effect as (!this.isPaused || !this.timeoutID) will evaluate to (true || true)
    // pause() will have no effect as (this.isPaused || !this.timeoutID) will evaluate to (false || true)
    // start() will now be able to start the timer as this.remainingTime won't be 0 anymore (it was set to 0 when timer completed)
    // -
    // What happens when reset() fires when timer is paused: As this.timeoutID will still exist after pause() executes, reset() will try to clear the timer that has already been cleared. In JavaScript this is a safe practice.
    // NEVERTHELESS: Once reset() executes this.timeoutID will be null so neither pause() nor resume() will have any effect
    // start() will be able to take action as now this.startTime will be null
    // start() will now tick from the beginning as this.remainingTime value that was calculated by pause() will be discarded
    // -
    // What happens when start() fires after pause() but before reset() » This will have no effect as this.remainingTime will still be a nonzero value
    // -
    // What happens when reset() fires after the timer is complete: All properties will return back to their defaults
    // start() will be able to create a fresh new timeout which then will tick from the beginning
    // -
    // What happens when start() fires after the timer is complete i.e. without reset()
    // start() will have no effect as (this.remainingTime === 0 || this.startTime) will evaluate to (true || true)
    // Can this.remainingTime equal to 0 while this.startTime is null or false? As of April 2024 it looks like the answer is NO.
    // BECAUSE: Only the reset() method modifies this.startTime and sets it to null but at the same time it sets this.remainingTime back to this.delay which is a nonzero value
  }

  // Restart the timeout
  restart() {
    this._reset();
    this._start();

    const index = listOfAllTickingSuperTimers.indexOf(this);
    if (index === -1) { // Such a timer doesn't exist in the list » Because it has either completed or was cleared whichever made getLost() fire
      listOfAllTickingSuperTimers.push(this); // MUST: Reenter the list now that restart() has fired
    } else { // Such a timer already exists in the list » Because it is still ticking
      // Do nothing
    }
  }

  // Remove the timeout from the list
  _getLost() { // Method better be private
    const index = listOfAllTickingSuperTimers.indexOf(this);
    if (index !== -1) { // Check if it exists in the list
      listOfAllTickingSuperTimers.splice(index, 1); // Remove self from the list
    }
  }

  clear() {
  	this._reset();
    this._getLost();
  }
}

// STUDY EXTENDING AND OVERRIDING: https://javascript.info/class-inheritance#the-extends-keyword

// SuperInterval class
class SuperInterval extends SuperTimeout {
  // NOTE: Had we not added anything to the constructor, we could omit it » https://javascript.info/class-inheritance#overriding-constructor
  constructor(callback, delay) {
    super(callback, delay); // Note that: This would invoke the parent _start() if the local _start() didn't exist
    // Note that enlisting in listOfAllTickingSuperTimers is done via parent constructor using super() as soon as a new SuperInterval is created
    this.intervalID = null;
  }

  // OVERRIDE THE PARENT: Check if it is OK to start and call set() if it is
  _start() { // This method better be private
    // When is it OK to start the interval?
    if (this.intervalID) { // Only _reset() will set intervalID back to null » Until then _start cannot fire to create redundant intervals
      throw new Error("SuperInterval is already ticking or is paused");
      // We don't need "return;" because we have "throw"
    }

    this._set();
  }

  // OVERRIDE THE PARENT: Method to create a setInterval
  _set() { // This method better be private
    top.console.log("Overrider _set method of SuperInterval fired. Will now set the interval");
    this.intervalID = setInterval(() => {
      this.callback(); // Execute the callback function
      this.startTime = Date.now(); // Take note when the interval REstarted i.e. TICKED
    }, this.delay);

    this.startTime = Date.now(); // Take note when the interval first started
    this.isPaused = false;

    top.console.log("And now this.intervalID = " + this.intervalID);
  }

  // Pause if it is OK to pause
  pause() { top.console.log("Overrider pause method of SuperInterval fired");
    if (this.isPaused || !this.intervalID) { top.console.log("Cannot pause because this.isPaused = " + this.isPaused + " OR " + " !this.intervalID = " + (!this.intervalID));
      return; // Do nothing if is already paused or is reset
    }
    if (this.timeoutID) { clearTimeout(this.timeoutID); } // In case was paused and unpaused
    if (this.intervalID) { clearInterval(this.intervalID); top.console.log("interval is cleared"); } // In case has never been paused before

    const elapsedTime = Date.now() - this.startTime; // Calculate how much time has passed since start (t=0) or the last TICK
    this.remainingTime -= elapsedTime;
    this.isPaused = true;
  }

  // Unpause if was paused
  resume() {
    if (!this.isPaused || !this.intervalID) {
      return; // Do nothing if is not paused or is reset
    }

    this.timeoutID = setTimeout(function () {
      this.timeoutID = null;
      this.callback();
      this._set();
      this.remainingTime = this.delay;
    }, this.remainingTime);

    // Here in this case, since _set() IS NOT CALLED IMMEDIATELY we have to do the following
    this.startTime = Date.now(); // Take note when it was unpaused
    this.isPaused = false;
  }

  // super magic
  _reset() {
    super._reset(); // Perform the same resetting procedure in SuperTimeout
    if (this.intervalID) { // With the addition of the task of removing the interval
      clearInterval(this.intervalID);
      this.intervalID = null; // Indicates that the timer has completed or is reset
    }
  }

  // restart() _getLost() clear() will be identical so we don't override them
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
