class EventListener {
  constructor(eventTarget, eventTypes = []) {
    this.callbacks = {};
    this.callbackRunners = {};
    eventTypes.forEach(eventType => {
      this.callbacks[eventType] = [];
      this.callbackRunners[eventType] = event => {
        this.callbacks[eventType].forEach(callback => {
          callback(event);
        });
      }
    });

    this.eventTarget = eventTarget;

    if(this.eventTarget.addEventListener) {
      Object.keys(this.callbackRunners).forEach(eventType => {
        this.eventTarget.addEventListener(eventType, this.callbackRunners[eventType]);
      });
    }
  }

  attach(eventTarget) {
    if(this.eventTarget === eventTarget) {
      return;
    }

    this.detach();

    this.eventTarget = eventTarget;
    if(this.eventTarget.addEventListener) {
      this.eventTypes.forEach(eventType => {
        this.eventTarget.addEventListener(eventType, this.callbackRunners[eventType]);
      });
    }
  }

  detach() {
    this.eventTarget = undefined;
    if(this.eventTarget.removeEventListener) {
      this.eventTypes.forEach(eventType => {
        this.eventTarget.removeEventListener(eventType, this.callbackRunners[eventType]);
      });
    }
  }

  get eventTypes() {
    return Object.keys(this.callbacks);
  }

  addEventType(eventType) {
    if(this.callbacks[eventType]) {
      return;
    }

    this.callbacks[eventType] = [];
    this.callbackRunners[eventType] = event => {
      this.callbacks[eventType].forEach(callback => {
        callback(event);
      });
    }

    this.eventTarget.addEventListener(eventType, this.callbackRunners[eventType]);
  }

  addEventTypes(eventTypes) {
    eventTypes.forEach(eventType => {
      this.addEventType(eventType);
    });
  }

  removeEventType(eventType) {
    if(this.callbacks[eventType]) {
      this.eventTarget.removeEventListener(eventType, this.callbackRunners[eventType]);

      this.callbacks[eventType] = undefined;
      this.callbackRunners[eventType] = undefined;
    }
  }

  removeEventTypes(eventTypes) {
    eventTypes.forEach(eventType => {
      this.removeEventType(eventType);
    })
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
  static eventTypes = ["keydown", "keyup", "keypress"]
  constructor(eventTarget) {    
    super(eventTarget, KeyBoardEventListener.eventTypes);
  }
}

class MouseEventListener extends EventListener {
  static eventTypes = ["mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "wheel"];
  constructor(eventTarget) {
    super(eventTarget, MouseEventListener.eventTypes);
  }
}

class UserInputEventListener extends EventListener {
  constructor(eventTarget) {
    super(eventTarget);
    
    KeyBoardEventListener.eventTypes.forEach(eventType => {
      this.addEventType(eventType);
    });

    MouseEventListener.eventTypes.forEach(eventType => {
      this.addEventType(eventType);
    });
  }
}

export { UserInputEventListener };