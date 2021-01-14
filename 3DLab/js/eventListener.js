class EventListener {
  constructor(eventTarget = document.body, eventTypes = []) {
    this.callbacks = {};
    eventTypes.forEach(eventType => {
      this.callbacks[eventType] = [];
    });

    this.eventTarget = eventTarget;

    if(this.eventTarget.addEventListener) {
      Object.keys(this.callbacks).forEach(eventType => {
        this.eventTarget.addEventListener(eventType, event => {
          this.callbacks[eventType].forEach(callback => {
            callback(event);
          });
        });
      });
    }
  }

  addEventType(eventType) {
    if(this.callbacks[eventType]) {
      return;
    }

    this.callbacks[eventType] = [];
    this.eventTarget.addEventListener(eventType, event => {
      this.callbacks[eventType].forEach(callback => {
        callback(event);
      });
    });
  }

  removeEventType(eventType) {
    this.callbacks[eventType] = undefined;
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
    
    Object.keys(new KeyBoardEventListener(this.eventTarget).callbacks).forEach(eventType => {
      this.addEventType(eventType);
    });

    Object.keys(new MouseEventListener(this.eventTarget).callbacks).forEach(eventType => {
      this.addEventType(eventType);
    });
  }
}

export { UserInputEventListener };