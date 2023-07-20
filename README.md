# SuperTimeout-JS
Ever wished you could pause and unpause the ticking of all `setTimeout`s and `setInterval`s in your app?

With this javascript library you can replace them with `SuperTimeout`s and `SuperInterval`s and do just that.

## Examples
[See a demo of SuperTimeout, the pausable version of setTimeout](https://topraksoyearthmantsuchimoto.github.io/SuperTimeout-JS/index3.html)

[See a demo of SuperInterval, the pausable version of setInterval](https://topraksoyearthmantsuchimoto.github.io/SuperTimeout-JS/index2.html)

## Usage
Creating a SuperTimeout is very similar to creating a setTimeout. Just don't forget to start with the keyword « new »
```
new SuperTimeout(doSomething, 3000);
```
Note the same resemblance between SuperInterval and setInterval
```
new SuperInterval(doSomething, 3000);
```
Imagine that you have to keep chaining the timeouts like
```
function doSomething() {
  // ...
  console.log("First task complete!");  // Or maybe // alert("First task complete!");
  new SuperTimeout(doOneMoreThing, 5000);
  function doOneMoreThing() {
    // ...
    console.log("Second task complete!");  // Or maybe // alert("Second task complete!");
  }
}
```
In this case the chain of all timeouts and all intervals can easily be paused and unpaused by calling
* `pauseAllSuperTimers()`
and
* `unpauseAllSuperTimers()`

If you want to control individual timers, you must assign them to variables with names like so
```
const oneParticularTimer = new SuperTimeout(doSomething, 3000);
oneParticularTimer.clear(); // Stop the timer
```
See the source code for all available methods.

## Installation
Either get `supertimeout.js` and include it in your HTML
```
<script src="/the/path/to/supertimeout.js">/*Pausable timeouts and intervals*/</script>
```
or use a CDN: jsdelivr

