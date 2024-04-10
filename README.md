# SuperTimeout-JS
Ever wished you could pause and unpause the ticking of all `setTimeout`s and `setInterval`s in your app?

With this javascript library you can replace them with `SuperTimeout`s and `SuperInterval`s and do just that.

## Examples
[See a demo of SuperTimeout, the pausable version of setTimeout](https://topraksoyearthmantsuchimoto.github.io/SuperTimeout-JS/index3.html) (See index3.html)

[See a demo of SuperInterval, the pausable version of setInterval](https://topraksoyearthmantsuchimoto.github.io/SuperTimeout-JS/index2.html) (See index2.html)

## Usage
Creating a SuperTimeout is very similar to creating a setTimeout. Just don't forget to start with the keyword « new ».
```
new SuperTimeout(doSomething, 3000);
```
Note the same resemblance between SuperInterval and setInterval.
```
new SuperInterval(doSomething, 3000);
```
If you just had to keep chaining the timeouts like,
```
new SuperTimeout(doSomething, 3000);
function doSomething() {
  console.log("First task complete!");
  new SuperTimeout(doOneMoreThing, 5000);
}
function doOneMoreThing() {
  console.log("Second task complete!");
  new SuperTimeout(doTheNextOtherThing, 5000);
}
function doTheNextOtherThing() {
  console.log("Third task complete!");
  // You get the idea...
}
```
You could pause the chain of all timeouts and all intervals easily and unpause as well by calling
* `pauseAllSuperTimers()`
and
* `unpauseAllSuperTimers()`

That is, of course, no matter how long the chain is.

If you want to control individual timers, you must assign them to variables with names like so
```
const oneParticularTimer = new SuperTimeout(doSomething, 3000);
```
as this will allow you to use methods on any given timer, like
`oneParticularTimer.pause();`
or
`oneParticularTimer.resume();`
or
`oneParticularTimer.clear();`

See the [source code](https://github.com/TopraksoyEarthmanTsuchimoto/SuperTimeout-JS/blob/main/supertimeout.js) for all available methods.
#### About clearing timeouts and intervals
The `.clear()` method works both with `SuperTimeout` and `SuperInterval` timers.
What you must be careful about is,
* `clearTimeout(myTimeout)` and `clearInterval(myInterval)` _do not throw any errors_ if `myTimeout` or `myInterval` is `undefined`,
* `myTimeout.clear()` or `myInterval.clear()` _will throw an error_ if `myTimeout` or `myInterval` is `undefined`.
## Installation
Either get `supertimeout.js` and include it in your HTML like,
```
<script src="/the/path/to/supertimeout.js">/*Pausable timeouts and intervals*/</script>
```
or use a CDN like,

https://cdn.jsdelivr.net/gh/TopraksoyEarthmanTsuchimoto/SuperTimeout-JS@main/supertimeout.js
## Developers
You may create a fork of this repository.
