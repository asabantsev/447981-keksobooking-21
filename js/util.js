'use strict';

window.util = (function () {
  return {
    DEBOUNCE_INTERVAL: 500,
    debounce: (fun) => {
      let lastTimeout = null;
      return function (...parameters) {
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          fun(...parameters);
        }, window.DEBOUNCE_INTERVAL);
      };
    }
  };
})();
