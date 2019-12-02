"use strict";

let isPageActive = false;
const ESC_KEY = 'Escape';
const TAIL_HEIGHT = 16;
const PIN_SIZE = {
  WIDTH: 46,
  HEIGHT: 62,
};
const MAIN_PIN = {
  WIDTH: 62,
  HEIGHT: 84,
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
const getRandomKey = (obj) => {
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
var createPin = pin => {
  var pinElement = pinTemplate.cloneNode(true);
  var pinImg = pinElement.querySelector('img');

  pinElement.style.left = `${pin.location.x - PIN_SIZE.WIDTH / 2}px`;
  pinElement.style.top = `${pin.location.y - PIN_SIZE.HEIGHT}px`;
  pinImg.src = `${pin.author.avatar}`;
  pinImg.alt = `${pin.offer.title}`;

  var onPinElementClick = () => {
    removeMapCard();
    var adFragment = document.createDocumentFragment();
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
var createAd = adData => {
  var adElement = mapCardTemplate.cloneNode(true);

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

  var adCloseButton = adElement.querySelector('.popup__close');

  var closeAd = () => {
    adElement.remove();
    adCloseButton.removeEventListener('click', onAdCloseClick);
    document.removeEventListener('keydown', onAdElementEscPress);
  };

  var onAdCloseClick = () => closeAd();

  var onAdElementEscPress = evt => {
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
var createAdPhotos = (adElement, adData) => {
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
var createFeaturesFragment = (adElement, adData) => {
  var featuresList = [...adElement.querySelector('.popup__features').children];

  for (var featureLi of featuresList) {
    if (
      !adData.offer.features.includes(
        featureLi.classList[1].replace(/feature--/, ''),
      )
    ) {
      featureLi.style.display = 'none';
    }
  }
};

/**
 * Renders pins on the map
 * @param pins
 * @returns {DocumentFragment}
 */
const renderPins = pins => {
  let pinsFragment = document.createDocumentFragment();
  pins.forEach(pin => pinsFragment.appendChild(createPin(pin)));
  return pinsFragment;
};

const map = document.querySelector('.map');
const adForm = document.querySelector('.notice__form');
const adFormFieldsets = document.querySelectorAll('.form__element');
const mapFilterSelects = document.querySelectorAll('.map__filter');
const mapFilterFieldset = document.querySelector('.map__filter-set');
const inputAddress = document.querySelector('#address');
const mapPinMain = document.querySelector('.map__pin--main');

const MAIN_PIN_START_LOCATION = getLocation(mapPinMain);

/**
 * Puts the card in an active state
 */
var onMapPinMainActiveState = () => {
  map.classList.remove('map--faded');
  adForm.classList.remove('notice__form--disabled');
  document.querySelector('.map__pins').appendChild(renderPins(ads));
  activateAdFields();
  activateMapFilters();
  isPageActive = true;
};
/**
 * Remove all pins on map
 */
var removePins = () => {
  var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  pins.forEach(pin => {
    if (!pin.classList.contains('map__pin--main')) {
      pin.remove();
    }
  });
};

var activateMapFilters = () => {
  mapFilterSelects.forEach(mapFilter => (mapFilter.disabled = false));
  mapFilterFieldset.disabled = false;
};

var deactivateMapFilters = () => {
  mapFilterSelects.forEach(mapFilter => (mapFilter.disabled = true));
  mapFilterFieldset.disabled = true;
};

var activateAdFields = () => {
  adFormFieldsets.forEach(fieldset => (fieldset.disabled = false));
};

var deactivateAdFields = () => {
  adFormFieldsets.forEach(fieldset => (fieldset.disabled = true));
};

/**
 * Puts the card in an inactive state
 */
var onMapPinMainDeactivateState = () => {
  map.classList.add('map--faded');
  adForm.classList.add('notice__form--disabled');
  [mapPinMain.style.left, mapPinMain.style.top] = MAIN_PIN_START_LOCATION;
  removePins();
  deactivateMapFilters();
  deactivateAdFields();
  isPageActive = false;
};

var onMapPinMainWatchAddress = () => {
  inputAddress.value = `${getLocation(mapPinMain).join(', ')}`;
};

var onMapPinMainMouseUp = () => {
  if (isPageActive) {
    onMapPinMainWatchAddress();
  } else {
    onMapPinMainActiveState();
    onMapPinMainWatchAddress();
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

const formTitle = document.querySelector('#title');
const formAddress = document.querySelector('#address');
const formHouseType = document.querySelector('#type');
const formPrice = document.querySelector('#price');
const formTimein = document.querySelector('#timein');
const formTimeout = document.querySelector('#timeout');
const formRoomNumber = document.querySelector('#room_number');
const formCapacity = document.querySelector('#capacity');
const formSubmitButton = document.querySelector('.form__submit');
const formResetButton = document.querySelector('.form__reset');

/**
 * Change on title of ad-form
 * @param evt
 */
const onFormTitleInput = evt => {
  const title = evt.target.value;
  if (title.length < TITLE_LENGTH.MIN && title.length > TITLE_LENGTH.MAX) {
    formTitle.setCustomValidity(
      'Заголовок объявление должен быть не менее 30 и не более 100 символов',
    );
  }
};
formTitle.addEventListener('change', onFormTitleInput);
/**
 * Change on price of ad-form
 * @param evt
 */
const onFormPriceChange = evt => {
  const minPrice = houseTypeMinPrice[formHouseType.value];

  if (evt.target.value < minPrice) {
    formPrice.setCustomValidity(
      `Для ${
        TYPE[formHouseType.value]
      } цена за ночь не может быть меньше ${minPrice}`,
    );
  } else if (evt.target.value > maxPrice) {
    formPrice.setCustomValidity(
      `Цена за ночь не может быть больше ${maxPrice}`,
    );
  } else {
    formPrice.setCustomValidity('');
  }
};

formPrice.addEventListener('change', onFormPriceChange);
/**
 * When change type of houses, then change min-price
 * @param evt
 */
const onFormHouseTypeChange = evt => {
  const minPrice = houseTypeMinPrice[evt.target.value];
  formPrice.min = minPrice;
  formPrice.placeholder = minPrice;
};
formHouseType.addEventListener('change', onFormHouseTypeChange);

/**
 * Sync change adFormTimein and adFormTimeout
 * @param evt
 */
const onFormTime = evt => {
  const formTime = evt.target === formTimein ? formTimeout : formTimein;
  const time = evt.target.value;
  const options = [...formTime.options];
  options.forEach(option => {
    if (option.value === time) {
      // eslint-disable-next-line no-param-reassign
      option.selected = true;
    }
  });
};
formTimein.addEventListener('change', onFormTime);
formTimeout.addEventListener('change', onFormTime);

const onFormRoomNumber = () => {

};
formRoomNumber.addEventListener('change', onFormRoomNumber);
