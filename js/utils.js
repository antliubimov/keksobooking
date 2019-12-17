// utils.js
'use strict';

(function () {
  const ESC_KEY = 'Escape';
  /**
   *
   * @param min number
   * @param max number
   * @returns {number}
   */
  const getRandomNumber = (min, max) =>
    Math.abs(Math.round(min - 0.5 + Math.random() * (max - min + 1)));
  /**
   *
   * @param min number
   * @param max number
   * @returns {[]}
   */
  const getRandomArray = (min, max) => {
    const arr = [];
    while (arr.length < max) {
      const elem = getRandomNumber(min, max);
      if (!arr.includes(elem)) {
        arr.push(elem);
      }
    }
    return arr;
  };
  /**
   *
   * @param a array
   * @returns {*[]}
   */
  const shuffle = a => {
    const arr = [...a];
    let j;
    for (let i = arr.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
  };
  /**
   * Returns random key of object
   * @param obj
   * @returns {string}
   */
  const getRandomKey = obj => {
    const keys = Object.keys(obj);
    return keys[getRandomNumber(0, keys.length - 1)];
  };

  /**
   * Create random array from array
   * @param features
   * @returns {[]}
   */
  const randomFeatures = features => {
    const length = getRandomNumber(0, features.length);
    const arrNums = getRandomArray(0, length - 1);
    const featuresArr = [];
    for (let i = 0; i < arrNums.length; i += 1) {
      featuresArr.push(features[arrNums[i]]);
    }
    return featuresArr;
  };
  /**
   * Execute func when keydown Esc
   * @param evt
   * @param func
   */
  const escDown = (evt, func) => {
    if (evt.key === ESC_KEY) {
      func();
    }
  };

  /**
   * Remove error of connection
   */
  const removeError = () => {
    const errorMessage  = document.querySelector('.error-message');
    errorMessage.remove();
    errorMessage.removeEventListener('click', onErrorMessageClick);
    document.removeEventListener('keydown', onErrorMessageEscDown);
  };

  const onErrorMessageClick = () => {
    removeError();
  };

  const onErrorMessageEscDown = (evt) => {
    escDown(evt, removeError);
  };

  /**
   * Show error-message when a response is fail
   * @param errorMessage
   */
  const errorHandler = (errorMessage) => {
    const node = document.createElement('div');
    node.classList.add('error-message');
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
    node.addEventListener('click', onErrorMessageClick);
    document.addEventListener('keydown', onErrorMessageEscDown);
  };

  return window.utils = {
    getRandomNumber,
    getRandomArray,
    shuffle,
    getRandomKey,
    randomFeatures,
    escDown,
    errorHandler,
  };
})();
