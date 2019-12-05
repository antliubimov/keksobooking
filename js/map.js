'use strict';

let isPageActive = false;
const ESC_KEY = 'Escape';
const TAIL_HEIGHT = 16;
const PIN_SIZE = {
  WIDTH: 44,
  HEIGHT: 44,
};
const MAIN_PIN = {
  WIDTH: 65,
  HEIGHT: 65,
};

const getLocation = element => {
  return [element.offsetLeft, element.offsetTop];
};

const DRAG_LIMIT = {
  X: {
    MIN: PIN_SIZE.WIDTH / 2,
    MAX: 1200 - PIN_SIZE.WIDTH / 2,
  },
  Y: {
    MIN: 130,
    MAX: 630,
  },
};
const TITLE = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде',
];
const TYPE = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalow: 'Бунгало',
};
const IN_OUT = ['12:00', '13:00', '14:00'];
const FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];
const PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
];

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

const avatarNums = shuffle([1, 2, 3, 4, 5, 6, 7, 8]);
const randomTitleNums = shuffle([0, 1, 2, 3, 4, 5, 6, 7]);
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
 * Create array of ads
 * @returns {[]}
 */
const createAds = () => {
  const adsArr = [];

  for (let i = 0; i < 8; i += 1) {
    const x = getRandomNumber(DRAG_LIMIT.X.MIN, DRAG_LIMIT.X.MAX);
    const y = getRandomNumber(DRAG_LIMIT.Y.MIN, DRAG_LIMIT.Y.MAX);

    const ad = {
      author: {
        avatar: `img/avatars/user0${avatarNums[i]}.png`,
      },
      offer: {
        title: TITLE[randomTitleNums[i]],
        address: `${x}, ${y}`,
        price: getRandomNumber(1000, 1000000),
        type: TYPE[getRandomKey(TYPE)],
        rooms: getRandomNumber(1, 5),
        guests: getRandomNumber(1, 10),
        checkin: IN_OUT[getRandomNumber(0, IN_OUT.length - 1)],
        checkout: IN_OUT[getRandomNumber(0, IN_OUT.length - 1)],
        features: randomFeatures(FEATURES),
        description: '',
        photos: shuffle(PHOTOS),
      },
      location: {
        x,
        y,
      },
    };

    adsArr.push(ad);
  }

  return adsArr;
};

const ads = createAds();

const template = document.querySelector('template');
const pinTemplate = template.content.querySelector('.map__pin');
const mapCardTemplate = template.content.querySelector('.map__card');

/**
 * Create pin-element
 * @param pin
 * @returns {Node}
 */
const createPin = pin => {
  const pinElement = pinTemplate.cloneNode(true);
  const pinImg = pinElement.querySelector('img');

  pinElement.style.left = `${pin.location.x - PIN_SIZE.WIDTH / 2}px`;
  pinElement.style.top = `${pin.location.y - PIN_SIZE.HEIGHT - TAIL_HEIGHT}px`;
  pinImg.src = `${pin.author.avatar}`;
  pinImg.alt = `${pin.offer.title}`;

  const onPinElementClick = () => {
    removeMapCard();
    const adFragment = document.createDocumentFragment();
    adFragment.appendChild(createAd(pin));
    document.querySelector('.map__filters-container').before(adFragment);
  };

  pinElement.addEventListener('click', onPinElementClick);

  return pinElement;
};

const removeMapCard = () => {
  const mapCard = document.querySelector('.map__card');
  if (mapCard) mapCard.remove();
};

/**
 * Create Ad from template
 * @param adData
 * @returns {Node}
 */
const createAd = adData => {
  const adElement = mapCardTemplate.cloneNode(true);

  adElement.querySelector('.popup__avatar').src = `${adData.author.avatar}`;
  adElement.querySelector(
    '.popup__title',
  ).textContent = `${adData.offer.title}`;
  adElement.querySelector(
    '.popup__text--address',
  ).textContent = `${adData.offer.address}`;
  adElement.querySelector(
    '.popup__price',
  ).textContent = `${adData.offer.price}₽/ночь`;
  adElement.querySelector('.popup__type').textContent = `${adData.offer.type}`;
  adElement.querySelector(
    '.popup__text--capacity',
  ).textContent = `${adData.offer.rooms} комнаты для ${adData.offer.guests} гостей`;
  adElement.querySelector(
    '.popup__text--time',
  ).textContent = `Заезд послу ${adData.offer.checkin}, выезд до ${adData.offer.checkout}`;
  adElement.querySelector(
    '.popup__description',
  ).textContent = `${adData.offer.description}`;

  createFeaturesFragment(adElement, adData);
  createAdPhotos(adElement, adData);

  const adCloseButton = adElement.querySelector('.popup__close');

  const closeAd = () => {
    adElement.remove();
    adCloseButton.removeEventListener('click', onAdCloseClick);
    document.removeEventListener('keydown', onAdElementEscPress);
  };

  const onAdCloseClick = () => closeAd();

  const onAdElementEscPress = evt => {
    if (evt.key === ESC_KEY) {
      closeAd();
    }
  };

  adCloseButton.addEventListener('click', onAdCloseClick);
  document.addEventListener('keydown', onAdElementEscPress);

  return adElement;
};
/**
 * Create ad's photos gallery
 * @param adElement
 * @param adData
 */
