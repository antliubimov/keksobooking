// backend.js
'use strict';

(function() {
  const URL = 'https://js.dump.academy/keksobooking';
  /**
   * Create XHR
   * @param method
   * @param url
   * @param onLoad
   * @param onError
   * @param data
   */
  const createXHR = (method, url, onLoad, onError) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
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

    xhr.open(method, url);
    return xhr;
  };
  /**
   * Loading data from URL
   * @param {callback} onLoad
   * @param {callback} onError
   */
  const load = (onLoad, onError) => {
    const urlGet = `${URL}/data`;
    createXHR('GET', urlGet, onLoad, onError).send();
  };

  /**
   * Send data to URL
   * @param {data} data
   * @param {callback} onLoad
   * @param {callback} onError
   */
  const save = (data, onLoad, onError) => {
    createXHR('POST', URL, onLoad, onError).send(data);
  };

  window.backend = {
    load,
    save,
  };
})();
