class Controls {
  eventListeners = {
    switch: () => {

    },

    mousedown: event => {

    },

    mouseup: event => {

    },

    mousemove: event => {

    },

    wheel: event => {

    },

    keydown: event => {
      
    },

    keyup: event => {

    },

    keypress: event => {

    },

    keypressframe: () => {

    }
  }

  attach() {
    Object.keys(this.eventListeners).forEach(eventType => {
      document.body.addEventListener(eventType, this.eventListeners[eventType]);
    });
  }

  detach() {
    Object.keys(this.eventListeners).forEach(eventType => {
      document.body.removeEventListener(eventType, this.eventListeners[eventType]);
    });
  }
}

export { Controls };