const createAdPhotos = (adElement, adData) => {
  const photos = adElement.querySelector('.popup__pictures');

  adData.offer.photos.forEach(photo => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = photo;
    img.width = 45;
    img.height = 40;
    li.appendChild(img);
    li.classList.add('popup__picture');
    photos.appendChild(li);
  });
};
/**
 * Create fragment of Features
 * @param adElement
 * @param adData
 */
const createFeaturesFragment = (adElement, adData) => {
  const featuresList = [
    ...adElement.querySelector('.popup__features').children,
  ];

  featuresList.forEach(featureItem => {
    if (
      !adData.offer.features.includes(
        featureItem.classList[1].replace(/feature--/, ''),
      )
    ) {
      featureItem.style.display = 'none';
    }
  });
};

/**
 * Renders pins on the map
 * @param pins
 * @returns {DocumentFragment}
 */
const renderPins = pins => {
  const pinsFragment = document.createDocumentFragment();
  pins.forEach(pin => pinsFragment.appendChild(createPin(pin)));
  return pinsFragment;
};

const map = document.querySelector('.map');
const adForm = document.querySelector('.notice__form');
const formFieldSets = document.querySelectorAll('.form__element');
const mapFilterSelects = document.querySelectorAll('.map__filter');
const mapFilterFieldset = document.querySelector('.map__filter-set');
const inputAddress = document.querySelector('#address');
const mapPinMain = document.querySelector('.map__pin--main');

const MAIN_PIN_START_LOCATION = getLocation(mapPinMain);

const activateMap = () => {
  map.classList.remove('map--faded');
  document.querySelector('.map__pins').appendChild(renderPins(ads));
  activateMapFilters();
};
const activateForm = () => {
  adForm.classList.remove('notice__form--disabled');
  activateAdFields();
};

/**
 * Puts the card in an active state
 */
const onMapPinMainActiveState = () => {
  activateMap();
  activateForm();
  isPageActive = true;
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
/**
 * Activate filters of map
 */
const activateMapFilters = () => {
  mapFilterSelects.forEach(mapFilter => (mapFilter.disabled = false));
  mapFilterFieldset.disabled = false;
};
/**
 * Deactivate filters of map
 */
const deactivateMapFilters = () => {
  mapFilterSelects.forEach(mapFilter => (mapFilter.disabled = true));
  mapFilterFieldset.disabled = true;
};
/**
 * Activate fields of ad-form
 */
const activateAdFields = () => {
  formFieldSets.forEach(fieldset => (fieldset.disabled = false));
};
/**
 * Deactivate fields of ad-form
 */
const deactivateAdFields = () => {
  formFieldSets.forEach(fieldset => {
    fieldset.disabled = true;
    unhighlightInvalidInput(fieldset.elements[0]);
  });
};

/**
 * Deactivate the card in an inactive state
 */
const deactivateMap = () => {
  map.classList.add('map--faded');
  [mapPinMain.style.left, mapPinMain.style.top] = MAIN_PIN_START_LOCATION;
  removePins();
  deactivateMapFilters();
};

const deactivateForm = () => {
  adForm.reset();
  adForm.classList.add('notice__form--disabled');
  deactivateAdFields();
//  window.loadImage.deactivate();
//  window.loadImage.remove();

};

const setAddress = () => {
  inputAddress.value = `${getLocation(mapPinMain).join(', ')}`;
};

const onMapPinMainMouseUp = () => {
  if (isPageActive) {
    setAddress();
  } else {
    onMapPinMainActiveState();
    setAddress();
    activateFormListeners();
  }
};

mapPinMain.addEventListener('mouseup', onMapPinMainMouseUp);

/*
 * Validation of form
 * */
const TITLE_LENGTH = {
  MIN: 30,
  MAX: 100,
};

const maxPrice = 1000000;
const houseTypeMinPrice = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};
const forEvent = {
  rooms: '100',
  guests: '0',
};

