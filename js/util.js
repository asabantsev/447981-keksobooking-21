'use strict';

(() => {
  const DEBOUNCE_INTERVAL = 500;

  const debounce = (fun) => {
    let lastTimeout = null;
    return function (...parameters) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun(...parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.util = {
    debounce
  };
})();
