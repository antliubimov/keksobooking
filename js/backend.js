// backend.js
'use strict';

(function() {
  const URL = 'https://js.dump.academy/keksobooking';
  /**
   * Loading data from URL
   * @param {callback} onLoad
   * @param {callback} onError
   */
  const load = (onLoad, onError) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    const urlGet = `${URL}/data`;

    xhr.addEventListener('load', function() {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError(`Response's status: ${xhr.status} ${xhr.statusText}`);
      }
    });

    xhr.addEventListener('error', function() {
      onError('Connection error occurred');
    });
    xhr.addEventListener('timeout', function() {
      onError(`The request did not succeed in ${xhr.timeout} ms`);
    });
    xhr.timeout = 10000;

    xhr.open('GET', urlGet);
    xhr.send();
  };

  /**
   * Send data to URL
   * @param {data} data
   * @param {callback} onLoad
   * @param {callback} onError
   */
  const save = (data, onLoad, onError) => {};

  window.backend = {
    load,
    save
  };
})();
