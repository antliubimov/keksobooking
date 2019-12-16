// map.js
'use strict';

(function() {
  let isPageActive = false;

  const PIN_SIZE = window.data.PIN_SIZE;
  const TAIL_HEIGHT = window.data.TAIL_HEIGHT;
  const MAIN_PIN = window.data.MAIN_PIN;
  const DRAG_LIMIT = window.data.DRAG_LIMIT;

  /**
   * Remove all pins on map
   */
  const removePins = () => {
    const pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(pin => {
      if (!pin.classList.contains('map__pin--main')) {
        pin.remove();
      }
    });
  };

  const map = document.querySelector('.map');
  const mapFilterSelects = document.querySelectorAll('.map__filter');
  const mapFilterFieldset = document.querySelector('.map__filter-set');

  const mapPinMain = document.querySelector('.map__pin--main');

  const MAIN_PIN_START_LOCATION = window.data.getLocation(mapPinMain);

  /**
   * Rendered pins when a response is OK
   * @param ads
   */
  const successHandler = (ads) => {
    document
      .querySelector('.map__pins')
      .appendChild(window.pin.renderPins(ads));

  };
  /**
   * Show error-message when a response is fail
   * @param errorMessage
   */
  const errorHandler = (errorMessage) => {
    const node = document.createElement('div');
    node.classList.add('error');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };
  /**
   * Remove error of connection
   */
  const removeError = () => {
    if (document.querySelector('.error')) {
      document.querySelector('.error').remove();
    }
  };
  /**
   * Activate filters of map
   */
  const activateMapFilters = () => {
    mapFilterSelects.forEach(mapFilter => (mapFilter.disabled = false));
    mapFilterFieldset.disabled = false;
  };
  /**
   * Activate a map
   */
  const activateMap = () => {
    map.classList.remove('map--faded');
    removeError();
    window.backend.load(successHandler, errorHandler);
    activateMapFilters();
  };

  /**
   * Puts the window in an active state
   */
  const activeState = () => {
    activateMap();
    window.form.activateForm();
    isPageActive = true;
  };

  /**
   * Deactivate filters of map
   */
  const deactivateMapFilters = () => {
    mapFilterSelects.forEach(mapFilter => (mapFilter.disabled = true));
    mapFilterFieldset.disabled = true;
  };

  /**
   * Deactivate a map in an inactive state
   */
  const deactivateMap = () => {
    map.classList.add('map--faded');
    mapPinMain.style.left = `${MAIN_PIN_START_LOCATION[0] -
      Math.round(window.data.MAIN_PIN.WIDTH / 2)}px`;
    mapPinMain.style.top = `${MAIN_PIN_START_LOCATION[1] -
      window.data.MAIN_PIN.HEIGHT -
      window.data.TAIL_HEIGHT}px`;
  };
  /**
   * Deactivate a state of map
   */
  const deactivateState = () => {
    removeError();
    removePins();
    deactivateMapFilters();
    deactivateMap();
    isPageActive = false;
  };
  /**
   * Drag-n-drop on mapPinMain
   * @param evt
   */
  const onMapPinMainMouseDown = evt => {
    evt.preventDefault();

    let startCoords = {
      x: evt.clientX,
      y: evt.clientY,
    };

    let dragged = false;

    const onMouseMove = moveEvt => {
      moveEvt.preventDefault();

      const shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      const mainPinPosition = {
        x: mapPinMain.offsetLeft - shift.x,
        y: mapPinMain.offsetTop - shift.y,
      };

      const BORDER = {
        top: DRAG_LIMIT.Y.MIN - MAIN_PIN.HEIGHT / 2 - TAIL_HEIGHT,
        bottom: DRAG_LIMIT.Y.MAX - MAIN_PIN.HEIGHT / 2 - TAIL_HEIGHT,
        left: DRAG_LIMIT.X.MIN - PIN_SIZE.WIDTH /2,
        right: DRAG_LIMIT.X.MAX + PIN_SIZE.WIDTH / 2,
      };

      if (mainPinPosition.y >= BORDER.top &&  mainPinPosition.y <= BORDER.bottom) {
      mapPinMain.style.top = `${mainPinPosition.y}px`;
      }
      if (mainPinPosition.x >= BORDER.left && mainPinPosition.x <= BORDER.right) {
        mapPinMain.style.left = `${mainPinPosition.x}px`;
      }
    };

    const onMouseUp = upEvt => {
      upEvt.preventDefault();

      if (!isPageActive) {
        activeState();
        window.form.activateFormListeners();
      }
      window.form.setAddress();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);

  return (window.map = {
    deactivateState,
    deactivateMap,
  });
})();
