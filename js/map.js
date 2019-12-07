// map.js
'use strict';

(function () {
  let isPageActive = false;

  /**
   * Remove card on a map
   */
  const removeMapCard = () => {
    const mapCard = document.querySelector('.map__card');
    if (mapCard) mapCard.remove();
  };


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
    document.querySelector('.map__pins').appendChild(window.pin.renderPins(window.data.ads));
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
    mapPinMain.style.left = `${MAIN_PIN_START_LOCATION[0] - Math.round(window.data.MAIN_PIN.WIDTH / 2)}px`;
    mapPinMain.style.top = `${MAIN_PIN_START_LOCATION[1] - window.data.MAIN_PIN.HEIGHT - window.data.TAIL_HEIGHT}px`;
    removePins();
    deactivateMapFilters();
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
      dragged = true;

      const shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY,
      };

      mapPinMain.style.top = `${mapPinMain.offsetTop - shift.y}px`;
      mapPinMain.style.left = `${mapPinMain.offsetLeft - shift.x}px`;
    };

    const onMouseUp = upEvt => {
      upEvt.preventDefault();

      if (dragged) {
        const onClickPreventDefault = evt => {
          evt.preventDefault();
          mapPinMain.removeEventListener('click', onClickPreventDefault);
        };
        mapPinMain.addEventListener('click', onClickPreventDefault);
      }

      if (isPageActive) {
        window.form.setAddress();
      } else {
        activeState();
        window.form.activateFormListeners();
        window.form.setAddress();
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);

  return window.map = {
    isPageActive,
    removeMapCard,
    deactivateMap
  };
})();


