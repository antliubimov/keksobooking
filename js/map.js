'use strict';
var isPageActive = false;
var ESC_KEY = 'Escape';
var TAIL_HEIGHT = 16;
var PIN_SIZE = {
  WIDTH: 46,
  HEIGHT: 62
};
var MAIN_PIN = {
  WIDTH: 62,
  HEIGHT: 84,
};

var getLocation = (element) => {
    return [element.offsetLeft, element.offsetTop];
};

var DRAG_LIMIT = {
  X: {
    MIN: PIN_SIZE.WIDTH / 2,
    MAX: 1200 - PIN_SIZE.WIDTH / 2
  },
  Y: {
    MIN: 130,
    MAX: 630
  }
};
var TITLE = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var TYPE = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalow: 'Бунгало'
};
var IN_OUT = ['12:00', '13:00', '14:00'];
var FEATURES = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
var PHOTOS = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg" , "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];

/**
 *
 * @param min number
 * @param max number
 * @returns {number}
 */
var getRandomNumber = (min, max) => Math.abs(Math.round(min - 0.5 + Math.random()*(max - min + 1)));
/**
 *
 * @param min number
 * @param max number
 * @returns {[]}
 */
var getRandomArray = (min, max) => {
  var arr = [];
  while (arr.length < max) {
    var elem = getRandomNumber(min, max);
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
var shuffle = (a) => {
  var arr = [...a];
  var j;
  for (var i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random()*(i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
};
/**
 * Returns random key of object
 * @param obj
 * @returns {string}
 */
var getRandomKey = function (obj) {
  var keys = Object.keys(obj);
  return keys[getRandomNumber(0, keys.length - 1)];
};

var avatarNums = shuffle([1,2,3,4,5,6,7,8]);
var randomTitleNums = shuffle([0,1,2,3,4,5,6,7]);
/**
 * Create random array from array
 * @param features
 * @returns {[]}
 */
var randomFeatures = (features) => {
  var length = getRandomNumber(0, features.length);
  var arrNums = getRandomArray(0, length - 1);
  var featuresArr = [];
  for (let i = 0; i < arrNums.length; i++) {
    featuresArr.push(features[arrNums[i]]);
  }
  return  featuresArr;
};
/**
 * Create array of ads
 * @returns {[]}
 */
var createAds = () => {
  var adsArr = [];

  for (var i = 0; i < 8; i++) {
  var x = getRandomNumber(DRAG_LIMIT.X.MIN, DRAG_LIMIT.X.MAX),
      y = getRandomNumber(DRAG_LIMIT.Y.MIN,
          DRAG_LIMIT.Y.MAX);

    var ad = {
      "author": {
        "avatar": `img/avatars/user0${avatarNums[i]}.png`,
      },
      "offer": {
        "title": TITLE[randomTitleNums[i]],
        "address": `${x}, ${y}`,
        "price": getRandomNumber(1000, 1000000),
        "type": TYPE[getRandomKey(TYPE)],
        "rooms": getRandomNumber(1, 5),
        "guests": getRandomNumber(1, 10),
        "checkin": IN_OUT[getRandomNumber(0, IN_OUT.length - 1)],
        "checkout": IN_OUT[getRandomNumber(0, IN_OUT.length - 1)],
        "features": randomFeatures(FEATURES),
        "description": "",
        "photos": shuffle(PHOTOS),
      },
      "location": {
        "x": x,
        "y": y
      },
    };

    adsArr.push(ad);
  }

  return adsArr;
};

var ads = createAds();

var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var mapCardTemplate = template.content.querySelector('.map__card');

/**
 * Create pin-element
 * @param pin
 * @returns {Node}
 */
var createPin = (pin) => {
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

var removeMapCard = () => {
  var mapCard = document.querySelector('.map__card');
  if (mapCard) mapCard.remove();
};

/**
 * Create Ad from template
 * @param adData
 * @returns {Node}
 */
var createAd = (adData) => {
  var adElement = mapCardTemplate.cloneNode(true);

  adElement.querySelector('.popup__avatar').src = `${adData.author.avatar}`;
  adElement.querySelector('.popup__title').textContent = `${adData.offer.title}`;
  adElement.querySelector('.popup__text--address').textContent = `${adData.offer.address}`;
  adElement.querySelector('.popup__price').textContent = `${adData.offer.price}₽/ночь`;
  adElement.querySelector('.popup__type').textContent = `${adData.offer.type}`;
  adElement.querySelector('.popup__text--capacity').textContent = `${adData.offer.rooms} комнаты для ${adData.offer.guests} гостей`;
  adElement.querySelector('.popup__text--time').textContent = `Заезд послу ${adData.offer.checkin}, выезд до ${adData.offer.checkout}`;
  adElement.querySelector('.popup__description').textContent = `${adData.offer.description}`;

  createFeaturesFragment(adElement, adData);
  createAdPhotos(adElement, adData);

  var adCloseButton = adElement.querySelector('.popup__close');

  var closeAd = () => {
    adElement.remove();
    adCloseButton.removeEventListener('click', onAdCloseClick);
    document.removeEventListener('keydown', onAdElementEscPress);
  };

  var onAdCloseClick = () => closeAd();

  var onAdElementEscPress = (evt) => {
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
  var photos = adElement.querySelector('.popup__pictures');

  adData.offer.photos.forEach(photo => {
    var li = document.createElement('li');
    var img = document.createElement('img');
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
    if (!adData.offer.features.includes(featureLi.classList[1].replace(/feature--/, ''))) {
      featureLi.style.display = 'none';
    }
  }
};

/**
 * Renders pins on the map
 * @param pins
 * @returns {DocumentFragment}
 */
var renderPins = (pins) => {
  var pinsFragment = document.createDocumentFragment();
  pins.forEach(pin => pinsFragment.appendChild(createPin(pin)));
  return pinsFragment;
};

var map = document.querySelector('.map');
var adForm = document.querySelector('.notice__form');
var adFormFieldsets = document.querySelectorAll('.form__element');
var mapFilterSelects = document.querySelectorAll('.map__filter');
var mapFilterFieldset = document.querySelector('.map__filter-set');
var inputAddress = document.querySelector('#address');
var mapPinMain = document.querySelector('.map__pin--main');

var MAIN_PIN_START_LOCATION = getLocation(mapPinMain);


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
  mapFilterSelects.forEach(mapFilter => mapFilter.disabled = false);
  mapFilterFieldset.disabled = false;
};

var deactivateMapFilters = () => {
  mapFilterSelects.forEach(mapFilter => mapFilter.disabled = true);
  mapFilterFieldset.disabled = true;
};

var activateAdFields = () => {
  adFormFieldsets.forEach(fieldset => fieldset.disabled = false);
};

var deactivateAdFields = () => {
  adFormFieldsets.forEach(fieldset => fieldset.disabled = true);
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
var TITLE_LENGTH = {
  MIN: 30,
  MAX: 100
};

var maxPrice = 1000000;
var houseTypeMinPrice = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};


var adFormTitle = document.querySelector('#title');
var adFormAddress = document.querySelector('#address');
var adFormHouseType = document.querySelector('#type');
var adFormPrice = document.querySelector('#price');
var adFormTimein = document.querySelector('#timein');
var adFormTimeout = document.querySelector('#timeout');
var adFormRoomNumber = document.querySelector('#room_number');
var adFormCapacity = document.querySelector('#capacity');
var adSubmitButton = document.querySelector('.form__submit');
var adResetButton = document.querySelector('.form__reset');


var onAdFormTitleInput = (evt) => {
  var title = evt.target.value;
  if (title.length < TITLE_LENGTH.MIN && title.length > TITLE_LENGTH.MAX) {
    adFormTitle.setCustomValidity('Заголовок объявление должен быть не менее 30 и не более 100 символов')
  }
};
adFormTitle.addEventListener('input', onAdFormTitleInput);

var onAdFormPrice = () => {
  var minPrice = houseTypeMinPrice[adFormHouseType.value];
  if (adFormPrice.value < minPrice) {
    adFormPrice.setCustomValidity(`Для ${TYPE[evt.target.value]} цена за ночь не может быть меньше ${minPrice}`);
  }
};
adFormPrice.addEventListener('change', onAdFormPrice);
var onAdFormHouseTypeChange = (evt) => {
  var minPrice = houseTypeMinPrice[evt.target.value];
  if (adFormPrice.value < minPrice) {
    adFormPrice.setCustomValidity(`Для ${TYPE[evt.target.value]} цена за ночь не может быть меньше ${minPrice}`);
  }
};
adFormHouseType.addEventListener('change', onAdFormHouseTypeChange);