export class Controls {
  eventListeners = {
    switch: event => {

    },

    mousedown: event => {

    },

    mouseup: event => {

    },

    mousemove: event => {

    },

    keydown: event => {
      
    },

    keyup: event => {

    },

    keypress: event => {

    },

    keypressframe: event => {

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