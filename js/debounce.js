// debounce.js
'use strict';

(function() {
  const DEBOUNCE_INTERVAL = 500;

  window.debounce = fn => {
    let lastTimeout = null;

    return function() {
      let args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function() {
        fn.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };
})();