const formTitle = document.querySelector('#title');
const formAddress = document.querySelector('#address');
const formHouseType = document.querySelector('#type');
const formPrice = document.querySelector('#price');
const formTimeIn = document.querySelector('#timein');
const formTimeOut = document.querySelector('#timeout');
const formRoomNumber = document.querySelector('#room_number');
const formCapacity = document.querySelector('#capacity');
const formSubmitButton = document.querySelector('.form__submit');
const formResetButton = document.querySelector('.form__reset');

const highlightInvalidInput = (formInput) => {
  formInput.classList.add('input--invalid');
};
const unhighlightInvalidInput = (formInput) => {
  if (formInput.classList.contains('input--invalid')) {
    formInput.classList.remove('input--invalid');
  }
};
/**
 * Toggle highlight on invalid element
 * @param evt event
 * @param element Node
 * @param min number
 * @param max number
 */
const toggleLightInvalidElement = (evt, element, min, max) => {
  const {value} = evt.target;
  if (value < min || value > max) {
    highlightInvalidInput(element);
  } else {
    unhighlightInvalidInput(element);
  }
};
/**
 * Change on title of ad-form
 * @param evt
 */
const onFormTitleInput = evt => {
  toggleLightInvalidElement(evt, formTitle, TITLE_LENGTH.MIN, TITLE_LENGTH.MAX);
};
/**
 * When change type of houses, then change min-price
 */
const onFormHouseTypeChange = () => {
  const minPrice = houseTypeMinPrice[formHouseType.value];
  formPrice.min = minPrice;
  formPrice.placeholder = minPrice;
  return minPrice;
};
/**
 * Change on price of ad-form
 * @param evt
 */
const onFormPriceChange = evt => {
  const minPrice = onFormHouseTypeChange();
  toggleLightInvalidElement(evt, formPrice, minPrice, maxPrice);
};

/**
 * Sync change formTimeIn and adFormTimeout
 * @param evt
 */
const onFormTime = evt => {
  const formTime = evt.target === formTimeIn ? formTimeOut : formTimeIn;
  formTime.value = evt.target.value;
};

/**
 * Monitored compliance number of rooms and number of guests
 */
const onFormRoomNumber = () => {
  const rooms = formRoomNumber.value;
  const guests = formCapacity.value;

  if (rooms === forEvent.rooms && guests !== forEvent.guests) {
    formRoomNumber.setCustomValidity(
      `При выборе 100 комнат можно выбрать только вариант "не для гостей"`,
    );
    highlightInvalidInput(formRoomNumber);
  } else if (rooms !== forEvent.rooms && guests === forEvent.guests) {
    formRoomNumber.setCustomValidity(
      `Для ${rooms} ${
        rooms === '1' ? 'комнаты' : 'комнат'
      } не может быть количество мест "не для гостей"`,
    );
    highlightInvalidInput(formRoomNumber);
  } else if (rooms < guests) {
    formRoomNumber.setCustomValidity(
      `Количество комнат должно быть больше или равно количеству гостей`,
    );
    highlightInvalidInput(formRoomNumber);
  } else {
    formRoomNumber.setCustomValidity(``);
    unhighlightInvalidInput(formRoomNumber);
  }
};
/**
 * Deactivate form when click on reset-button
 */
const onFormResetButton = (evt) => {
  evt.preventDefault();
  deactivateMap();
  deactivateForm();
  removeFormListeners();
  isPageActive = false;
};

const activateFormListeners = () => {
  formTitle.addEventListener('input', onFormTitleInput);
  formPrice.addEventListener('change', onFormPriceChange);
  formHouseType.addEventListener('change', onFormHouseTypeChange);
  formTimeIn.addEventListener('change', onFormTime);
  formTimeOut.addEventListener('change', onFormTime);
  formSubmitButton.addEventListener('click', onFormRoomNumber);
  formResetButton.addEventListener('click', onFormResetButton);
};

const removeFormListeners = () => {
  formTitle.removeEventListener('input', onFormTitleInput);
  formPrice.removeEventListener('change', onFormPriceChange);
  formHouseType.removeEventListener('change', onFormHouseTypeChange);
  formTimeIn.removeEventListener('change', onFormTime);
  formTimeOut.removeEventListener('change', onFormTime);
  formSubmitButton.removeEventListener('click', onFormRoomNumber);
  formResetButton.removeEventListener('click', onFormResetButton);
};


// handle mapPinMain

mapPinMain.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var dragged = false;

  var onMouseMove = (moveEvt) => {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
    mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
  };

  var onMouseUp = (upEvt) => {
    upEvt.preventDefault();

    if (dragged) {
      var onClickPreventDefault = function (evt) {
        evt.preventDefault();
        mapPinMain.removeEventListener('click', onClickPreventDefault)
      };
      mapPinMain.addEventListener('click', onClickPreventDefault);
    }

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});



