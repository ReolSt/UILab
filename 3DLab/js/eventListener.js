class EventListener {
  constructor(eventTarget = document.body, eventTypes = []) {
    this.callbacks = {};
    eventTypes.forEach(eventType => {
      this.callbacks[eventType] = [];
    });

    this.eventTarget = eventTarget;

    if(this.eventTarget.addEventListener) {
      Object.keys(this.callbacks).forEach(eventType => {
        this.callbacks[eventType].forEach(callback => {
          this.eventTarget.addEventListener(eventType, callback);
        });
      });
    }
  }

  addEventListener(eventType, callbackArg) {
    this.callbacks[eventType].push(callbackArg);
  }

  removeEventListener(eventType, callbackArg) {
    this.callbacks[eventType].forEach((callback, index) => {
      if(callback === callbackArg) {
        this.callbacks[eventType].splice(index, 1);
      }
    });
  }

  dispatchEvent(eventType, eventObject) {
    this.callbacks[eventType].forEach(callback => {
      callback(eventObject);
    });
  }
}

class KeyBoardEventListener extends EventListener {
  constructor(eventTarget) {    
    super(eventTarget, ["keydown", "keyup", "keypress"]);
  }
}

class MouseEventListener extends EventListener {
  constructor(eventTarget) {
    super(eventTarget, ["mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "wheel"]);
  }
}

class UserInputEventListener extends EventListener {
  constructor(eventTarget) {
    super(eventTarget);
    
    this.keyBoardEventListeners = new KeyBoardEventListener(this.eventTarget);
    this.mouseEventListeners = new MouseEventListener(this.eventTarget);
  }
}

export { UserInputEventListener };