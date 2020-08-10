class Timer {
  constructor(durationInput, startButton, pauseButton, callbacks) {
    this.durationInput = durationInput;
    this.startButton = startButton;
    this.pauseButton = pauseButton;
    if (callbacks) {
      this.onStart = callbacks.onStart;
      this.onTick = callbacks.onTick;
      this.onComplete = callbacks.onComplete;
    }

    this.startButton.addEventListener("click", this.start);
    this.pauseButton.addEventListener("click", this.pause);
  }

  start = () => {
    if (this.onStart) {
      this.onStart(this.timeRemaining);
    }
    this.tick();
    this.timerID = setInterval(this.tick, 1000);
  };

  pause = () => {
    clearInterval(this.timerID);
  };

  tick = () => {
    if (this.timeRemaining === 0) {
      this.onComplete ? this.onComplete() : false;
      this.pause();
    } else {
      this.timeRemaining = (this.timeRemaining - 1).toFixed(2);
      this.onTick ? this.onTick(this.timeRemaining) : false;
    }
  };

  get timeRemaining() {
    return parseFloat(this.durationInput.value);
  }

  set timeRemaining(time) {
    this.durationInput.value = time;
  }
}
