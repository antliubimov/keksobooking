// map.js
'use strict';

(function() {
  let isPageActive = false;

  const { PIN_SIZE, TAIL_HEIGHT, MAIN_PIN, DRAG_LIMIT } = window.data;

  /**
   * Remove all pins on map
   */
  const removePins = () => {
    const pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(pin => pin.remove());
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
  const successHandler = ads => {
    window.map.ads = ads;
    window.pin.renderPins(ads);
  };

  /**
   * Activate filters of map
   */
  const activateMapFilters = () => {
    mapFilterSelects.forEach(mapFilter => (mapFilter.disabled = false));
    window.filters.initializeFilters();
    mapFilterFieldset.disabled = false;
  };
  /**
   * Activate a map
   */
  const activateMap = () => {
    map.classList.remove('map--faded');
    window.backend.load(successHandler, window.utils.errorHandler);
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
    window.filters.deactivateFilters();
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
    removePins();
    deactivateMapFilters();
    deactivateMap();
    isPageActive = false;
  };

  const Coordinate = function(x, y, constraints) {
    this.x = x;
    this.y = y;
    this._constraints = constraints;
  };

  Coordinate.prototype.setX = function(x) {
    if (x >= this._constraints.left && x <= this._constraints.right) {
      this.x = x;
    }
  };

  Coordinate.prototype.setY = function(y) {
    if (y >= this._constraints.top && y <= this._constraints.bottom) {
      this.y = y;
    }
  };

  const Rect = function(left, top, right, bottom) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  };

  /**
   * Drag-n-drop on mapPinMain
   * @param evt
   */
  const onMapPinMainMouseDown = evt => {
    evt.preventDefault();

    let startCoords = new Coordinate(evt.clientX, evt.clientY);

    let dragged = false;

    const onMouseMove = moveEvt => {
      moveEvt.preventDefault();

      dragged = true;

      const BORDER = new Rect(DRAG_LIMIT.X.MIN - PIN_SIZE.WIDTH / 2, DRAG_LIMIT.Y.MIN - MAIN_PIN.HEIGHT / 2 - TAIL_HEIGHT, DRAG_LIMIT.X.MAX + PIN_SIZE.WIDTH / 2, DRAG_LIMIT.Y.MAX - MAIN_PIN.HEIGHT / 2 - TAIL_HEIGHT);

      const shift = new Coordinate(startCoords.x - moveEvt.clientX, startCoords.y - moveEvt.clientY, BORDER);

      startCoords = new Coordinate(moveEvt.clientX, moveEvt.clientY, BORDER);

      const mainPinPosition = new Coordinate(mapPinMain.offsetLeft - shift.x, mapPinMain.offsetTop - shift.y, BORDER);

      mapPinMain.style.left = `${mainPinPosition.x}px`;
      mapPinMain.style.top = `${mainPinPosition.y}px`;
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

  window.map = {
    removePins,
    deactivateState,
    deactivateMap,
  };
})();
